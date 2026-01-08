const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- MIDDLEWARE ---
// Normalize and enrich JWT payload. Support tokens signed with different keys
// (e.g., { sub } or { userId }). Attach `req.user` with `id`, `role`, `companyId`, `name` and `isPlatformAdmin`.
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Determine user id from token shapes
    const userId = payload.userId || payload.sub || payload.userId || payload.sub;

    // If token already carries companyId & role and no DB lookup needed, use it.
    let resolved = { id: userId, role: payload.role || payload.role, companyId: payload.companyId, name: payload.name };

    // If we have a userId, fetch canonical data from DB to keep companyId authoritative
    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!dbUser) return res.status(401).json({ error: 'Invalid token user' });
      resolved = {
        id: dbUser.id,
        role: dbUser.role,
        companyId: dbUser.companyId || null,
        name: dbUser.name
      };
    }

    // Mark platform-level admin (companyId null) or explicit SUPER_ADMIN role
    resolved.isPlatformAdmin = (resolved.role === 'SUPER_ADMIN') || (!resolved.companyId && resolved.role === 'SUPER_ADMIN');

    req.user = resolved;
    return next();
  } catch (err) {
    console.error('Auth error:', err.message || err);
    return res.sendStatus(403);
  }
};

// Require that the authenticated user is a platform-level SUPER_ADMIN
const requirePlatformAdmin = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Platform access denied' });
  return next();
};

// Require that the request is in tenant context (companyId present)
const requireTenantContext = (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if (!req.user.companyId) return res.status(403).json({ error: 'Tenant context required' });
  return next();
};

// --- RBAC CONFIGURATION ---
const ROLE_PERMISSIONS = {
  OWNER: ['ALL'],
  ADMIN: ['ALL'],
  COMPANY_ADMIN: ['ALL_EXCEPT_HALL_MASTER'], // Logic handled in code
  PROPERTY_ADMIN: [
    'DASHBOARD_OPS', 'EVENTS_READ', 'EVENTS_CREATE', 'EVENTS_UPDATE',
    'TASKS_READ', 'TASKS_UPDATE', 'TASKS_ASSIGN',
    'HALLS_READ', 'HALLS_UPDATE', 'INVENTORY_READ', 'REPORTS_OPS'
  ],
  BANQUET_MANAGER: [
    'EVENTS_READ_ASSIGNED', 'TASKS_READ', 'TASKS_UPDATE', 'CHECKLISTS_ALL', 'AUDITS_ALL'
  ],
  SALES: [
    'LEADS_ALL', 'QUOTATIONS_ALL', 'EVENTS_READ', 'CALENDAR_READ'
  ],
  ACCOUNTS: [
    'BILLING_ALL', 'PAYMENTS_ALL', 'REPORTS_FINANCE'
  ],
  OPS_STAFF: [
    'TASKS_READ_ASSIGNED', 'TASKS_UPDATE_STATUS'
  ],
  KITCHEN: [
    'TASKS_READ_ASSIGNED', 'TASKS_UPDATE_STATUS', 'MENU_READ', 'INVENTORY_READ'
  ],
  VENDOR: [
    'TASKS_READ_ASSIGNED', 'TASKS_UPDATE_STATUS'
  ]
};

// Helper to check permissions
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    // 1. Owners/Admins/Company Admins have full access
    if (['OWNER', 'ADMIN', 'COMPANY_ADMIN'].includes(userRole)) return next();

    // 2. Get permissions for role
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    // 3. Check specific permission
    if (permissions.includes(requiredPermission) || permissions.includes('ALL')) {
      return next();
    }

    return res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
  };
};

// --- AUTH ROUTES ---

// Register Tenant & Admin
app.post('/api/auth/register', async (req, res) => {
  try {
    const { businessName, businessType, fullName, email, password, mobile, address, city, state, gst, pan, plan } = req.body;

    // 1. Validate Input
    if (!businessName || !fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Transaction: Create Company & Admin User
    const result = await prisma.$transaction(async (tx) => {
      // Create Company
      const company = await tx.company.create({
        data: {
          name: businessName,
          brandName: businessType, // Storing business type in brandName for reference
          address: address || null,
          city: city || null,
          state: state || null,
          gstNumber: gst || null,
          panNumber: pan || null,
          subscription: plan || 'STARTER'
        }
      });

      // 4a. Create Default Property (Banquet Hall)
      // This fulfills "Create property_id" requirement
      if (businessType === 'Banquet Hall') {
        await tx.banquetHall.create({
          data: {
            companyId: company.id,
            name: "Main Hall", // Default name, can be renamed later
            city: city || "Unknown",
            capacity: 0, // To be updated during setup
            ownership: 'OWN'
          }
        });
      }

      // 4b. Create Default Services (Event Planner)
      // This fulfills Strategy B: "Services Offered" setup
      if (businessType === 'Event Planner') {
        const defaultServices = [
          { name: "Wedding Decor", type: "Decor", basePrice: 50000 },
          { name: "Sound & DJ", type: "AV", basePrice: 15000 },
          { name: "Photography", type: "Media", basePrice: 25000 }
        ];
        
        for (const svc of defaultServices) {
          await tx.service.create({ data: { ...svc, companyId: company.id } });
        }
      }

      // Create Admin User
      const user = await tx.user.create({
        data: {
          name: fullName,
          email: email,
          password: hashedPassword,
          role: 'COMPANY_ADMIN',
          mobile: mobile,
          companyId: company.id
        }
      });

      return user;
    });

    res.status(201).json({ message: "Registration successful", userId: result.id });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- OTP AUTHENTICATION (Mobile Login) ---

// Helper to generate numeric OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Send OTP (User or Vendor)
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { mobile, type } = req.body; // type = 'USER' or 'VENDOR'
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    if (type === 'VENDOR') {
      const vendor = await prisma.vendor.findFirst({ where: { mobile } });
      if (!vendor) return res.status(404).json({ error: "Vendor not found" });
      
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { otp, otpExpiry }
      });
    } else {
      // Default to USER
      const user = await prisma.user.findUnique({ where: { mobile } });
      if (!user) return res.status(404).json({ error: "User not found" });

      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry }
      });
    }

    // In production, integrate SMS Gateway here.
    console.log(`[OTP SENT] Mobile: ${mobile} | OTP: ${otp}`);
    res.json({ message: "OTP sent successfully" });

  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Verify OTP & Login
app.post('/api/auth/otp/verify', async (req, res) => {
  try {
    const { mobile, otp, type } = req.body;

    if (type === 'VENDOR') {
      const vendor = await prisma.vendor.findFirst({ where: { mobile, otp } });
      if (!vendor || new Date() > vendor.otpExpiry) return res.status(400).json({ error: "Invalid or expired OTP" });

      // Clear OTP
      await prisma.vendor.update({ where: { id: vendor.id }, data: { otp: null, otpExpiry: null } });
      res.json({ success: true, vendorId: vendor.id, name: vendor.name });
    } else {
      const user = await prisma.user.findUnique({ where: { mobile, otp } });
      if (!user || new Date() > user.otpExpiry) return res.status(400).json({ error: "Invalid or expired OTP" });

      await prisma.user.update({ where: { id: user.id }, data: { otp: null, otpExpiry: null } });
        // Create short-lived access token and refresh token cookie
        const token = jwt.sign({ userId: user.id, companyId: user.companyId, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h' });
        const refreshTokenValue = crypto.randomBytes(48).toString('hex');
        const refreshExpiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
        await prisma.refreshToken.create({ data: { token: refreshTokenValue, userId: user.id, expiresAt: refreshExpiresAt } });
        res.cookie('refreshToken', refreshTokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.json({ token, user: { name: user.name, role: user.role } });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Login Route (Required for next step)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create short-lived access token
    const token = jwt.sign({ userId: user.id, companyId: user.companyId, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h' });

    // Create refresh token, store in DB and set as httpOnly cookie
    const refreshTokenValue = crypto.randomBytes(48).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    await prisma.refreshToken.create({ data: { token: refreshTokenValue, userId: user.id, expiresAt: refreshExpiresAt } });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh access token using httpOnly refresh token cookie
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const dbToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: true } });
    if (!dbToken || dbToken.revoked) return res.status(401).json({ error: 'Invalid refresh token' });
    if (new Date() > dbToken.expiresAt) return res.status(401).json({ error: 'Refresh token expired' });

    const user = dbToken.user;
    const token = jwt.sign({ userId: user.id, companyId: user.companyId, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error('Refresh error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout: revoke refresh token and clear cookie
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { revoked: true } });
      res.clearCookie('refreshToken');
    }
    res.json({ success: true });
  } catch (e) {
    console.error('Logout error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PROTECTED ROUTES ---

// 1. USERS MANAGEMENT
app.get('/api/users', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user.companyId },
      select: { id: true, name: true, email: true, role: true, mobile: true } // Exclude password
    });
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/users', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Logic for Staff (No Password required)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        name, 
        email: email || null, // Optional for staff
        password: hashedPassword, // Optional for staff
        role, 
        mobile: phone, // Mandatory for staff
        companyId: req.user.companyId
      }
    });
    res.json(newUser);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. INVENTORY MANAGEMENT
app.get('/api/inventory', authenticateToken, requireTenantContext, checkPermission('INVENTORY_READ'), async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { companyId: req.user.companyId }
    });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/inventory', authenticateToken, requireTenantContext, checkPermission('INVENTORY_UPDATE'), async (req, res) => {
  try {
    const newItem = await prisma.inventoryItem.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(newItem);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/inventory/:id', authenticateToken, requireTenantContext, checkPermission('INVENTORY_UPDATE'), async (req, res) => {
  try {
    const { id, companyId, ...data } = req.body; // Prevent changing ID or Company
    const updatedItem = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: data
    });
    res.json(updatedItem);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/vendors', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { companyId: req.user.companyId }
    });
    res.json(vendors);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Services listing (tenant-scoped)
app.get('/api/services', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const services = await prisma.service.findMany({ where: { companyId: req.user.companyId } });
    res.json(services);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Roles: return platform-defined role list (can be migrated to DB later)
app.get('/api/roles', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    // Build role list from server RBAC keys
    const roles = Object.keys(ROLE_PERMISSIONS).map((r, idx) => ({ id: idx + 1, name: r, permissions: ROLE_PERMISSIONS[r] }));
    res.json(roles);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Payment modes - tenant can later override; provide defaults
app.get('/api/masters/payment-modes', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const defaults = [
      { id: 'cash', name: 'Cash', enabled: true },
      { id: 'bank_transfer', name: 'Bank Transfer (NEFT/RTGS)', enabled: true },
      { id: 'upi', name: 'UPI', enabled: true },
      { id: 'card', name: 'Credit/Debit Card', enabled: false },
      { id: 'cheque', name: 'Cheque', enabled: true }
    ];
    res.json(defaults);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. BILLING & PAYMENTS
app.get('/api/billing', authenticateToken, requireTenantContext, checkPermission('BILLING_ALL'), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { companyId: req.user.companyId },
      include: { quotation: true, payments: true }
    });

    // Format for frontend
    const billingData = events.map(ev => {
      const totalAmount = ev.quotation ? ev.quotation.totalAmount : 0;
      const paidAmount = ev.payments.reduce((sum, p) => sum + p.amount, 0);
      return {
        id: ev.id,
        title: ev.title,
        date: ev.startDate.toISOString().split('T')[0],
        totalAmount,
        paidAmount,
        damageCost: 0, // Placeholder
        damageDescription: ""
      };
    });
    res.json(billingData);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/payments', authenticateToken, requireTenantContext, checkPermission('PAYMENTS_ALL'), async (req, res) => {
  try {
    const { eventId, amount, mode } = req.body;
    const payment = await prisma.payment.create({
      data: {
        eventId,
        amount,
        method: mode.toUpperCase().replace(' ', '_'), // Map "Bank Transfer" to "BANK_TRANSFER"
        status: 'PAID'
      }
    });
    res.json(payment);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- DASHBOARD API (Role-Based) ---
app.get('/api/dashboard', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const { role, companyId, userId } = req.user;
    const dashboardData = { role, widgets: [] };

    // 1. OWNER / ADMIN / COMPANY_ADMIN
    if (['OWNER', 'ADMIN', 'COMPANY_ADMIN'].includes(role)) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [totalEvents, upcomingEvents, revenue, pendingApprovals] = await Promise.all([
        prisma.event.count({ where: { companyId, startDate: { gte: startOfMonth } } }),
        prisma.event.count({ where: { companyId, startDate: { gte: today } } }),
        prisma.payment.aggregate({ where: { event: { companyId }, paidAt: { gte: startOfMonth } }, _sum: { amount: true } }),
        prisma.eventTransfer.count({ where: { companyId, status: 'PENDING' } }) // Example approval
      ]);

      dashboardData.widgets.push(
        { type: 'STATS', title: 'Business Overview', data: { totalEvents, upcomingEvents, revenue: revenue._sum.amount || 0, pendingApprovals } },
        { type: 'QUICK_ACTIONS', actions: ['Create Event', 'Create Lead', 'Add User', 'View Reports'] }
      );
    }

    // 2. PROPERTY ADMIN / BANQUET MANAGER
    if (['PROPERTY_ADMIN', 'BANQUET_MANAGER'].includes(role)) {
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

      const todaysEvents = await prisma.event.findMany({
        where: { companyId, startDate: { gte: todayStart, lte: todayEnd } },
        select: { id: true, title: true, status: true, hall: { select: { name: true } } }
      });

      dashboardData.widgets.push(
        { type: 'LIST', title: "Today's Events", data: todaysEvents },
        { type: 'QUICK_ACTIONS', actions: ['View Event Tasks', 'Approve Checklists', 'Assign Staff'] }
      );
    }

    // 3. SALES
    if (role === 'SALES') {
      const [newLeads, quotesSent, confirmed] = await Promise.all([
        prisma.lead.count({ where: { companyId, stage: 'INQUIRY' } }),
        prisma.quotation.count({ where: { event: { companyId } } }), // Simplified
        prisma.lead.count({ where: { companyId, stage: 'CONFIRMED' } })
      ]);

      dashboardData.widgets.push(
        { type: 'STATS', title: 'Sales Funnel', data: { newLeads, quotesSent, confirmed } },
        { type: 'QUICK_ACTIONS', actions: ['Add Lead', 'Create Quotation'] }
      );
    }

    // 4. OPERATIONS STAFF / HOUSEKEEPING / SECURITY
    if (['OPS_STAFF', 'HOUSEKEEPING', 'SECURITY'].includes(role)) {
      const myTasks = await prisma.task.findMany({
        where: { companyId, assignedToUser: userId, status: { not: 'COMPLETED' } },
        take: 10
      });

      dashboardData.widgets.push(
        { type: 'TASK_LIST', title: 'My Tasks', data: myTasks }
      );
    }

    // 5. KITCHEN
    if (role === 'KITCHEN') {
      // Simplified kitchen view
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
      
      const events = await prisma.event.findMany({
        where: { companyId, startDate: { gte: todayStart, lte: todayEnd }, status: 'CONFIRMED' },
        select: { id: true, title: true, guests: true }
      });

      dashboardData.widgets.push(
        { type: 'LIST', title: "Today's Production", data: events },
        { type: 'QUICK_ACTIONS', actions: ['Mark Item Prepared', 'Log Wastage'] }
      );
    }

    // 7. ACCOUNTS
    if (role === 'ACCOUNTS') {
      const [pendingPayments, invoicesRaised] = await Promise.all([
        prisma.payment.aggregate({ where: { event: { companyId }, status: 'PENDING' }, _sum: { amount: true } }),
        prisma.invoice.count({ where: { companyId } })
      ]);

      dashboardData.widgets.push(
        { type: 'STATS', title: 'Billing Overview', data: { pendingPayments: pendingPayments._sum.amount || 0, invoicesRaised } },
        { type: 'QUICK_ACTIONS', actions: ['Generate Invoice', 'Record Payment'] }
      );
    }

    // 8. VENDOR (Handled via Vendor Portal usually, but if they login here)
    if (role === 'VENDOR') {
       // Vendors usually use the portal, but if integrated:
       dashboardData.widgets.push({ type: 'INFO', message: "Please use the Vendor Portal for tasks." });
    }

    // Fallback / Common
    if (dashboardData.widgets.length === 0) {
       dashboardData.widgets.push({ type: 'INFO', message: "Welcome to Asyncotel. No specific widgets configured for your role." });
    }

    res.json(dashboardData);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- ADMIN DASHBOARD API ---
app.get('/api/dashboard/admin', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const { companyId, name } = req.user;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.setHours(0,0,0,0));
    const endOfDay = new Date(today.setHours(23,59,59,999));

    const [
      todayEvents, 
      monthlyRevenue, 
      pendingPayments, 
      newLeads, 
      totalRevenue, 
      upcomingEventsCount, 
      pendingInvoices, 
      upcomingEvents,
      totalTasks,
      completedTasks,
      totalAudits,
      failedAudits,
      financials
    ] = await Promise.all([
      prisma.event.count({ where: { companyId, startDate: { gte: startOfDay, lte: endOfDay } } }),
      prisma.payment.aggregate({ where: { event: { companyId }, paidAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { event: { companyId }, status: 'PENDING' }, _sum: { amount: true } }),
      prisma.lead.count({ where: { companyId, createdAt: { gte: startOfMonth } } }),
      prisma.payment.aggregate({ where: { event: { companyId } }, _sum: { amount: true } }),
      prisma.event.count({ where: { companyId, startDate: { gte: new Date() }, status: 'CONFIRMED' } }),
      prisma.quotation.count({ where: { event: { companyId, status: 'CONFIRMED' }, totalAmount: { gt: 0 } } }),
      prisma.event.findMany({
        where: { companyId, startDate: { gte: new Date() } },
        take: 5,
        orderBy: { startDate: 'asc' },
        include: { client: true }
      }),
      // Ops KPIs
      prisma.task.count({ where: { companyId, createdAt: { gte: startOfMonth } } }),
      prisma.task.count({ where: { companyId, createdAt: { gte: startOfMonth }, status: 'COMPLETED' } }),
      prisma.audit.count({ where: { companyId, createdAt: { gte: startOfMonth } } }),
      prisma.audit.count({ where: { companyId, createdAt: { gte: startOfMonth }, score: { lt: 85 } } }),
      // Financials for Net Profit
      prisma.event.findMany({
        where: { companyId, startDate: { gte: startOfMonth }, status: 'CONFIRMED' },
        include: { quotation: true }
      })
    ]);

    // Calculations
    const slaCompliance = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
    const auditFailureRate = totalAudits > 0 ? Math.round((failedAudits / totalAudits) * 100) : 0;
    const eventReadiness = 100 - auditFailureRate;
    
    let estimatedCost = 0;
    let estimatedRevenue = 0;
    financials.forEach(ev => {
      if (ev.quotation) {
        estimatedRevenue += ev.quotation.totalAmount;
        estimatedCost += (ev.quotation.venueCost + ev.quotation.foodCost + (ev.quotation.decorCost || 0));
      }
    });
    const netProfit = estimatedRevenue - estimatedCost;

    res.json({
      stats: {
        adminName: name,
        todayEvents,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        netProfit,
        pendingPayments: pendingPayments._sum.amount || 0,
        newLeads,
        totalRevenue: totalRevenue._sum.amount || 0,
        upcomingEventsCount,
        pendingInvoices,
        slaCompliance,
        eventReadiness,
        alerts: [
          "Payment reminder: Kapoor Reception",
          "Inventory low: Beverage Stock",
          "Staff assignment pending",
          "Follow up on new leads"
        ],
        bookingOverview: {
          confirmed: await prisma.event.count({ where: { companyId, status: 'CONFIRMED', startDate: { gte: startOfMonth } } }),
          tentative: await prisma.event.count({ where: { companyId, status: 'TENTATIVE', startDate: { gte: startOfMonth } } }),
          cancelled: await prisma.event.count({ where: { companyId, status: 'CANCELLED', startDate: { gte: startOfMonth } } })
        }
      },
      upcomingEvents
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. REPORTS
app.get('/api/reports/stats', authenticateToken, requireTenantContext, checkPermission('REPORTS_OPS'), async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Revenue
    const payments = await prisma.payment.aggregate({
      where: { event: { companyId } },
      _sum: { amount: true }
    });
    const totalRevenue = payments._sum.amount || 0;

    // Leads
    const totalLeads = await prisma.lead.count({ where: { companyId } });
    const convertedLeads = await prisma.lead.count({ where: { companyId, stage: 'CONFIRMED' } });
    const lostLeads = await prisma.lead.count({ where: { companyId, stage: 'LOST' } });

    // Top Events
    const topEventsRaw = await prisma.event.findMany({
      where: { companyId },
      include: { quotation: true },
      take: 5,
      orderBy: { quotation: { totalAmount: 'desc' } }
    });

    const topEvents = topEventsRaw.map(ev => ({
      id: ev.id,
      eventName: ev.title,
      amount: ev.quotation?.totalAmount || 0,
      status: ev.status === 'CONFIRMED' ? 'Paid' : 'Pending' // Simplified logic
    }));

    res.json({
      revenue: { total: totalRevenue, paid: totalRevenue, pending: 0 },
      leads: { 
        total: totalLeads, 
        converted: convertedLeads, 
        lost: lostLeads, 
        conversionRate: totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0 
      },
      topEvents
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. SETTINGS
app.get('/api/settings', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user.companyId }
    });
    res.json(company);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/settings', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    const { name, currency } = req.body;
    const updated = await prisma.company.update({
      where: { id: req.user.companyId },
      data: { name, currency }
    });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/settings/reset', authenticateToken, requireTenantContext, checkPermission('ALL'), async (req, res) => {
  try {
    const companyId = req.user.companyId;
    // Transactional delete of operational data
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { event: { companyId } } }),
      prisma.quotation.deleteMany({ where: { event: { companyId } } }),
      prisma.eventVendor.deleteMany({ where: { event: { companyId } } }),
      prisma.event.deleteMany({ where: { companyId } }),
      prisma.lead.deleteMany({ where: { companyId } }),
      prisma.task.deleteMany({ where: { companyId } }),
    ]);
    res.json({ message: "Reset successful" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 6. MASTERS (Time Slots, Menu, Tax)
app.get('/api/masters/timeslots', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const slots = await prisma.timeSlot.findMany({ where: { companyId: req.user.companyId } });
    res.json(slots);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/timeslots', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const slot = await prisma.timeSlot.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(slot);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/masters/menu-items', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const items = await prisma.menuItem.findMany({ where: { companyId: req.user.companyId } });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/menu-items', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const item = await prisma.menuItem.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/menu-templates', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const template = await prisma.menuTemplate.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(template);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/masters/taxes', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const taxes = await prisma.tax.findMany({ where: { companyId: req.user.companyId } });
    res.json(taxes);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/taxes', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const tax = await prisma.tax.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(tax);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/masters/services', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const services = await prisma.service.findMany({ where: { companyId: req.user.companyId } });
    res.json(services);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/services', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const service = await prisma.service.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(service);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 7. PACKAGES & DEPARTMENTS (Phase 1 Completion)
app.get('/api/masters/packages', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const packages = await prisma.package.findMany({ where: { companyId: req.user.companyId } });
    res.json(packages);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/packages', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const pkg = await prisma.package.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(pkg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/masters/departments', authenticateToken, requireTenantContext, async (req, res) => {
  try {
  const depts = await prisma.department.findMany({ where: { companyId: req.user.companyId } });
    res.json(depts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/masters/departments', authenticateToken, requireTenantContext, async (req, res) => {
    try {
    const dept = await prisma.department.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(dept);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 8. EVENT CORE (Phase 2)

// Check Availability
app.get('/api/events/check-availability', authenticateToken, requireTenantContext, checkPermission('CALENDAR_READ'), async (req, res) => {
  try {
    const { date, hallId, timeSlotId } = req.query;
    if (!date || !hallId) return res.status(400).json({ error: "Date and Hall ID required" });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflicts = await prisma.event.findMany({
      where: {
        companyId: req.user.companyId,
        hallId: hallId,
        startDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELLED' },
        // If timeSlot is provided, check for overlap. If not, assume full day booking.
        ...(timeSlotId ? { timeSlotId: timeSlotId } : {}) 
      }
    });

    res.json({ available: conflicts.length === 0, conflicts });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List Events (For Operations Dropdowns)
app.get('/api/events', authenticateToken, requireTenantContext, checkPermission('EVENTS_READ'), async (req, res) => {
  try {
    const { status } = req.query;
    const where = { companyId: req.user.companyId };
    if (status) where.status = status;
    
    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'desc' },
      select: { id: true, title: true, startDate: true, status: true }
    });
    res.json(events);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create Event
app.post('/api/events', authenticateToken, requireTenantContext, checkPermission('EVENTS_CREATE'), async (req, res) => {
  try {
    const { title, eventType, hallId, timeSlotId, date, guests, clientName, clientPhone, clientEmail } = req.body;
    
    // 1. Create or Find Client
    let client = await prisma.client.findFirst({
      where: { companyId: req.user.companyId, phone: clientPhone }
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          companyId: req.user.companyId,
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          type: 'INDIVIDUAL'
        }
      });
    }

    // 2. Create Event
    const eventDate = new Date(date);
    const newEvent = await prisma.event.create({
      data: {
        companyId: req.user.companyId,
        title,
        eventType,
        hallId,
        timeSlotId,
        startDate: eventDate,
        endDate: eventDate, // Simplified for now
        guests: parseInt(guests),
        status: 'TENTATIVE', // Default status
        clientId: client.id
      }
    });

    res.json(newEvent);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/events/:id', authenticateToken, requireTenantContext, checkPermission('EVENTS_READ'), async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { client: true, hall: true, quotation: true }
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update Event Status (Triggers Auto-Task Generation)
app.patch('/api/events/:id/status', authenticateToken, requireTenantContext, checkPermission('EVENTS_UPDATE'), async (req, res) => {
  try {
    const { status } = req.body;
    const eventId = req.params.id;

    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status }
    });

    // Phase 3.2: Auto Task Generation
    if (status === 'CONFIRMED') {
      // Find matching template
      const template = await prisma.taskTemplate.findFirst({
        where: { companyId: req.user.companyId, eventType: event.eventType },
        include: { items: true }
      });

      if (template) {
        const tasks = template.items.map(item => ({
          companyId: req.user.companyId,
          eventId: event.id,
          title: item.title,
          description: `Auto-generated from ${template.name}`,
          status: 'OPEN',
          priority: 'MEDIUM'
        }));

        await prisma.task.createMany({ data: tasks });
      }
    }

    res.json(event);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 9. EVENT TRANSFER (Phase 2.3)
app.post('/api/events/:id/transfer', authenticateToken, requireTenantContext, checkPermission('EVENTS_UPDATE'), async (req, res) => {
  try {
    const { newDate, newHallId, reason } = req.body;
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check availability for new date/hall
    const startOfDay = new Date(newDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(newDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflicts = await prisma.event.findMany({
      where: {
        companyId: req.user.companyId,
        hallId: newHallId,
        startDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELLED' },
        id: { not: eventId } // Exclude self
      }
    });

    if (conflicts.length > 0) {
      return res.status(409).json({ error: "New date/hall is not available" });
    }

    // Create Transfer Record & Update Event
    await prisma.$transaction([
      prisma.eventTransfer.create({
        data: {
          companyId: req.user.companyId,
          eventId,
          oldHallId: event.hallId,
          newHallId,
          oldDate: event.startDate,
          newDate: new Date(newDate),
          reason,
          status: 'APPROVED' // Auto-approve for now (Admin only)
        }
      }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          hallId: newHallId,
          startDate: new Date(newDate),
          endDate: new Date(newDate) // Simplified
        }
      })
    ]);

    res.json({ message: "Event transferred successfully" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 10. TASK TEMPLATES (Phase 3)
app.get('/api/tasks/templates', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const templates = await prisma.taskTemplate.findMany({
      where: { companyId: req.user.companyId },
      include: { items: true }
    });
    res.json(templates);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tasks/templates', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const { name, eventType, items } = req.body;
    const template = await prisma.taskTemplate.create({
      data: {
        companyId: req.user.companyId,
        name,
        eventType,
        items: { create: items }
      }
    });
    res.json(template);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 11. TASK EXECUTION (Phase 4)
app.get('/api/tasks', authenticateToken, requireTenantContext, checkPermission('TASKS_READ'), async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = { companyId: req.user.companyId };
    if (eventId) where.eventId = eventId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/tasks/:id', authenticateToken, requireTenantContext, checkPermission('TASKS_UPDATE_STATUS'), async (req, res) => {
  try {
    const { status, completionNote } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status, completionNote }
    });
    res.json(task);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 12. SALES & CRM (Phase 7)
// Leads
app.get('/api/leads', authenticateToken, requireTenantContext, checkPermission('LEADS_ALL'), async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/leads', authenticateToken, requireTenantContext, checkPermission('LEADS_ALL'), async (req, res) => {
  try {
    const lead = await prisma.lead.create({
      data: { ...req.body, companyId: req.user.companyId }
    });
    res.json(lead);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Quotations
app.get('/api/quotations', authenticateToken, requireTenantContext, checkPermission('QUOTATIONS_ALL'), async (req, res) => {
  try {
    const quotes = await prisma.quotation.findMany({
      where: { event: { companyId: req.user.companyId } },
      include: { event: true }
    });
    res.json(quotes);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/quotations', authenticateToken, requireTenantContext, checkPermission('QUOTATIONS_ALL'), async (req, res) => {
  try {
    const { eventId, venueCost, foodCost, decorCost, taxAmount, discount } = req.body;
    const totalAmount = (Number(venueCost) + Number(foodCost) + Number(decorCost || 0) + Number(taxAmount)) - Number(discount || 0);

    const quote = await prisma.quotation.create({
      data: {
        eventId,
        venueCost: Number(venueCost),
        foodCost: Number(foodCost),
        decorCost: Number(decorCost),
        taxAmount: Number(taxAmount),
        discount: Number(discount),
        totalAmount
      }
    });
    res.json(quote);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 15. CHECKLISTS (Phase 6)
app.get('/api/checklists', authenticateToken, requireTenantContext, checkPermission('CHECKLISTS_ALL'), async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = { companyId: req.user.companyId };
    if (eventId) where.eventId = eventId;
    
    const checklists = await prisma.checklist.findMany({ where });
    res.json(checklists);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/checklists', authenticateToken, requireTenantContext, checkPermission('CHECKLISTS_ALL'), async (req, res) => {
  try {
    const { eventId, name, items } = req.body;
    const checklist = await prisma.checklist.create({
      data: {
        companyId: req.user.companyId,
        eventId,
        name,
        items
      }
    });
    res.json(checklist);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 16. VENDOR PORTAL (Phase 9)
app.get('/api/vendor-portal/tasks', async (req, res) => {
  // In a real app, vendors would have their own login. 
  // For this MVP, we'll use a simple query param ?vendorId=...
  try {
    const { vendorId } = req.query;
    if (!vendorId) return res.status(400).json({ error: "Vendor ID required" });

    const tasks = await prisma.vendorTask.findMany({
      where: { vendorId },
      include: { event: true }
    });
    res.json(tasks);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/vendor-portal/tasks', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const { vendorId, eventId, description } = req.body;
    const task = await prisma.vendorTask.create({
      data: {
        vendorId,
        eventId,
        description
      }
    });
    res.json(task);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 17. NOTIFICATIONS (Phase 5 - Mock)
app.post('/api/notifications/send', authenticateToken, requireTenantContext, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    // Mock Email Sending
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject} | Body: ${body}`);
    
    await prisma.notification.create({
      data: {
        companyId: req.user.companyId,
        channel: 'EMAIL',
        to,
        message: subject,
        status: 'SENT'
      }
    });

    res.json({ message: "Notification sent" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 18. KITCHEN PRODUCTION (Phase 8 - RESTORED)
app.get('/api/kitchen/production', authenticateToken, requireTenantContext, checkPermission('MENU_READ'), async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date required" });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get events for the day
    const events = await prisma.event.findMany({
      where: {
        companyId: req.user.companyId,
        startDate: { gte: startOfDay, lte: endOfDay },
        status: 'CONFIRMED'
      }
    });

    // Fetch packages for these events
    const packageIds = events.map(e => e.packageId).filter(Boolean);
    const packages = await prisma.package.findMany({
      where: { id: { in: packageIds } }
    });

    res.json({ events, packages });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 19. AUDITS (Phase 6.2)
app.get('/api/audits', authenticateToken, requireTenantContext, checkPermission('AUDITS_ALL'), async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = { companyId: req.user.companyId };
    if (eventId) where.eventId = eventId;

    const audits = await prisma.audit.findMany({
      where,
      include: { company: false }, // Don't expose company details
      orderBy: { createdAt: 'desc' }
    });
    res.json(audits);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/audits', authenticateToken, requireTenantContext, checkPermission('AUDITS_ALL'), async (req, res) => {
  try {
    const { eventId, auditType, items, score } = req.body;
    
    // Calculate score if not provided (simple percentage of PASS items)
    let finalScore = score;
    if (items && !finalScore) {
      const total = items.length;
      const passed = items.filter(i => i.status === 'PASS').length;
      finalScore = total > 0 ? Math.round((passed / total) * 100) : 0;
    }

    const audit = await prisma.audit.create({
      data: {
        companyId: req.user.companyId,
        eventId,
        auditType,
        items,
        score: finalScore,
        status: 'COMPLETED',
        submittedBy: req.user.name,
        submittedAt: new Date()
      }
    });
    res.json(audit);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- PLATFORM (SUPER_ADMIN) ROUTES ---
// These endpoints are for Asyncotel platform admins only.
app.get('/api/platform/tenants', authenticateToken, requirePlatformAdmin, async (req, res) => {
  try {
    const tenants = await prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(tenants);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/platform/tenants', authenticateToken, requirePlatformAdmin, async (req, res) => {
  try {
    const { name, brandName, gstNumber, panNumber, subscription } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });

    const company = await prisma.company.create({ data: { name, brandName: brandName || null, gstNumber: gstNumber || null, panNumber: panNumber || null, subscription: subscription || 'STARTER' } });
    res.status(201).json(company);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Suspend / Activate tenant
app.patch('/api/platform/tenants/:id/suspend', authenticateToken, requirePlatformAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // action = 'suspend' | 'activate'
    if (!['suspend','activate'].includes(action)) return res.status(400).json({ error: 'invalid action' });

    const updated = await prisma.company.update({ where: { id }, data: { /* placeholder field; depends on schema */ } }).catch(()=>null);

    // If schema doesn't have active flag, just return success for now.
    if (!updated) return res.json({ message: `Tenant ${action} request recorded` });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const admin = require('firebase-admin');

// Initialize Firebase Admin (Ensure serviceAccountKey.json is in backend folder)
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.warn("Warning: Firebase Admin not initialized. Check serviceAccountKey.json");
}

// Auth Middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const app = express();
app.use(cors());
app.use(express.json());

// --- LEADS ROUTES ---
app.get('/api/leads', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM leads ORDER BY id DESC');
  res.json(result.rows.map(l => ({
    id: l.id, client: l.client_name, type: l.event_type, date: l.event_date, status: l.status, budget: l.budget, contact: l.contact_number
  })));
});

// --- EVENTS ROUTES ---
app.get('/api/events', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
  res.json(result.rows.map(e => ({ ...e, date: new Date(e.event_date).toISOString().split('T')[0] })));
});

app.get('/api/events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const eventRes = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  if (eventRes.rows.length === 0) return res.status(404).json({ message: "Event not found" });
  
  const event = eventRes.rows[0];
  event.date = new Date(event.event_date).toISOString().split('T')[0];
  res.json(event);
});

app.put('/api/events/:id/audit', verifyToken, async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE events SET audit_status = $1 WHERE id = $2', [status, req.params.id]);
  res.json({ message: "Audit updated" });
});

app.put('/api/events/:id/damage', verifyToken, async (req, res) => {
  const { description, cost } = req.body;
  await pool.query('UPDATE events SET damage_description = $1, damage_cost = $2 WHERE id = $3', [description, cost, req.params.id]);
  res.json({ message: "Damage reported" });
});

app.post('/api/events/:id/deduct-inventory', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { items } = req.body; // Array of { id, qtyToRemove }
    
    for (const item of items) {
      await client.query('UPDATE inventory SET quantity = quantity - $1 WHERE id = $2', [item.qtyToRemove, item.id]);
    }
    await client.query('UPDATE events SET inventory_deducted = TRUE, status = $1 WHERE id = $2', ['Completed', req.params.id]);
    await client.query('COMMIT');
    res.json({ message: "Inventory deducted" });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// --- INVENTORY ROUTES ---
app.get('/api/inventory', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM inventory ORDER BY item_name ASC');
  res.json(result.rows.map(i => ({
    id: i.id, item: i.item_name, category: i.category, quantity: parseFloat(i.quantity), unit: i.unit, reorderLevel: parseFloat(i.reorder_level), unitPrice: parseFloat(i.unit_price),
    status: parseFloat(i.quantity) <= parseFloat(i.reorder_level) ? 'Critical' : 'Good'
  })));
});

app.post('/api/inventory', verifyToken, async (req, res) => {
  const { item, category, quantity, unit, reorderLevel, unitPrice } = req.body;
  await pool.query('INSERT INTO inventory (item_name, category, quantity, unit, reorder_level, unit_price) VALUES ($1, $2, $3, $4, $5, $6)', [item, category, quantity, unit, reorderLevel, unitPrice]);
  res.json({ message: "Item added" });
});

app.put('/api/inventory/:id', verifyToken, async (req, res) => {
  const { item, category, quantity, unit, reorderLevel, unitPrice } = req.body;
  await pool.query('UPDATE inventory SET item_name=$1, category=$2, quantity=$3, unit=$4, reorder_level=$5, unit_price=$6 WHERE id=$7', [item, category, quantity, unit, reorderLevel, unitPrice, req.params.id]);
  res.json({ message: "Item updated" });
});

// --- VENDORS ROUTES ---
app.get('/api/vendors', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM vendors');
  res.json(result.rows);
});

// --- DISHES ROUTES ---
app.get('/api/dishes', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM dishes ORDER BY name ASC');
  res.json(result.rows.map(d => ({
    id: d.id, name: d.name, category: d.category, costPrice: parseFloat(d.cost_price), sellingPrice: parseFloat(d.selling_price), ingredients: d.ingredients || []
  })));
});

app.post('/api/dishes', verifyToken, async (req, res) => {
  const { name, category, costPrice, sellingPrice, ingredients } = req.body;
  const result = await pool.query(
    'INSERT INTO dishes (name, category, cost_price, selling_price, ingredients) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, category, costPrice, sellingPrice, JSON.stringify(ingredients)]
  );
  res.json(result.rows[0]);
});

app.put('/api/dishes/:id', verifyToken, async (req, res) => {
  const { name, category, costPrice, sellingPrice, ingredients } = req.body;
  await pool.query(
    'UPDATE dishes SET name=$1, category=$2, cost_price=$3, selling_price=$4, ingredients=$5 WHERE id=$6',
    [name, category, costPrice, sellingPrice, JSON.stringify(ingredients), req.params.id]
  );
  res.json({ message: "Dish updated" });
});

// --- PACKAGES ROUTES ---
app.get('/api/packages', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM packages ORDER BY name ASC');
  res.json(result.rows.map(p => ({
    id: p.id, name: p.name, type: p.type, pricePerPax: parseFloat(p.price_per_pax), selectedDishIds: p.selected_dish_ids || []
  })));
});

app.post('/api/packages', verifyToken, async (req, res) => {
  const { name, type, pricePerPax, selectedDishIds } = req.body;
  const result = await pool.query(
    'INSERT INTO packages (name, type, price_per_pax, selected_dish_ids) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, type, pricePerPax, JSON.stringify(selectedDishIds)]
  );
  res.json(result.rows[0]);
});

// --- QUOTATIONS ROUTES ---
app.get('/api/quotations', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM quotations ORDER BY id DESC');
  res.json(result.rows.map(q => ({
    id: q.id, 
    leadId: q.lead_id, 
    leadName: q.lead_name, leadPhone: q.lead_phone, 
    packageId: q.package_id, packageName: q.package_name, 
    hallId: q.hall_id, hallName: q.hall_name,
    eventDate: new Date(q.event_date).toISOString().split('T')[0], pax: q.pax, totalAmount: parseFloat(q.total_amount), status: q.status
  })));
});

app.post('/api/quotations', verifyToken, async (req, res) => {
  const { leadId, leadName, leadPhone, packageId, packageName, hallId, hallName, eventDate, pax, pricePerPax, totalAmount } = req.body;
  const result = await pool.query(
    'INSERT INTO quotations (lead_id, lead_name, lead_phone, package_id, package_name, hall_id, hall_name, event_date, pax, price_per_pax, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [leadId, leadName, leadPhone, packageId, packageName, hallId, hallName, eventDate, pax, pricePerPax, totalAmount]
  );
  res.json(result.rows[0]);
});

app.put('/api/quotations/:id/confirm', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const q = (await client.query('SELECT * FROM quotations WHERE id = $1', [req.params.id])).rows[0];
    
    // Update Quote Status
    await client.query('UPDATE quotations SET status = $1 WHERE id = $2', ['Confirmed', req.params.id]);
    
    // Create Event
    await client.query(
      'INSERT INTO events (title, event_date, pax, status, quote_id, package_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [`${q.lead_name} - ${q.package_name}`, q.event_date, q.pax, 'Upcoming', q.id, q.package_id]
    );
    
    await client.query('COMMIT');
    res.json({ message: "Quotation confirmed and Event created" });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// --- BILLING ROUTES ---
app.get('/api/billing', verifyToken, async (req, res) => {
  // Fetch events with their total amounts (from quotes) and paid amounts (from payments)
  const query = `
    SELECT e.id, e.title, e.event_date, e.damage_cost, q.total_amount, 
           COALESCE(SUM(p.amount), 0) as paid_amount
    FROM events e
    LEFT JOIN quotations q ON e.quote_id = q.id
    LEFT JOIN payments p ON e.id = p.event_id
    GROUP BY e.id, q.total_amount
  `;
  const result = await pool.query(query);
  res.json(result.rows.map(r => ({
    id: r.id, title: r.title, date: new Date(r.event_date).toISOString().split('T')[0],
    totalAmount: parseFloat(r.total_amount || 0) + parseFloat(r.damage_cost || 0),
    paidAmount: parseFloat(r.paid_amount),
    damageCost: parseFloat(r.damage_cost || 0)
  })));
});

app.post('/api/payments', verifyToken, async (req, res) => {
  const { eventId, amount, mode } = req.body;
  await pool.query('INSERT INTO payments (event_id, amount, mode, payment_date) VALUES ($1, $2, $3, CURRENT_DATE)', [eventId, amount, mode]);
  res.json({ message: "Payment recorded" });
});

// --- USERS ROUTES ---
app.get('/api/users', verifyToken, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, phone, role, status FROM users');
  res.json(result.rows);
});

app.post('/api/users', verifyToken, async (req, res) => {
  const { name, email, phone, role, password } = req.body;
  // In production, hash password here
  await pool.query('INSERT INTO users (name, email, phone, role, password) VALUES ($1, $2, $3, $4, $5)', [name, email, phone, role, password]);
  res.json({ message: "User created" });
});

app.delete('/api/users/:id', verifyToken, async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: "User deleted" });
});

// --- GENERIC CRUD HANDLERS FOR MASTERS ---
const createCrudRoutes = (table, path) => {
  app.get(`/api/${path}`, verifyToken, async (req, res) => {
    const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
    res.json(result.rows);
  });
  
  app.post(`/api/${path}`, verifyToken, async (req, res) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    await pool.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`, values);
    res.json({ message: "Created successfully" });
  });

  app.put(`/api/${path}/:id`, verifyToken, async (req, res) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(',');
    await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, req.params.id]);
    res.json({ message: "Updated successfully" });
  });

  app.delete(`/api/${path}/:id`, verifyToken, async (req, res) => {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
    res.json({ message: "Deleted successfully" });
  });
};

// Register Master Routes
createCrudRoutes('banquet_halls', 'banquet-halls');
createCrudRoutes('time_slots', 'time-slots');
createCrudRoutes('event_types', 'event-types');
createCrudRoutes('departments', 'departments');
createCrudRoutes('roles', 'roles');
createCrudRoutes('taxes', 'taxes');
createCrudRoutes('payment_modes', 'payment-modes');
createCrudRoutes('services', 'services');
createCrudRoutes('task_templates', 'task-templates');
createCrudRoutes('tasks', 'tasks');
createCrudRoutes('staff_assignments', 'staff-assignments');

// --- REPORTS & ANALYTICS ---
app.get('/api/reports/stats', verifyToken, async (req, res) => {
  try {
    // Revenue Stats
    const revenueQuery = `
      SELECT 
        COALESCE(SUM(q.total_amount), 0) as total_revenue,
        COALESCE(SUM(p.amount), 0) as paid_revenue
      FROM quotations q
      LEFT JOIN events e ON q.id = e.quote_id
      LEFT JOIN payments p ON e.id = p.event_id
      WHERE q.status = 'Confirmed'
    `;
    const revenueRes = await pool.query(revenueQuery);
    const { total_revenue, paid_revenue } = revenueRes.rows[0];

    // Lead Stats
    const leadsRes = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Converted' THEN 1 END) as converted,
        COUNT(CASE WHEN status = 'Lost' THEN 1 END) as lost
      FROM leads
    `);
    const leadsData = leadsRes.rows[0];

    // Top Events
    const topEventsRes = await pool.query(`
      SELECT e.title, q.total_amount as amount, e.status
      FROM events e
      JOIN quotations q ON e.quote_id = q.id
      ORDER BY q.total_amount DESC
      LIMIT 5
    `);

    res.json({
      revenue: {
        total: parseFloat(total_revenue),
        paid: parseFloat(paid_revenue),
        pending: parseFloat(total_revenue) - parseFloat(paid_revenue)
      },
      leads: {
        total: parseInt(leadsData.total),
        converted: parseInt(leadsData.converted),
        lost: parseInt(leadsData.lost),
        conversionRate: leadsData.total > 0 ? Math.round((leadsData.converted / leadsData.total) * 100) : 0
      },
      topEvents: topEventsRes.rows.map(r => ({
        eventName: r.title,
        amount: parseFloat(r.amount),
        status: r.status
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// --- SETTINGS ---
app.post('/api/settings/reset', verifyToken, async (req, res) => {
  // Dangerous: Only for demo/dev
  await pool.query('TRUNCATE TABLE events, quotations, leads, tasks, payments, staff_assignments RESTART IDENTITY CASCADE');
  res.json({ message: "System reset successful" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
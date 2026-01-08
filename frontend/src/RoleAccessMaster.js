/**
 * ROLE & ACCESS MASTER
 * Requirement #10: Tech Critical Data Segregation & Access Levels
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',       // Asyncotel Internal
  INTERNAL_TEAM: 'INTERNAL_TEAM',   // Sales, Support, Accounts
  OWNER: 'OWNER',                   // Banquet Master
  ADMIN: 'ADMIN',                   // Tenant Admin (Same as Owner)
  MANAGER: 'MANAGER',               // Banquet Manager
  SALES: 'SALES',                   // Sales Executive
  OPS: 'OPS',                       // Operations
  F_AND_B: 'F_AND_B',               // Kitchen / Catering
  ACCOUNTS: 'ACCOUNTS',             // Finance
  VENDOR: 'VENDOR',                 // External Supplier
  EVENT_CO: 'EVENT_CO',             // Event Mgmt Company
  CLIENT: 'CLIENT'                  // End Customer
};

export const PERMISSIONS = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  FINANCE: 'FINANCE', // View sensitive financial data
  REPORTS: 'REPORTS', // Access analytics
  SETTINGS: 'SETTINGS' // Configure system
};

export const MODULES = {
  DASHBOARD: 'DASHBOARD',
  LEADS: 'LEADS',
  QUOTATIONS: 'QUOTATIONS',
  EVENTS: 'EVENTS',
  TASKS: 'TASKS',
  CHECKLISTS: 'CHECKLISTS',
  AUDITS: 'AUDITS',
  HALLS: 'HALLS',
  TIMESLOTS: 'TIMESLOTS',
  MENUS: 'MENUS',
  PACKAGES: 'PACKAGES',
  INVENTORY: 'INVENTORY',
  VENDORS: 'VENDORS',
  STAFF: 'STAFF',
  BILLING: 'BILLING',
  REPORTS: 'REPORTS',
  SETTINGS: 'SETTINGS',
  APP: 'APP' // Mobile App Access
};

// Matrix defining what each role can do
export const ROLE_ACCESS_CONFIG = {
  [ROLES.SUPER_ADMIN]: {
    label: 'Asyncotel Super Admin',
    accessLevel: 100, // Highest
    permissions: Object.values(PERMISSIONS), // All permissions
    modules: Object.values(MODULES), // All modules
    dataScope: 'GLOBAL' // Can see all tenants
  },

  [ROLES.INTERNAL_TEAM]: {
    label: 'Asyncotel Internal',
    accessLevel: 90,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT, PERMISSIONS.REPORTS],
    modules: [MODULES.LEADS, MODULES.BILLING, MODULES.REPORTS],
    dataScope: 'GLOBAL'
  },

  [ROLES.OWNER]: {
    label: 'Banquet Hall Owner',
    accessLevel: 80,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT, PERMISSIONS.DELETE, PERMISSIONS.APPROVE, PERMISSIONS.FINANCE, PERMISSIONS.REPORTS, PERMISSIONS.SETTINGS],
    modules: Object.values(MODULES),
    dataScope: 'TENANT' // Restricted to their own banquet hall
  },

  [ROLES.ADMIN]: {
    label: 'Tenant Admin',
    accessLevel: 80,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT, PERMISSIONS.DELETE, PERMISSIONS.APPROVE, PERMISSIONS.FINANCE, PERMISSIONS.REPORTS, PERMISSIONS.SETTINGS],
    modules: Object.values(MODULES),
    dataScope: 'TENANT'
  },

  [ROLES.MANAGER]: {
    label: 'Banquet Manager',
    accessLevel: 70,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT, PERMISSIONS.APPROVE, PERMISSIONS.REPORTS],
    modules: [MODULES.EVENTS, MODULES.LEADS, MODULES.STAFF, MODULES.VENDORS, MODULES.INVENTORY],
    dataScope: 'TENANT'
  },

  [ROLES.SALES]: {
    label: 'Sales Executive',
    accessLevel: 50,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT],
    modules: [MODULES.EVENTS, MODULES.LEADS, MODULES.QUOTATIONS],
    dataScope: 'TENANT'
  },

  [ROLES.OPS]: {
    label: 'Operations',
    accessLevel: 50,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.EDIT], // Limited edit (e.g., update task status)
    modules: [MODULES.EVENTS, MODULES.TASKS, MODULES.INVENTORY], // Context specific
    dataScope: 'ASSIGNED' // Only tasks/events assigned to them
  },

  [ROLES.ACCOUNTS]: {
    label: 'Accountant',
    accessLevel: 60,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.FINANCE, PERMISSIONS.REPORTS],
    modules: [MODULES.BILLING, MODULES.EVENTS],
    dataScope: 'TENANT'
  },

  [ROLES.VENDOR]: {
    label: 'Vendor / Supplier',
    accessLevel: 40,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.EDIT], // Update own profile/pricing
    modules: [MODULES.VENDORS],
    dataScope: 'SELF'
  },

  [ROLES.EVENT_CO]: {
    label: 'Event Mgmt Company',
    accessLevel: 60,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT],
    modules: [MODULES.EVENTS, MODULES.BILLING],
    dataScope: 'SELF' // Own bookings across venues
  },

  [ROLES.CLIENT]: {
    label: 'Customer',
    accessLevel: 10,
    permissions: [PERMISSIONS.VIEW, PERMISSIONS.CREATE],
    modules: [MODULES.EVENTS],
    dataScope: 'SELF'
  }
};

/**
 * Helper to check if a user has permission
 * @param {string} userRole - Role from local storage or JWT
 * @param {string} requiredPermission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userRole, requiredPermission) => {
  const config = ROLE_ACCESS_CONFIG[userRole];
  if (!config) return false;
  if (config.permissions.includes(requiredPermission)) return true;
  return false;
};
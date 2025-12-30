const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const User = require('./models/User');
const Tenant = require('./models/Tenant');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Tenant.deleteMany();

    console.log('Data Destroyed...');

    // 1. Create System Tenant (Container for Super Admins)
    const systemTenant = await Tenant.create({
      hallName: 'Asyncotel System',
      legalEntity: 'Asyncotel Pvt Ltd',
      gstNo: 'SYSTEM_GST',
      modules: ['ALL'],
      plan: 'enterprise'
    });

    // 2. Create Super Admin User
    await User.create({
      tenantId: systemTenant._id,
      fullName: 'Super Admin',
      email: 'admin@asyncotel.com',
      mobile: '9999999999',
      password: 'admin', // Default password
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      onboardingStatus: { kyc: true, roleAssigned: true, approved: true }
    });

    console.log('Data Imported! Super Admin created (Mobile: 9999999999 / Pass: admin)');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
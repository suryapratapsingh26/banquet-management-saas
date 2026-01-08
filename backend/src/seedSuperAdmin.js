const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function seed() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL || 'admin@asyncotel.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'admin';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('Super admin already exists:', email);
      return process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        password: hashed,
        role: 'SUPER_ADMIN',
        mobile: null,
        companyId: null
      }
    });

    console.log('Created SUPER_ADMIN:', user.id, email);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();

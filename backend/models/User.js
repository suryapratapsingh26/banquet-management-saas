const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }, // Multi-tenant link
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true }, // Hashed
  role: { 
    type: String, 
    enum: ['OWNER', 'MANAGER', 'SALES', 'OPS', 'F_AND_B', 'ACCOUNTS', 'VENDOR', 'EVENT_CO', 'CLIENT'],
    required: true 
  },
  department: String,
  shift: String,
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'LOCKED'], default: 'PENDING' },
  onboardingStatus: {
    kyc: { type: Boolean, default: false },
    roleAssigned: { type: Boolean, default: false },
    training: { type: Boolean, default: false },
    approved: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
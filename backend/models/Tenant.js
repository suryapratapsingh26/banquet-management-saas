const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  hallName: { type: String, required: true },
  legalEntity: { type: String, required: true },
  gstNo: { type: String, required: true },
  pan: { type: String },
  address: {
    city: String,
    state: String,
    country: String,
    mapLocation: String,
    fullAddress: String
  },
  propertyDetails: {
    yearEst: Number,
    numHalls: Number,
    hallType: { type: String, enum: ['Indoor', 'Outdoor', 'Both'] },
    capacityMin: Number,
    capacityMax: Number,
    parking: Number
  },
  ownerDetails: {
    name: String,
    mobile: String,
    email: String,
    idProofUrl: String,
    preferredLanguage: String
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  pricingModels: {
    perPlate: Boolean,
    rental: Boolean,
    decoration: Boolean,
    commission: Boolean
  },
  modules: [String], // List of active modules
  plan: { type: String, enum: ['basic', 'pro', 'enterprise'], default: 'basic' }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
const mongoose = require('mongoose');

const AuditItemSchema = new mongoose.Schema({
  itemId: String, // e.g., 'VENUE_CLEAN'
  label: String,
  status: { type: String, enum: ['PASS', 'PARTIAL', 'FAIL', 'PENDING'], default: 'PENDING' },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  remarks: String,
  photoUrl: String,
  timestamp: Date
});

const AuditSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  eventId: { type: String, required: true }, // Link to Event ID
  auditType: { type: String, enum: ['PRE_EVENT', 'LIVE', 'POST_EVENT'], required: true },
  templateId: String,
  assignedToRole: String, // e.g., 'OPS_MANAGER'
  scheduledTime: Date,
  status: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'SUBMITTED', 'REVIEWED'], default: 'SCHEDULED' },
  items: [AuditItemSchema],
  score: { type: Number, default: 0 }, // Calculated score
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: Date
}, { timestamps: true });

// Middleware to calculate score before saving
AuditSchema.pre('save', function(next) {
  // Logic to calculate score based on items
  next();
});

module.exports = mongoose.model('Audit', AuditSchema);
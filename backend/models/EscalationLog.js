const mongoose = require('mongoose');

const EscalationLogSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  eventId: { type: String, required: true },
  reason: String,
  escalatedToRole: String,
  level: { type: Number, default: 1 },
  notifiedChannels: [String],
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('EscalationLog', EscalationLogSchema);
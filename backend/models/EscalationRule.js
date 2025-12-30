const mongoose = require('mongoose');

const EscalationRuleSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  trigger: { type: String, enum: ['TASK_DELAY', 'SLA_BREACH'], required: true },
  slaMinutes: { type: Number, required: true },
  escalateToRole: { type: String, required: true },
  notifyChannels: [{ type: String, enum: ['WHATSAPP', 'EMAIL', 'IN_APP'] }]
}, { timestamps: true });

module.exports = mongoose.model('EscalationRule', EscalationRuleSchema);
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  eventId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  source: { type: String, enum: ['MANUAL', 'AUDIT', 'TEMPLATE'], default: 'MANUAL' },
  sourceId: String, // e.g., Audit Item ID if auto-created
  
  assignedToRole: String, // e.g., 'DECOR_TEAM'
  assignedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'FAILED'], default: 'OPEN' },
  
  dueTime: Date,
  slaMinutes: Number,
  
  completionProof: [String], // Array of URLs
  completionNote: String,
  
  isEscalated: { type: Boolean, default: false },
  escalationLevel: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
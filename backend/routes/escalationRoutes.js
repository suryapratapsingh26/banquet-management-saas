const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// @desc    Create Escalation Rule
// @route   POST /api/v1/escalations/rules
router.post('/rules', async (req, res) => {
  try {
    const rule = await prisma.escalationRule.create({ data: req.body });
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Trigger Escalation (Manual or Auto)
// @route   POST /api/v1/escalations/trigger
router.post('/trigger', async (req, res) => {
  try {
    const { taskId, reason, companyId } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updated = await prisma.task.update({ where: { id: taskId }, data: { isEscalated: true, escalationLevel: (task.escalationLevel || 0) + 1 } });

    const log = await prisma.escalationLog.create({ data: {
      companyId: companyId || task.companyId,
      taskId,
      eventId: task.eventId,
      reason,
      escalatedToRole: 'MANAGER',
      level: updated.escalationLevel,
      notifiedChannels: []
    }});
    // Fire a notification (in-app) for manager
    try {
      await prisma.notification.create({ data: { companyId: companyId || task.companyId, channel: 'IN_APP', to: 'MANAGER', message: `Task ${task.title} escalated: ${reason}`, meta: { taskId } } });
    } catch (e) { console.error('notify failed', e); }

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get Escalation History
// @route   GET /api/v1/escalations/history
router.get('/history', async (req, res) => {
  try {
    const { event_id } = req.query;
    const where = {};
    if (event_id) where.eventId = event_id;
    const history = await prisma.escalationLog.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Run SLA scan (on-demand)
// @route   POST /api/v1/escalations/scan
router.post('/scan', async (req, res) => {
  try {
    // Find tasks with SLA and not completed
    const now = new Date();
    const tasks = await prisma.task.findMany({ where: { slaMinutes: { not: null }, status: { not: 'COMPLETED' } } });
    const escalations = [];
    for (const t of tasks) {
      if (!t.createdAt || !t.slaMinutes) continue;
      const deadline = new Date(t.createdAt.getTime() + t.slaMinutes * 60000);
      if (deadline < now && !t.isEscalated) {
        const updated = await prisma.task.update({ where: { id: t.id }, data: { isEscalated: true, escalationLevel: (t.escalationLevel || 0) + 1 } });
        const log = await prisma.escalationLog.create({ data: {
          companyId: t.companyId,
          taskId: t.id,
          eventId: t.eventId,
          reason: 'SLA_BREACH',
          escalatedToRole: 'MANAGER',
          level: updated.escalationLevel,
          notifiedChannels: []
        }});
        escalations.push(log);
      }
    }
    res.json({ escalated: escalations.length, details: escalations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
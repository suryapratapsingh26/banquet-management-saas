const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Task SLA performance: counts and SLA breach count
router.get('/tasks', async (req, res) => {
  try {
    const total = await prisma.task.count();
    const completed = await prisma.task.count({ where: { status: 'COMPLETED' } });
    const escalated = await prisma.task.count({ where: { isEscalated: true } });
    res.json({ total, completed, escalated });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Audit scorecard
router.get('/audits/:id/scorecard', async (req, res) => {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: req.params.id } });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });
    const items = Array.isArray(audit.items) ? audit.items : JSON.parse(audit.items || '[]');
    const total = items.length;
    const passed = items.filter(i => i.status === 'PASS').length;
    const partial = items.filter(i => i.status === 'PARTIAL').length;
    const score = total === 0 ? 0 : Math.round(((passed + partial * 0.5) / total) * 100);
    res.json({ auditId: audit.id, score, total, passed, partial });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

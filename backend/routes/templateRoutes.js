const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Create template
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const tpl = await prisma.template.create({ data: payload });
    res.status(201).json(tpl);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch templates for event type
router.get('/events/:eventType', async (req, res) => {
  try {
    const eventType = req.params.eventType;
    const templates = await prisma.template.findMany({ where: { eventType } });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Instantiate template to tasks for an event
router.post('/:id/instantiate', async (req, res) => {
  try {
    const tpl = await prisma.template.findUnique({ where: { id: req.params.id } });
    if (!tpl) return res.status(404).json({ error: 'Template not found' });
    const { eventId, companyId } = req.body;
    const tasks = Array.isArray(tpl.tasks) ? tpl.tasks : JSON.parse(tpl.tasks || '[]');
    const created = [];
    for (const t of tasks) {
      const task = await prisma.task.create({ data: {
        companyId: companyId,
        eventId,
        title: t.title,
        description: t.description || null,
        source: 'TEMPLATE',
        sourceId: tpl.id,
        assignedToRole: t.role || null,
        priority: t.priority || 'MEDIUM',
        slaMinutes: t.sla_minutes || null
      }});
      created.push(task);
    }
    res.json({ created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

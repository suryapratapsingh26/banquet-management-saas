const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// @desc    Create Audit (Pre / Post Event)
// @route   POST /api/v1/banquet/audits
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const audit = await prisma.audit.create({ data: payload });
    res.status(201).json(audit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Get Audit Checklist Items
// @route   GET /api/v1/banquet/audits/:id/items
router.get('/:id/items', async (req, res) => {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: req.params.id } });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });
    res.json(audit.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update Audit Item Status
// @route   PUT /api/v1/banquet/audits/items/:itemId
// Note: In a real app, you'd likely update the parent Audit doc finding the subdoc by ID
router.put('/:auditId/items/:itemId', async (req, res) => {
  try {
    const { status, remarks, photoUrl } = req.body;
    const audit = await prisma.audit.findUnique({ where: { id: req.params.auditId } });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });

    // items is stored as JSON array
    const items = Array.isArray(audit.items) ? audit.items : JSON.parse(audit.items || '[]');
    const idx = items.findIndex(i => String(i.id) === String(req.params.itemId) || String(i._id) === String(req.params.itemId));
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });

    items[idx].status = status;
    items[idx].remarks = remarks;
    items[idx].photoUrl = photoUrl;
    items[idx].timestamp = new Date();

    await prisma.audit.update({ where: { id: req.params.auditId }, data: { items } });

    // Auto task creation
    if (status === 'FAIL' || status === 'PARTIAL') {
      const item = items[idx];
      await prisma.task.create({
        data: {
          companyId: audit.companyId,
          eventId: audit.eventId,
          title: `Fix Audit Failure: ${item.label || 'Unknown Item'}`,
          source: 'AUDIT',
          sourceId: String(item.id || item._id),
          priority: 'HIGH'
        }
      });
    }

    res.json(items[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Submit audit endpoint
router.post('/:id/submit', async (req, res) => {
  try {
    const auditId = req.params.id;
    const audit = await prisma.audit.update({ where: { id: auditId }, data: { status: 'SUBMITTED', submittedAt: new Date(), submittedBy: req.body.userId || null } });
    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
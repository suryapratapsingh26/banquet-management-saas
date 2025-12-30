const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');

// Send notification (mock channels)
router.post('/send', async (req, res) => {
  try {
    const { channel, to, message, companyId, meta } = req.body;
    const note = await prisma.notification.create({ data: { companyId, channel: channel.join ? channel.join(',') : channel, to: Array.isArray(to) ? to.join(',') : to, message, meta } });
    // In real app, dispatch to WhatsApp/Email providers here.
    res.status(201).json({ success: true, notification: note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

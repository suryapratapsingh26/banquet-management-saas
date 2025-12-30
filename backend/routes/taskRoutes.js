const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// @desc    Auto / Manual Task Create
// @route   POST /api/v1/tasks
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const task = await prisma.task.create({ data: payload });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Update Task Status
// @route   PUT /api/v1/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await prisma.task.update({ where: { id: req.params.id }, data: req.body });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Task Completion Proof Upload
// @route   POST /api/v1/tasks/:id/attachments
router.post('/:id/attachments', upload.single('file'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // If file uploaded, build URL (serve statically later)
    let url = req.body.proofUrl;
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }
    const proofs = task.completionProof || [];
    proofs.push(url);
    const updated = await prisma.task.update({ where: { id: taskId }, data: { completionProof: proofs } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    List Tasks with filters
// @route   GET /api/v1/tasks
router.get('/', async (req, res) => {
  try {
    const { event_id, status, phase, assigned_to } = req.query;
    const where = {};
    if (event_id) where.eventId = event_id;
    if (status) where.status = status;
    if (assigned_to) where.assignedToRole = assigned_to;
    const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get My Tasks (placeholder - requires auth)
// @route   GET /api/v1/tasks/my
router.get('/my', async (req, res) => {
  try {
    // For now, support query param role to simulate
    const role = req.query.role;
    if (!role) return res.status(400).json({ error: 'role query param required' });
    const tasks = await prisma.task.findMany({ where: { assignedToRole: role }, orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get Event Task Board
// @route   GET /api/v1/tasks/event/:eventId
router.get('/event/:eventId', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { eventId: req.params.eventId }, orderBy: { createdAt: 'asc' } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
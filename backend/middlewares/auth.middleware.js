const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: 'User not found' });
      req.user = user;
      // Attach company / tenant context for multi-tenant enforcement
      req.companyId = user.companyId || req.headers['x-tenant-id'] || null;
    next();
  } catch (err) {
    console.error('Token verify error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { verifyToken, authorizeRoles };

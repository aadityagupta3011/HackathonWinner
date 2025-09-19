const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

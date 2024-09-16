const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization format is invalid' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId }; // Ensure userId is set correctly
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Log the decoded token for debugging
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err); // Log error details for debugging
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;

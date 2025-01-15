const jwt = require('jsonwebtoken');
const authenticateAdmin = require('./authMiddleware');
const authenticateUser = require('./authUserMiddleware');

const authenticateAdminOrUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.ADMIN_JWT_SECRET, (adminErr, decodedAdmin) => {
    if (adminErr) {
      jwt.verify(token, process.env.USER_JWT_SECRET, (userErr, decodedUser) => {
        if (userErr) {
          return res.status(403).json({ error: 'Access denied. Invalid or expired token.' });
        }
        req.userId = decodedUser.userId;
        next();
      });
    } else {
      req.adminId = decodedAdmin.adminId;
      next();
    }
  });
};

module.exports = authenticateAdminOrUser;

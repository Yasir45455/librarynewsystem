const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
 const token = req.header('Authorization')?.replace('Bearer ', ''); 
 
   if (!token) {
     return res.status(401).json({ error: 'Access denied. No token provided.' });
   }
   try {
     // Verify the token
     const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
     req.userId = decoded.userId; 
     next(); 
   } catch (error) {
     return res.status(400).json({ error: 'Invalid or expired token.' });
   }
 
};

module.exports = authenticateUser;

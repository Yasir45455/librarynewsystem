const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Token ko request ke header se nikaalna
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Token verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // User information ko request object me add karna
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;



const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send("Authorization header missing.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }

  jwt.verify(token, 'c31799edb8a2a0e582eb905245f1a6cffb80991eeb35bf5df5f4ebc4d613f46c819234', (err, user) => {
    if (err) {
      return res.status(401).send("Authorization failed.");
    }

    req.user = user; // Attach the user to the request object
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send("Authorization header missing.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed.");
  }
  jwt.verify(token, 'c31799edb8a2a0e582eb905245f1a6cffb80991eeb35bf5df5f4ebc4d613f46c819234', (err, user) => {
    if (err) {
      return res.status(401).send("Authorization failed.");
    }
    req.user = user;
    if (user.role !== 'admin') {
      return res.status(403).send("Non Authorized Access.");
    }

    next();
  });
};

module.exports = {
  authenticateAdmin,
  authenticateToken
};

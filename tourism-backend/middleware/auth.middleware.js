const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  // reading token
  const header = req.headers.authorization;

  // cheaking format
  if (!header || !header.startsWith('Bearer ')) { // no header at all || doesn't start with Bearer (wrong format)
    return res.status(401).json({ message: 'No token provided' });
    // 401 = Unauthorized (not logged in)
    }

  // extracting token.
  const token = header.split(' ')[1];

  // verifying token.
  try {
    // verify token and store in req.user to use in next middleware of role.
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticate, authorize };
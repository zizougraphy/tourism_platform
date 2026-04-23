// in this file we register new user, login a user, get users infos.
const bcrypt             = require('bcryptjs'); // for encrypting password.
const db                 = require('../config/db');
const { generateToken }  = require('../utils/jwt');
const { asyncHandler }   = require('../middleware/error.middleware');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Validate role
  if (!['tourist', 'provider'].includes(role)) {
    return res.status(400).json({ message: 'Role must be tourist or provider' });
  }

  // Check if email already exists
  const [existing] = await db.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );
  if (existing.length) { // if returns value from .length from the array [existing] means the email already exists
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Hash the password
  const rounds       = parseInt(process.env.BCRYPT_ROUNDS) || 12; //cost factor(strength) || security level
  const passwordHash = await bcrypt.hash(password, rounds);

  // Insert the user
  const [result] = await db.query(
    `INSERT INTO users (name, email, password, phone, role, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [name, email, passwordHash, phone || null, role]
  );

  const userId = result.insertId;

  // If provider — create pending provider record
  if (role === 'provider') {
    await db.query(
      `INSERT INTO service_providers (user_id, status, created_at)
       VALUES (?, 'pending', NOW())`,
      [userId]
    );
  }

  // Generate token and respond
  const token = generateToken({ id: userId, email, role });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: { id: userId, name, email, role },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // we extract the user logging data to check with it the AUTH.

  // Find user by email
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  if (!rows.length) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = rows[0];

  // 2. Compare password with hash
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 3. Generate token and respond
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  });
});

// GET /api/auth/me  (protected)
const getMe = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'User not found' });

  res.json({ success: true, user: rows[0] });
});

module.exports = { register, login, getMe };

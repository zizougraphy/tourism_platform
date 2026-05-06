// in this file we register new user, login a user, get users infos.
const bcrypt             = require('bcryptjs'); // for encrypting password.
const db                 = require('../config/db');
const { generateToken }  = require('../utils/jwt');
const { asyncHandler }   = require('../middleware/error.middleware');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Validate role
  if (!['tourist', 'service_provider'].includes(role)) {
    return res.status(400).json({ message: 'Role must be tourist or service_provider' });
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
  /* 
  if (role === 'service_provider') {
    await db.query(
      `INSERT INTO service_providers (user_id, status, created_at)
       VALUES (?, 'pending', NOW())`,
      [userId]
    );
  }
  */

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
    'SELECT id, name, email, phone, role, profile_photo, bio, travel_preferences, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'User not found' });

  res.json({ success: true, user: rows[0] });
});

// PUT /api/auth/profile  (protected)
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, travel_preferences } = req.body;
  let profile_photo;
  
  if (req.file) {
    profile_photo = `/uploads/${req.file.filename}`;
  } else if (req.body.profile_photo !== undefined) {
    profile_photo = req.body.profile_photo;
  }

  const userId = req.user.id;

  const fields = [];
  const params = [];

  if (name             !== undefined) { fields.push('name = ?');              params.push(name); }
  if (phone            !== undefined) { fields.push('phone = ?');             params.push(phone); }
  if (bio              !== undefined) { fields.push('bio = ?');               params.push(bio); }
  if (travel_preferences !== undefined) { fields.push('travel_preferences = ?'); params.push(typeof travel_preferences === 'string' ? travel_preferences : JSON.stringify(travel_preferences)); }
  if (profile_photo    !== undefined) { fields.push('profile_photo = ?');     params.push(profile_photo); }


  if (!fields.length) {
    res.status(400);
    throw new Error('No fields to update');
  }

  params.push(userId);
  await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

  // Return updated user
  const [rows] = await db.query(
    'SELECT id, name, email, phone, role, profile_photo, bio, travel_preferences, created_at FROM users WHERE id = ?',
    [userId]
  );

  res.json({ success: true, user: rows[0] });
});

module.exports = { register, login, getMe, updateProfile };

const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Tourist creates a booking. Status starts as 'pending'.
const createBooking = asyncHandler(async (req, res) => {
  const { service_id, booking_date, notes } = req.body;
  const user_id = req.user.id;

  // Validate required fields
  if (!service_id || !booking_date) {
    res.status(400);
    throw new Error('service_id and booking_date are required');
  }

  // Make sure the service exists and is active
  const [service] = await db.query(
    'SELECT id, price FROM services WHERE id = ? AND is_active = 1',
    [service_id]
  );

  if (!service.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  const [result] = await db.query(
    `INSERT INTO bookings (user_id, service_id, booking_date, notes, status, total_price)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
    [user_id, service_id, booking_date, notes || null, service[0].price]
  );

  // Fetch the newly created booking to return it in the response
  const [booking] = await db.query(
    'SELECT * FROM bookings WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ data: booking[0] });
});

// ─── GET /api/bookings ────────────────────────────────────────────────────────
// Returns bookings relevant to the current user:
//   - tourist  → their own bookings
//   - provider → bookings for their services
//   - admin    → all bookings
const getBookings = asyncHandler(async (req, res) => {
  const { id: user_id, role } = req.user;

  let rows;

  if (role === 'admin') {
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, u.name AS tourist_name
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       LEFT JOIN users    u ON u.id = b.user_id
       ORDER BY b.created_at DESC`
    );

  } else if (role === 'provider') {
    // Get bookings only for services owned by this provider
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, u.name AS tourist_name
       FROM bookings b
       LEFT JOIN services  s  ON s.id  = b.service_id
       LEFT JOIN providers p  ON p.id  = s.provider_id
       LEFT JOIN users     u  ON u.id  = b.user_id
       WHERE p.user_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );

  } else {
    // Tourist — only their own bookings
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );
  }

  res.json({ data: rows });
});

// ─── PATCH /api/bookings/:id/cancel ──────────────────────────────────────────
// Tourist cancels their own booking (only if still pending).
const cancelBooking = asyncHandler(async (req, res) => {
  const { id }     = req.params;
  const { id: user_id } = req.user;

  const [booking] = await db.query(
    'SELECT * FROM bookings WHERE id = ?',
    [id]
  );

  if (!booking.length) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const b = booking[0];

  // Only the owner can cancel
  if (b.user_id !== user_id) {
    res.status(403);
    throw new Error('Not authorised to cancel this booking');
  }

  if (b.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot cancel a booking with status '${b.status}'`);
  }

  await db.query(
    "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
    [id]
  );

  res.json({ message: 'Booking cancelled successfully' });
});

// ─── PATCH /api/bookings/:id/confirm ─────────────────────────────────────────
// Provider confirms a booking for their service.
const confirmBooking = asyncHandler(async (req, res) => {
  const { id }     = req.params;
  const { id: user_id } = req.user;

  const [booking] = await db.query(
    `SELECT b.*, s.provider_id
     FROM bookings b
     LEFT JOIN services  s  ON s.id = b.service_id
     LEFT JOIN providers p  ON p.id = s.provider_id
     WHERE b.id = ?`,
    [id]
  );

  if (!booking.length) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const b = booking[0];

  // Only the provider who owns the service can confirm
  // We need the provider record for this user
  const [provider] = await db.query(
    'SELECT id FROM providers WHERE user_id = ?',
    [user_id]
  );

  if (!provider.length || provider[0].id !== b.provider_id) {
    res.status(403);
    throw new Error('Not authorised to confirm this booking');
  }

  if (b.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot confirm a booking with status '${b.status}'`);
  }

  await db.query(
    "UPDATE bookings SET status = 'confirmed' WHERE id = ?",
    [id]
  );

  res.json({ message: 'Booking confirmed successfully' });
});

module.exports = { createBooking, getBookings, cancelBooking, confirmBooking };
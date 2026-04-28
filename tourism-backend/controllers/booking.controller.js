const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Tourist creates a booking. Status starts as 'pending'.
const createBooking = asyncHandler(async (req, res) => {
  const { service_id, check_in_date, check_out_date, guests } = req.body;
  const tourist_id = req.user.id;

  // Validate required fields
  if (!service_id || !check_in_date || !check_out_date) {
    res.status(400);
    throw new Error('service_id, check_in_date and check_out_date are required');
  }

  // Make sure the service exists and is active
  const [service] = await db.query(
    'SELECT id, price FROM services WHERE id = ? AND is_available = 1',
    [service_id]
  );

  if (!service.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  const [result] = await db.query(
    `INSERT INTO bookings (tourist_id, service_id, check_in_date, check_out_date, status, total_price, guests)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [tourist_id, service_id, check_in_date, check_out_date, service[0].price, guests || 1]
  );

  // Fetch the newly created booking to return it in the response
  const [booking] = await db.query(
    'SELECT * FROM bookings WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ data: booking[0] });
});

// ─── GET /api/bookings ────────────────────────────────────────────────────────
const getBookings = asyncHandler(async (req, res) => {
  const { id: user_id, role } = req.user;

  let rows;

  if (role === 'admin') {
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, u.name AS tourist_name
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       LEFT JOIN users    u ON u.id = b.tourist_id
       ORDER BY b.created_at DESC`
    );

  } else if (role === 'service_provider') {
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, u.name AS tourist_name
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       LEFT JOIN users    u ON u.id = b.tourist_id
       WHERE s.provider_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );

  } else {
    [rows] = await db.query(
      `SELECT b.*, s.name AS service_name, s.images AS service_image, s.provider_id, p.name AS provider_name
       FROM bookings b
       LEFT JOIN services s ON s.id = b.service_id
       LEFT JOIN users p ON p.id = s.provider_id
       WHERE b.tourist_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );
  }

  res.json({ data: rows });
});

// ─── PATCH /api/bookings/:id/cancel ──────────────────────────────────────────
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
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

  if (b.tourist_id !== user_id) {
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
const confirmBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  const [booking] = await db.query(
    `SELECT b.*, s.provider_id
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     WHERE b.id = ?`,
    [id]
  );

  if (!booking.length) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const b = booking[0];

  if (b.provider_id !== user_id) {
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
const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── GET /api/admin/providers?status=pending ──────────────────────────────────
const getProviders = asyncHandler(async (req, res) => {
  const { status } = req.query; // pending | approved | rejected — optional filter

  const conditions = [];
  const params     = [];

  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT p.id, p.status, p.created_at,
            u.name, u.email,
            COUNT(s.id) AS total_services
     FROM providers p
     LEFT JOIN users    u ON u.id = p.user_id
     LEFT JOIN services s ON s.provider_id = p.id
     ${where}
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── PATCH /api/admin/providers/:id/approve ───────────────────────────────────
const approveProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id FROM providers WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Provider not found');
  }

  await db.query("UPDATE providers SET status = 'approved' WHERE id = ?", [id]);

  res.json({ message: 'Provider approved' });
});

// ─── PATCH /api/admin/providers/:id/reject ────────────────────────────────────
const rejectProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id FROM providers WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Provider not found');
  }

  await db.query("UPDATE providers SET status = 'rejected' WHERE id = ?", [id]);

  res.json({ message: 'Provider rejected' });
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  // Run all counts in parallel for speed — Promise.all fires them simultaneously
  const [
    [users],
    [providers],
    [services],
    [bookings],
    [revenue],
  ] = await Promise.all([
    db.query('SELECT COUNT(*) AS total FROM users'),
    db.query("SELECT COUNT(*) AS total FROM providers WHERE status = 'approved'"),
    db.query('SELECT COUNT(*) AS total FROM services WHERE is_active = 1'),
    db.query('SELECT COUNT(*) AS total FROM bookings'),
    db.query("SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE status = 'confirmed'"),
  ]);

  // Bookings breakdown by status
  const [bookingsByStatus] = await db.query(
    `SELECT status, COUNT(*) AS count
     FROM bookings
     GROUP BY status`
  );

  res.json({
    data: {
      total_users:             users[0].total,
      total_approved_providers: providers[0].total,
      total_active_services:   services[0].total,
      total_bookings:          bookings[0].total,
      total_revenue:           revenue[0].total,
      bookings_by_status:      bookingsByStatus,
    },
  });
});

module.exports = { getProviders, approveProvider, rejectProvider, getStats };
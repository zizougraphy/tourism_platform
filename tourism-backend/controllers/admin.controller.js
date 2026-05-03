const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── GET /api/admin/providers?status=pending ──────────────────────────────────
const getProviders = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const conditions = ['u.role = ?'];
  const params     = ['service_provider'];

  if (status) {
    // status is stored in the providers table if it exists, otherwise we filter by is_active
    if (status === 'approved') {
      conditions.push('u.is_active = 1');
    } else if (status === 'suspended') {
      conditions.push('u.is_active = 0');
    }
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
            p.id AS provider_id, p.status AS provider_status,
            COUNT(s.id) AS total_services
     FROM users u
     LEFT JOIN providers p ON p.user_id = u.id
     LEFT JOIN services s ON s.provider_id = u.id
     ${where}
     GROUP BY u.id, p.id
     ORDER BY u.created_at DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── PATCH /api/admin/providers/:id/approve ───────────────────────────────────
const approveProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Try providers table first, fall back to users table
  try {
    const [rows] = await db.query('SELECT id FROM providers WHERE id = ?', [id]);
    if (rows.length) {
      await db.query("UPDATE providers SET status = 'approved' WHERE id = ?", [id]);
      return res.json({ message: 'Provider approved' });
    }
  } catch (_) {}

  // Activate user directly (user_id-based)
  await db.query('UPDATE users SET is_active = 1 WHERE id = ? AND role = ?', [id, 'service_provider']);
  res.json({ message: 'Provider approved' });
});

// ─── PATCH /api/admin/providers/:id/reject ────────────────────────────────────
const rejectProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT id FROM providers WHERE id = ?', [id]);
    if (rows.length) {
      await db.query("UPDATE providers SET status = 'rejected' WHERE id = ?", [id]);
      return res.json({ message: 'Provider rejected' });
    }
  } catch (_) {}

  await db.query('UPDATE users SET is_active = 0 WHERE id = ? AND role = ?', [id, 'service_provider']);
  res.json({ message: 'Provider rejected' });
});

// ─── PATCH /api/admin/providers/:id/status ───────────────────────────────────
const updateProviderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  await db.query('UPDATE users SET is_active = ? WHERE id = ? AND role = ?', [is_active ? 1 : 0, id, 'service_provider']);
  res.json({ message: `Provider ${is_active ? 'activated' : 'suspended'}` });
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const [
    [users],
    [providers],
    [services],
    [bookings],
    [revenue],
    [recentUsers],
    [recentBookings],
  ] = await Promise.all([
    db.query('SELECT COUNT(*) AS total FROM users'),
    db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'service_provider' AND is_active = 1"),
    db.query('SELECT COUNT(*) AS total FROM services WHERE is_available = 1'),
    db.query('SELECT COUNT(*) AS total FROM bookings'),
    db.query("SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE status = 'confirmed'"),
    db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'),
    db.query(`SELECT b.id, b.status, b.total_price, b.created_at, u.name AS tourist_name, s.name AS service_name
              FROM bookings b
              LEFT JOIN users u ON u.id = b.tourist_id
              LEFT JOIN services s ON s.id = b.service_id
              ORDER BY b.created_at DESC LIMIT 5`),
  ]);

  const [bookingsByStatus] = await db.query(
    `SELECT status, COUNT(*) AS count FROM bookings GROUP BY status`
  );

  res.json({
    data: {
      total_users:              users[0].total,
      total_providers:          providers[0].total,
      total_active_services:    services[0].total,
      total_bookings:           bookings[0].total,
      total_revenue:            revenue[0].total,
      bookings_by_status:       bookingsByStatus,
      recent_users:             recentUsers,
      recent_bookings:          recentBookings,
    },
  });
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;

  const conditions = [];
  const params     = [];

  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT id, name, email, role, phone, is_active, created_at
     FROM users
     ${where}
     ORDER BY created_at DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── PATCH /api/admin/users/:id/status ───────────────────────────────────────
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id }       = req.params;
  const { is_active } = req.body;

  const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('User not found');
  }

  await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
  res.json({ message: `User ${is_active ? 'unbanned' : 'banned'}` });
});

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('User not found');
  }

  await db.query('DELETE FROM users WHERE id = ?', [id]);
  res.json({ message: 'User deleted' });
});

// ─── GET /api/admin/services ──────────────────────────────────────────────────
const getAdminServices = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const conditions = [];
  const params     = [];

  if (search) {
    conditions.push('(s.name LIKE ? OR s.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push('s.category = ?');
    params.push(category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT s.id, s.name, s.category, s.price, s.rating, s.images, s.is_available, s.created_at,
            c.name AS city_name, u.name AS provider_name, u.id AS provider_id
     FROM services s
     LEFT JOIN cities c ON c.id = s.city_id
     LEFT JOIN users u ON u.id = s.provider_id
     ${where}
     ORDER BY s.created_at DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── DELETE /api/admin/services/:id ──────────────────────────────────────────
const deleteAdminService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id FROM services WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  await db.query('DELETE FROM services WHERE id = ?', [id]);
  res.json({ message: 'Service deleted' });
});

// ─── PATCH /api/admin/services/:id/toggle ────────────────────────────────────
const toggleService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id, is_available FROM services WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  const newStatus = rows[0].is_available ? 0 : 1;
  await db.query('UPDATE services SET is_available = ? WHERE id = ?', [newStatus, id]);
  res.json({ message: `Service ${newStatus ? 'activated' : 'deactivated'}`, is_available: newStatus });
});

// ─── GET /api/admin/bookings ──────────────────────────────────────────────────
const getAdminBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const conditions = [];
  const params     = [];

  if (status && status !== 'all') {
    conditions.push('b.status = ?');
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT b.*, u.name AS tourist_name, s.name AS service_name, s.category
     FROM bookings b
     LEFT JOIN users u ON u.id = b.tourist_id
     LEFT JOIN services s ON s.id = b.service_id
     ${where}
     ORDER BY b.created_at DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── PATCH /api/admin/bookings/:id/cancel ────────────────────────────────────
const cancelAdminBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT id FROM bookings WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Booking not found');
  }

  await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [id]);
  res.json({ message: 'Booking cancelled by admin' });
});

// ─── GET /api/admin/reviews ───────────────────────────────────────────────────
const getAdminReviews = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const conditions = [];
  const params     = [];

  if (search) {
    conditions.push('(u.name LIKE ? OR s.name LIKE ? OR r.comment LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await db.query(
    `SELECT r.id, r.rating, r.comment, r.date AS created_at,
            u.name AS reviewer_name, u.id AS reviewer_id,
            s.name AS service_name, s.id AS service_id
     FROM reviews r
     LEFT JOIN users u ON u.id = r.tourist_id
     LEFT JOIN services s ON s.id = r.service_id
     ${where}
     ORDER BY r.date DESC`,
    params
  );

  res.json({ data: rows });
});

// ─── DELETE /api/admin/reviews/:id ───────────────────────────────────────────
const deleteAdminReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
  if (!rows.length) {
    res.status(404);
    throw new Error('Review not found');
  }

  const service_id = rows[0].service_id;
  await db.query('DELETE FROM reviews WHERE id = ?', [id]);

  await db.query(
    `UPDATE services
     SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE service_id = ?)
     WHERE id = ?`,
    [service_id, service_id]
  );

  res.json({ message: 'Review deleted by admin' });
});

// ─── GET /api/admin/analytics ─────────────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    [bookingsByDay],
    [topServices],
    [topProviders],
    [categoryBreakdown],
  ] = await Promise.all([
    // Bookings per day over last 30 days
    db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count, COALESCE(SUM(total_price), 0) AS revenue
       FROM bookings
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    ),
    // Top 5 services by booking count
    db.query(
      `SELECT s.id, s.name, s.category, COUNT(b.id) AS bookings, COALESCE(SUM(b.total_price), 0) AS revenue
       FROM services s
       LEFT JOIN bookings b ON b.service_id = s.id
       GROUP BY s.id
       ORDER BY bookings DESC
       LIMIT 5`
    ),
    // Top 5 providers by revenue
    db.query(
      `SELECT u.id, u.name, COUNT(b.id) AS bookings, COALESCE(SUM(b.total_price), 0) AS revenue
       FROM users u
       LEFT JOIN services s ON s.provider_id = u.id
       LEFT JOIN bookings b ON b.service_id = s.id
       WHERE u.role = 'service_provider'
       GROUP BY u.id
       ORDER BY revenue DESC
       LIMIT 5`
    ),
    // Bookings by category
    db.query(
      `SELECT s.category, COUNT(b.id) AS bookings
       FROM services s
       LEFT JOIN bookings b ON b.service_id = s.id
       GROUP BY s.category
       ORDER BY bookings DESC`
    ),
  ]);

  res.json({
    data: {
      bookings_by_day:    bookingsByDay,
      top_services:       topServices,
      top_providers:      topProviders,
      category_breakdown: categoryBreakdown,
    },
  });
});

module.exports = {
  getProviders, approveProvider, rejectProvider, updateProviderStatus,
  getStats,
  getUsers, updateUserStatus, deleteUser,
  getAdminServices, deleteAdminService, toggleService,
  getAdminBookings, cancelAdminBooking,
  getAdminReviews, deleteAdminReview,
  getAnalytics,
};
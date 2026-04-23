const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── POST /api/favorites ──────────────────────────────────────────────────────
const addFavorite = asyncHandler(async (req, res) => {
  const { service_id } = req.body;
  const user_id = req.user.id;

  if (!service_id) {
    res.status(400);
    throw new Error('service_id is required');
  }

  // Check service exists
  const [service] = await db.query('SELECT id FROM services WHERE id = ?', [service_id]);
  if (!service.length) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Ignore if already favourited (INSERT IGNORE handles duplicate key silently)
  await db.query(
    'INSERT IGNORE INTO favorites (user_id, service_id) VALUES (?, ?)',
    [user_id, service_id]
  );

  res.status(201).json({ message: 'Added to favorites' });
});

// ─── GET /api/favorites ───────────────────────────────────────────────────────
const getFavorites = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await db.query(
    `SELECT s.id, s.name, s.category, s.price, s.avg_rating, s.image_url,
            c.name AS city_name, f.created_at AS saved_at
     FROM favorites f
     LEFT JOIN services s ON s.id = f.service_id
     LEFT JOIN cities   c ON c.id = s.city_id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [user_id]
  );

  res.json({ data: rows });
});

// ─── DELETE /api/favorites/:serviceId ────────────────────────────────────────
const removeFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const user_id = req.user.id;

  await db.query(
    'DELETE FROM favorites WHERE user_id = ? AND service_id = ?',
    [user_id, serviceId]
  );

  res.json({ message: 'Removed from favorites' });
});

module.exports = { addFavorite, getFavorites, removeFavorite };
const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── POST /api/reviews ────────────────────────────────────────────────────────
// Tourist posts a review. Must have a completed booking for this service.
const createReview = asyncHandler(async (req, res) => {
  const { service_id, rating, comment } = req.body;
  const user_id = req.user.id;

  if (!service_id || !rating) {
    res.status(400);
    throw new Error('service_id and rating are required');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Verify user has a confirmed booking for this service before reviewing
  const [bookings] = await db.query(
    `SELECT id FROM bookings
     WHERE user_id = ? AND service_id = ? AND status = 'confirmed'
     LIMIT 1`,
    [user_id, service_id]
  );

  if (!bookings.length) {
    res.status(403);
    throw new Error('You can only review a service after a confirmed booking');
  }

  // Prevent duplicate reviews
  const [existing] = await db.query(
    'SELECT id FROM reviews WHERE user_id = ? AND service_id = ?',
    [user_id, service_id]
  );

  if (existing.length) {
    res.status(409);
    throw new Error('You have already reviewed this service');
  }

  await db.query(
    'INSERT INTO reviews (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)',
    [user_id, service_id, rating, comment || null]
  );

  // Recalculate avg_rating on the service (denormalised column for fast reads)
  await db.query(
    `UPDATE services
     SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE service_id = ?)
     WHERE id = ?`,
    [service_id, service_id]
  );

  res.status(201).json({ message: 'Review submitted successfully' });
});

// ─── GET /api/reviews/service/:serviceId ──────────────────────────────────────
const getServiceReviews = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const [reviews] = await db.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS reviewer_name
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.service_id = ?
     ORDER BY r.created_at DESC`,
    [serviceId]
  );

  res.json({ data: reviews });
});

// ─── DELETE /api/reviews/:id ──────────────────────────────────────────────────
// Only the author or an admin can delete a review.
const deleteReview = asyncHandler(async (req, res) => {
  const { id }              = req.params;
  const { id: user_id, role } = req.user;

  const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);

  if (!rows.length) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (role !== 'admin' && rows[0].user_id !== user_id) {
    res.status(403);
    throw new Error('Not authorised to delete this review');
  }

  const service_id = rows[0].service_id;

  await db.query('DELETE FROM reviews WHERE id = ?', [id]);

  // Recalculate avg_rating after deletion
  await db.query(
    `UPDATE services
     SET avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE service_id = ?)
     WHERE id = ?`,
    [service_id, service_id]
  );

  res.json({ message: 'Review deleted' });
});

module.exports = { createReview, getServiceReviews, deleteReview };
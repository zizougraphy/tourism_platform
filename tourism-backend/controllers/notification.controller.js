const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── GET /api/notifications ───────────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await db.query(
    `SELECT id, type, message, is_read, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [user_id]
  );

  res.json({ data: rows });
});

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
// NOTE: This route must be registered BEFORE /:id/read to avoid Express
// treating "read-all" as a dynamic :id segment.
const markAllRead = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  await db.query(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
    [user_id]
  );

  res.json({ message: 'All notifications marked as read' });
});

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
const markOneRead = asyncHandler(async (req, res) => {
  const { id }    = req.params;
  const user_id   = req.user.id;

  const [rows] = await db.query(
    'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
    [id, user_id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await db.query(
    'UPDATE notifications SET is_read = 1 WHERE id = ?',
    [id]
  );

  res.json({ message: 'Notification marked as read' });
});

module.exports = { getNotifications, markAllRead, markOneRead };
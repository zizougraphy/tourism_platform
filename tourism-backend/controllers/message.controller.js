const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── POST /api/messages ───────────────────────────────────────────────────────
// Send a message to another user (tourist → provider or provider → tourist).
const sendMessage = asyncHandler(async (req, res) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id;

  if (!receiver_id || !content) {
    res.status(400);
    throw new Error('receiver_id and content are required');
  }

  if (receiver_id === sender_id) {
    res.status(400);
    throw new Error('Cannot send a message to yourself');
  }

  // Verify receiver exists
  const [receiver] = await db.query('SELECT id FROM users WHERE id = ?', [receiver_id]);
  if (!receiver.length) {
    res.status(404);
    throw new Error('Receiver not found');
  }

  const [result] = await db.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [sender_id, receiver_id, content]
  );

  const [message] = await db.query(
    'SELECT * FROM messages WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ data: message[0] });
});

// ─── GET /api/messages/:userId ────────────────────────────────────────────────
// Conversation between current user and another user.
const getConversation = asyncHandler(async (req, res) => {
  const { userId }   = req.params;
  const current_user = req.user.id;

  const [rows] = await db.query(
    `SELECT m.id, m.content, m.created_at, m.is_read,
            m.sender_id, m.receiver_id,
            u.name AS sender_name
     FROM messages m
     LEFT JOIN users u ON u.id = m.sender_id
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at ASC`,
    [current_user, userId, userId, current_user]
  );

  // Mark received messages as read
  await db.query(
    'UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?',
    [current_user, userId]
  );

  res.json({ data: rows });
});

// ─── GET /api/messages ────────────────────────────────────────────────────────
// Returns inbox: latest message from each conversation partner.
const getInbox = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  // Subquery groups by conversation partner and picks the latest message each time.
  const [rows] = await db.query(
    `SELECT
       m.id,
       m.content,
       m.created_at,
       m.is_read,
       m.sender_id,
       m.receiver_id,
       CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS partner_id,
       u.name AS partner_name
     FROM messages m
     LEFT JOIN users u ON u.id = (
       CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
     )
     WHERE m.sender_id = ? OR m.receiver_id = ?
     ORDER BY m.created_at DESC`,
    [user_id, user_id, user_id, user_id]
  );

  // Deduplicate — keep only the latest message per conversation partner
  const seen = new Set();
  const inbox = rows.filter(row => {
    if (seen.has(row.partner_id)) return false;
    seen.add(row.partner_id);
    return true;
  });

  res.json({ data: inbox });
});

module.exports = { sendMessage, getConversation, getInbox };
const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// Helper — get provider record for the logged-in user (throws if not found)
const getProvider = async (user_id, res) => {
  const [rows] = await db.query(
    'SELECT id, status FROM providers WHERE user_id = ?',
    [user_id]
  );
  if (!rows.length) {
    res.status(403);
    throw new Error('Provider profile not found');
  }
  // still pending and not accepted from the adming
  if (rows[0].status !== 'approved') {
    res.status(403);
    throw new Error('Your provider account is not approved yet');
  }
  return rows[0];
};

// ─── POST /api/provider/services ─────────────────────────────────────────────
const createService = asyncHandler(async (req, res) => {
  const provider = await getProvider(req.user.id, res);
  const { name, description, category, price, city_id, image_url } = req.body;

  if (!name || !category || !price || !city_id) {
    res.status(400);
    throw new Error('name, category, price, and city_id are required');
  }

  const [result] = await db.query(
    `INSERT INTO services (provider_id, name, description, category, price, city_id, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [provider.id, name, description || null, category, price, city_id, image_url || null]
  );

  const [service] = await db.query(
    'SELECT * FROM services WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ data: service[0] });
});

// ─── PUT /api/provider/services/:id ──────────────────────────────────────────
const updateService = asyncHandler(async (req, res) => {
  const provider  = await getProvider(req.user.id, res);
  const { id }    = req.params;
  const { name, description, category, price, city_id, image_url, is_active } = req.body;

  // Make sure the service belongs to this provider
  const [rows] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [id, provider.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  // Build dynamic SET clause — only update fields that were sent
  const fields = [];
  const params = [];

  if (name        !== undefined) { fields.push('name = ?');        params.push(name); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description); }
  if (category    !== undefined) { fields.push('category = ?');    params.push(category); }
  if (price       !== undefined) { fields.push('price = ?');       params.push(price); }
  if (city_id     !== undefined) { fields.push('city_id = ?');     params.push(city_id); }
  if (image_url   !== undefined) { fields.push('image_url = ?');   params.push(image_url); }
  if (is_active   !== undefined) { fields.push('is_active = ?');   params.push(is_active); }

  if (!fields.length) {
    res.status(400);
    throw new Error('No fields to update');
  }

  params.push(id);
  await db.query(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, params);

  const [updated] = await db.query('SELECT * FROM services WHERE id = ?', [id]);

  res.json({ data: updated[0] });
});

// ─── DELETE /api/provider/services/:id ───────────────────────────────────────
// Soft delete — sets is_active = 0 so historical bookings remain intact
const deleteService = asyncHandler(async (req, res) => {
  const provider = await getProvider(req.user.id, res);
  const { id }   = req.params;

  const [rows] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [id, provider.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  await db.query('UPDATE services SET is_active = 0 WHERE id = ?', [id]);

  res.json({ message: 'Service deactivated successfully' });
});

module.exports = { createService, updateService, deleteService };
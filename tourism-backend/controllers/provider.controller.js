const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// Helper — get provider record for the logged-in user (throws if not found)
const getProvider = async (user_id, res) => {
  const [rows] = await db.query(
    'SELECT id, role, is_active FROM users WHERE id = ?',
    [user_id]
  );
  if (!rows.length || rows[0].role !== 'service_provider') {
    res.status(403);
    throw new Error('Provider profile not found');
  }
  if (!rows[0].is_active) {
    res.status(403);
    throw new Error('Your provider account is not active');
  }
  return rows[0];
};

// ─── GET /api/provider/services ──────────────────────────────────────────────
const getMyServices = asyncHandler(async (req, res) => {
  const provider = await getProvider(req.user.id, res);
  
  const [services] = await db.query(
    `SELECT s.*, c.name as city_name 
     FROM services s 
     LEFT JOIN cities c ON c.id = s.city_id 
     WHERE s.provider_id = ? AND s.is_available = 1`,
    [provider.id]
  );

  res.json({ data: services });
});

// ─── POST /api/provider/services ─────────────────────────────────────────────
const createService = asyncHandler(async (req, res) => {
  const provider = await getProvider(req.user.id, res);
  const { name, description, category, price, city_id, image_url } = req.body;

  if (!name || !category || !price || !city_id) {
    res.status(400);
    throw new Error('name, category, price, and city_id are required');
  }

  const [result] = await db.query(
    `INSERT INTO services (provider_id, name, description, category, price, city_id, images)
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
  const { name, description, category, price, city_id, image_url, is_available } = req.body;

  // Make sure the service belongs to this provider
  const [rows] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [id, provider.id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  // Build dynamic SET clause
  const fields = [];
  const params = [];

  if (name         !== undefined) { fields.push('name = ?');         params.push(name); }
  if (description  !== undefined) { fields.push('description = ?');  params.push(description); }
  if (category     !== undefined) { fields.push('category = ?');     params.push(category); }
  if (price        !== undefined) { fields.push('price = ?');        params.push(price); }
  if (city_id      !== undefined) { fields.push('city_id = ?');      params.push(city_id); }
  if (image_url    !== undefined) { fields.push('images = ?');       params.push(image_url); }
  if (is_available !== undefined) { fields.push('is_available = ?'); params.push(is_available ? 1 : 0); }

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

  await db.query('UPDATE services SET is_available = 0 WHERE id = ?', [id]);

  res.json({ message: 'Service deactivated successfully' });
});

module.exports = { getMyServices, createService, updateService, deleteService };
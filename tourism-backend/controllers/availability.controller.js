const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// ─── GET /api/provider/availability/:serviceId ───────────────────────────────
const getAvailability = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const provider_id = req.user.id;

  // Verify service belongs to provider
  const [service] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [serviceId, provider_id]
  );
  if (!service.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  const [rows] = await db.query(
    'SELECT * FROM availability WHERE service_id = ? ORDER BY date ASC',
    [serviceId]
  );

  res.json({ data: rows });
});

// ─── POST /api/provider/availability ─────────────────────────────────────────
// Body: { service_id, date, total_slots }
const setAvailability = asyncHandler(async (req, res) => {
  const { service_id, date, total_slots } = req.body;
  const provider_id = req.user.id;

  if (!service_id || !date || total_slots === undefined) {
    res.status(400);
    throw new Error('service_id, date, and total_slots are required');
  }

  // Verify ownership
  const [service] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [service_id, provider_id]
  );
  if (!service.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  // Upsert: if availability for this date exists, update it; otherwise insert
  const [existing] = await db.query(
    'SELECT id FROM availability WHERE service_id = ? AND date = ?',
    [service_id, date]
  );

  if (existing.length) {
    await db.query(
      'UPDATE availability SET total_slots = ? WHERE id = ?',
      [total_slots, existing[0].id]
    );
  } else {
    await db.query(
      'INSERT INTO availability (service_id, date, total_slots, booked_slots) VALUES (?, ?, ?, 0)',
      [service_id, date, total_slots]
    );
  }

  res.json({ message: 'Availability updated' });
});

// ─── POST /api/provider/availability/bulk ────────────────────────────────────
// Body: { service_id, slots: [{ date, total_slots }, ...] }
const setBulkAvailability = asyncHandler(async (req, res) => {
  const { service_id, slots } = req.body;
  const provider_id = req.user.id;

  if (!service_id || !slots || !Array.isArray(slots)) {
    res.status(400);
    throw new Error('service_id and slots array are required');
  }

  const [service] = await db.query(
    'SELECT id FROM services WHERE id = ? AND provider_id = ?',
    [service_id, provider_id]
  );
  if (!service.length) {
    res.status(404);
    throw new Error('Service not found or not owned by you');
  }

  for (const slot of slots) {
    const [existing] = await db.query(
      'SELECT id FROM availability WHERE service_id = ? AND date = ?',
      [service_id, slot.date]
    );

    if (existing.length) {
      await db.query(
        'UPDATE availability SET total_slots = ? WHERE id = ?',
        [slot.total_slots, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO availability (service_id, date, total_slots, booked_slots) VALUES (?, ?, ?, 0)',
        [service_id, slot.date, slot.total_slots]
      );
    }
  }

  res.json({ message: `${slots.length} availability slots updated` });
});

// ─── DELETE /api/provider/availability/:id ───────────────────────────────────
const deleteAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const provider_id = req.user.id;

  const [rows] = await db.query(
    `SELECT a.id FROM availability a
     JOIN services s ON s.id = a.service_id
     WHERE a.id = ? AND s.provider_id = ?`,
    [id, provider_id]
  );

  if (!rows.length) {
    res.status(404);
    throw new Error('Availability slot not found or not owned by you');
  }

  await db.query('DELETE FROM availability WHERE id = ?', [id]);
  res.json({ message: 'Availability slot deleted' });
});

// ─── GET /api/services/:id/availability (PUBLIC) ─────────────────────────────
const getPublicAvailability = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const [rows] = await db.query(
    `SELECT date, total_slots, booked_slots, 
            (total_slots - booked_slots) AS available_slots
     FROM availability 
     WHERE service_id = ? AND date >= CURDATE()
     ORDER BY date ASC`,
    [serviceId]
  );

  res.json({ data: rows });
});

module.exports = {
  getAvailability,
  setAvailability,
  setBulkAvailability,
  deleteAvailability,
  getPublicAvailability,
};

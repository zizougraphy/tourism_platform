const db = require('../config/db');
const { asyncHandler } = require('../middleware/error.middleware');

// GET /api/services
const getServices = asyncHandler(async (req, res) => {
    const {
        city_id,
        category,
        min_price,
        max_price,
        min_rating,
        page = 1,
        limit = 10,
        search,
    } = req.query;

    const conditions = ['s.is_active = 1']; // initialized at s.is_active = 1 because we only display active services; 
    const params = [];

    if (city_id) {
        conditions.push('s.city_id = ?'); // conditions used for the WHERE query conditions 
        params.push(city_id); // params used for placeholders parameters of query
    }
    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (min_price) {
        conditions.push('s.price >= ?');
        params.push(Number(min_price));
    }
    if (max_price) {
        conditions.push('s.pric <= ?');
        params.push(max_price);
    }
    if (min_rating) {
        conditions.push('s.avg_rating >= ?');
        params.push(min_rating);
    }
    if (search) {
        conditions.push('(s.name LIKE ? OR s.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    

    // Count total for pagination meta
    const [countRows] = await db.query(
        `SELECT COUNT(*) AS total
     FROM services s
     ${whereClause}`,
        params
    );
    const total = countRows[0].total;

    // Main query — join city name and provider name for convenience
    const [services] = await db.query(
        `SELECT
       s.id,
       s.name,
       s.description,
       s.category,
       s.price,
       s.avg_rating,
       s.image_url,
       s.city_id,
       c.name  AS city_name,
       u.name  AS provider_name,
       s.created_at
     FROM services s
     LEFT JOIN cities    c ON c.id = s.city_id
     LEFT JOIN providers p ON p.id = s.provider_id
     LEFT JOIN users     u ON u.id = p.user_id
     ${whereClause}
     ORDER BY s.avg_rating DESC, s.created_at DESC
     LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset]
    );

    res.json({
        data: services,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            total_pages: Math.ceil(total / Number(limit)),
        },
    });
})

// ─── GET /api/services/:id ───────────────────────────────────────────────────
// Public. Returns service details + its reviews (nested).
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
 
  const [rows] = await db.query(
    `SELECT
       s.id,
       s.name,
       s.description,
       s.category,
       s.price,
       s.avg_rating,
       s.image_url,
       s.city_id,
       c.name  AS city_name,
       u.name  AS provider_name,
       p.id    AS provider_id,
       s.created_at
     FROM services s
     LEFT JOIN cities   c ON c.id = s.city_id
     LEFT JOIN providers p ON p.id = s.provider_id
     LEFT JOIN users    u ON u.id = p.user_id
     WHERE s.id = ? AND s.is_active = 1`,
    [id]
  );
 
  if (!rows.length) {
    res.status(404);
    throw new Error('Service not found');
  }
 
  // Fetch reviews for this service, newest first, limit 20
  const [reviews] = await db.query(
    `SELECT
       r.id,
       r.rating,
       r.comment,
       r.created_at,
       u.name AS reviewer_name
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.service_id = ?
     ORDER BY r.created_at DESC
     LIMIT 20`,
    [id]
  );
 
  res.json({
    data: { ...rows[0], reviews },
  });
});
 
module.exports = { getServices, getServiceById };
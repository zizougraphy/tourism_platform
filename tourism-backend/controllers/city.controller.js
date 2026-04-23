const { LIMIT_SQL_LENGTH } = require('sqlite3');
const db                = require('../config/db');
const { asyncHandler }  = require ('../middleware/error.middleware');

// GET /api/cities?search=
const getCities = asyncHandler(async (req, res) => {
    const { search } = req.query; // data from URL: GET /api/cities?search=Algiers
    const params = []; // values for placeholders.
    let sql = 'SELECT id, name, description, weather FROM cities';

    if(search) { // adding and searching filters if exists
        sql += ' WHERE name LIKE ?'; // becoms : SELECT ... FROM cities WHERE name LIKE '%alg%'
        params.push(`%${search}%`);
    }

    sql += ' ORDER BY name ASC';
    
    const [cities] = await db.query(sql, params); // executing the query
    res.json({ 
        success: true,
        data: cities
    });
});

// GET /api/cities/:id
const getCityById = asyncHandler(async (req, res) => {
    const [rows] = await db.query(
        `SELECT c.*,
        COUNT(DISTINCT s.id) AS total_services
        FROM cities c LEFT JOIN services s on s.city_id = c.id
        WHERE c.id = ?`,
        [req.params.id]
    );

    if (!rows.length) {
        return res.status(404).json({
            message: 'City not found!'
        });
    }

    res.json({
        success: true,
        data: rows[0]
    });
});

module.exports = { getCities, getCityById};
const mysql = require('mysql2/promise');
// we used promise for the async/await


const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || 'Tourism@2026',
  database:           process.env.DB_NAME     || 'tourism_platform',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
});

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected — tourism_platform');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

module.exports = pool;
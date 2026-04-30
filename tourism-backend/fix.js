const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
(async function() {
  const db = await mysql.createConnection({ user: 'root', password: 'Tourism@2026', database: 'tourism_platform' });
  const hash = await bcrypt.hash('password123', 12);
  await db.query("UPDATE users SET password = ? WHERE role = 'service_provider'", [hash]);
  console.log('Fixed passwords. Hash: ' + hash);
  process.exit();
})();

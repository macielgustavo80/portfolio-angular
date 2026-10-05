const mysql = require('mysql2/promise');

// O socket local é o mesmo usado pela conexão PHP no Codespace.
const pool = mysql.createPool({
  ...(process.env.DB_HOST
    ? { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306) }
    : { socketPath: process.env.DB_SOCKET || '/run/mysqld/mysqld.sock' }),
  user: process.env.DB_USER || 'dwii_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'dwii_db',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;

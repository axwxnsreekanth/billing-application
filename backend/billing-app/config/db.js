const sql = require('mssql');
require('dotenv').config();


const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

console.log('MSSQL config:', config);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ DB Connection Failed:', err);
  });

module.exports = { sql, poolPromise };

require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Cambia según tu configuración
    trustServerCertificate: true // Cambia según tu configuración
  }
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  sql,
  config,
  getConnection
};

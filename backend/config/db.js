/**
 * CampusFind 2.0 - Database Configuration
 * Configures a MySQL connection pool using mysql2/promise.
 * Prepared for Phase 3 schema execution and query handling.
 */

const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool (supports both granular env vars and cloud DATABASE_URL / MYSQL_URL)
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campusfind_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

if (process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const dbUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
const pool = dbUri ? mysql.createPool(dbUri) : mysql.createPool(poolConfig);

// Promise wrapper for async/await queries
const db = pool.promise();

/**
 * Test MySQL connection
 * Used during server startup / diagnostics
 */
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log(`[Database]: Connected to MySQL database '${process.env.DB_NAME || 'campusfind_db'}' successfully.`);
    connection.release();
    return true;
  } catch (error) {
    console.error('====================================================');
    console.error('[FATAL DATABASE ERROR]: Could not establish MySQL connection!');
    console.error(`Error Code: ${error.code || 'UNKNOWN'}`);
    console.error(`Message   : ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error(`Diagnosis : MySQL server is not running or unreachable at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}.`);
      console.error('Fix       : Ensure the MySQL service/daemon is running (e.g. "net start MySQL80" or Services).');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`Diagnosis : Authentication failed for user '${process.env.DB_USER || 'root'}'.`);
      console.error('Fix       : Check DB_USER and DB_PASSWORD in backend/.env file.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Diagnosis : Database '${process.env.DB_NAME || 'campusfind_db'}' does not exist.`);
      console.error('Fix       : Run "node backend/scripts/setupDatabase.js" to create schema and seed data.');
    } else {
      console.error('Fix       : Verify MySQL configuration in backend/.env.');
    }
    console.error('====================================================');
    return false;
  }
};

module.exports = {
  db,
  pool,
  testConnection
};


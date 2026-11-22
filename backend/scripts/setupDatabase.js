/**
 * CampusFind 2.0 - Database Initialization & Seed Script
 * Reads schema.sql and seed.sql and executes them via the MySQL connection pool
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('--- CampusFind 2.0: Database Setup ---');

  const targetDb = process.env.DB_NAME || 'campusfind_db';
  const isCloudDb = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';

  const connConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    multipleStatements: true
  };

  if (process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || isCloudDb) {
    connConfig.ssl = { rejectUnauthorized: false };
  }

  // On cloud DBs (Aiven, Clever Cloud, etc.), connect directly to assigned database
  if (isCloudDb) {
    connConfig.database = targetDb;
  }

  const connection = await mysql.createConnection(connConfig);

  try {
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

    console.log(`[1/3] Reading schema from: ${schemaPath}`);
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    if (targetDb !== 'campusfind_db') {
      schemaSql = schemaSql.replace(/campusfind_db/g, targetDb);
    }

    console.log('[2/3] Executing schema DDL...');
    await connection.query(schemaSql);
    console.log('      Schema created successfully (users, categories, items, claims, notifications).');

    console.log(`[3/3] Reading & executing seed data from: ${seedPath}`);
    let seedSql = fs.readFileSync(seedPath, 'utf8');
    if (targetDb !== 'campusfind_db') {
      seedSql = seedSql.replace(/campusfind_db/g, targetDb);
    }

    await connection.query(seedSql);
    console.log('      Realistic demonstration seed data inserted successfully.');

    console.log('========================================================');
    console.log(' CampusFind 2.0 Database Setup Completed Successfully! ');
    console.log(` Database Name: ${targetDb}`);
    console.log('========================================================');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();


// lib/db.js
import mysql from 'mysql2/promise';

let pool = null;

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db',
  waitForConnections: true,
  connectionLimit: 10,
};

try {
  pool = mysql.createPool(config);
  console.log('Database pool created');
} catch (error) {
  console.error('Failed to create database pool:', error.message);
}

export default pool;

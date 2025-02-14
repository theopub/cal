import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;
const query = async (...args) => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    });
  }
  const results = await pool.query(...args);
  pool.releaseConnection();
  return results;
};


export const executeGetTags = async () => {
    try {
        const [rows] = await query('SELECT * FROM tags');
        console.log('Tags:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

executeGetTags();

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

export const executeGetEventTags = async (eventId) => {
    try {
        const [ [ rows ] ] = await query('CALL GetEventTags(?)', [ eventId ]);
        console.log('Event Tags:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

export const executeGetEventsToDisplay = async (date) => {
    try {
        const [ [ rows ] ] = await query('CALL GetEventsToDisplay(?)', [ date ]);
        console.log('Events:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

export const executeGetEventDetails = async (eventId) => {
    try {
        const [ [ rows ] ] = await query('CALL GetEventDetails(?)', [ eventId ]);
        console.log('Event Details:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

export const executeWriteEvent = async (event) => {
    try {
        const [rows] = await query(
          'INSERT INTO events (name, start_date, cost, location, description, owner_name, email, event_url, image_url, created_at, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [ 
            event.title,
            event.startDate,
            event.cost,
            event.location,
            event.description,
            event.ownerName,
            event.email,
            event.eventUrl,
            event.imageUrl,
            event.created,
            event.approved,
          ]);
        console.log('Event written:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

export const endPoolConnection = async () => {
    try {
        await pool.end();
    } catch (error) {
        console.error('Error ending pool connection:', error);
        throw error;
    }
};

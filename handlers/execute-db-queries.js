import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
    map,
    isNotNil,
    isNotEmpty,
    join,
} from 'ramda';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});


export const executeGetTags = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM tags');
        console.log('Tags:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing executeGetTags query:', error);
        throw error;
    }
};

export const executeGetEventsToDisplay = async (date) => {
    try {
        const [ [ rows ] ] = await pool.query('CALL GetEventsToDisplay(?)', [ date ]);
        console.log('Events:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing executeGetEventsToDisplay query:', error);
        throw error;
    }
};

export const executeGetEventDetails = async (eventId) => {
    try {
        const [ [ rows ] ] = await pool.query('CALL GetEventDetails(?)', [ eventId ]);
        console.log('Event Details:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing executeGetEventDetails query:', error);
        throw error;
    }
};

export const executeWriteEvent = async (event) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const fields = [
            'name',
            'start_date',
            'cost',
            'location',
            'description',
            'owner_name',
            'email',
            'event_url',
            'image_url',
            'created_at',
            'approved',
        ];
        const [insertEventResult] = await connection.query(
            `INSERT INTO events (${join(', ', fields)}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        const eventId = insertEventResult.insertId;
        if (isNotNil(event.tagIDs) && isNotEmpty(event.tagIDs)) {
            const values = map((tagId) => [eventId, tagId], event.tagIDs);
            await connection.query(
                'INSERT INTO event_tags (event_id, tag_id) VALUES ?',
                [values]
            );
        }
        await connection.commit();
        console.log('Event and tags written successfully');
        return insertEventResult;
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error executing executeWriteEvent transaction:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
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

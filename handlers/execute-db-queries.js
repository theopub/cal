import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
    map,
    isNotNil,
    isNotEmpty,
    join,
} from 'ramda';
import { formatDateTime } from '../utilities/dates.js';

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
        const [tags] = await pool.query('SELECT * FROM tags');
        console.log('Tags:', tags);
        return tags;
    } catch (error) {
        console.error('Error executing executeGetTags query:', error);
        throw error;
    }
};

export const executeGetEventsToDisplay = async (date) => {
    try {
        const [ [ events ] ] = await pool.query('CALL GetEventsToDisplay(?)', [ date ]);
        for (const event of events) {
            event.start_date = formatDateTime(event.start_date);
        }
        console.log('Events:', events);
        return events;
    } catch (error) {
        console.error('Error executing executeGetEventsToDisplay query:', error);
        throw error;
    }
};

export const executeApproveEvents = async (eventIds) => {
    try {
        await pool.query('UPDATE events SET approved = 1 WHERE id IN (?)', [ eventIds ]);
        console.log('Event approved');
    } catch (error) {
        console.error('Error executing approveEvent query:', error);
        throw error;
    }
}

export const executeGetEventsPendingApproval = async () => {
    try {
        const [ [ events ] ] = await pool.query('SELECT * FROM events WHERE approved = 0');
        for (const event of events) {
            event.start_date = formatDateTime(event.start_date);
        }
        console.log('Events:', events);
        return events;
    } catch (error) {
        console.error('Error executing executeGetEventsPendingApproval query:', error);
        throw error;
    }
}

export const executeGetEventDetails = async (eventId) => {
    try {
        const [ [ [event] ] ] = await pool.query('CALL GetEventDetails(?)', [ eventId ]);
        event.start_date = formatDateTime(event.start_date);
        console.log('Event Details:', event);
        return event;
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

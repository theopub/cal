import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {
    map,
    isNotNil,
    isNotEmpty,
    isEmpty,
    split,
    join,
    prop,
    sortBy,
    descend,
    sortWith,
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
        return sortBy(prop('id'))(tags);
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
            event.tag_ids = isNotNil(event.tag_ids) ? map((id) => Number(id))(split(',', event.tag_ids)): [];
        }
        console.log('Events:', events);
        return events;
    } catch (error) {
        console.error('Error executing executeGetEventsToDisplay query:', error);
        throw error;
    }
};

export const executeApproveEvents = async (eventIds) => {
    if (!Array.isArray(eventIds) || isEmpty(eventIds)) {
        console.log('No events to approve');
        return;
    }
    try {
        await pool.query('UPDATE events SET approved = 1 WHERE id IN (?)', [ eventIds ]);
        console.log('Event approved');
    } catch (error) {
        console.error('Error executing approveEvent query:', error);
        throw error;
    }
}

export const executeGetFutureApprovedEvents = async () => {
    try {
        const [ events ] = await pool.query('SELECT * FROM events WHERE approved = 1 AND DATE(start_date) >= CURDATE()');
        for (const event of events) {
            event.start_date = formatDateTime(event.start_date);
        }
        console.log('Events:', events);
        return sortWith([descend(prop('start_date'))])(events);
        // return sortWith([descend(prop('created_at'))])(events);
    } catch (error) {
        console.error('Error executing executeGetFutureEvents query:', error);
        throw error;
    }
}

export const executeGetFuturePendingApprovalEvents = async () => {
    try {
        const [ events ] = await pool.query('SELECT * FROM events WHERE approved = 0 AND DATE(start_date) >= CURDATE()');
        for (const event of events) {
            event.start_date = formatDateTime(event.start_date);
        }
        console.log('Events:', events);
        return sortWith([descend(prop('start_date'))])(events);
        // return sortWith([descend(prop('created_at'))])(events);
    } catch (error) {
        console.error('Error executing executeGetFutureEvents query:', error);
        throw error;
    }
}

export const executeGetEventDetails = async (eventId) => {
    try {
        const [ [ [ event ] ] ] = await pool.query('CALL GetEventDetails(?)', [ eventId ]);
        event.start_date = formatDateTime(event.start_date);
        console.log('Event Details:', event);
        return event;
    } catch (error) {
        console.error('Error executing executeGetEventDetails query:', error);
        throw error;
    }
};

export const executeUpdateEvent = async (event) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE events SET name = ?, start_date = ?, cost = ?, location = ?, description = ?, owner_name = ?, owner_url = ?, email = ?, event_url = ?, event_url_text = ?, image_url = ? WHERE id = ?',
            [
                event.title,
                event.startDate,
                event.cost,
                event.location,
                event.description,
                event.ownerName,
                event.ownerUrl,
                event.email,
                event.eventUrl,
                event.eventUrlText,
                event.imageUrl,
                event.id,
            ]);
        await connection.query('DELETE FROM event_tags WHERE event_id = ?', [ event.id ]);
        if (isNotNil(event.tagIDs) && isNotEmpty(event.tagIDs)) {
            const values = map((tagId) => [event.id, tagId], event.tagIDs);
            await connection.query(
                'INSERT INTO event_tags (event_id, tag_id) VALUES ?',
                [values]
            );
        }
        await connection.commit();
        console.log('Event updated successfully');
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error executing executeUpdateEvent transaction:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

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
            'owner_url',
            'email',
            'event_url',
            'event_url_text',
            'image_url',
            'approved',
        ];
        const [insertEventResult] = await connection.query(
            `INSERT INTO events (${join(', ', fields)}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                event.title,
                event.startDate,
                event.cost,
                event.location,
                event.description,
                event.ownerName,
                event.ownerUrl,
                event.email,
                event.eventUrl,
                event.eventUrlText,
                event.imageUrl,
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

export const executeRejectEvents = async (eventIds) => {
    try {
        await pool.query('UPDATE events SET approved = -1 WHERE id IN (?)', [ eventIds ]);
        console.log('Events unapproved');
    } catch (error) {
        console.error('Error executing executeUnApproveEvents query:', error);
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

-- Migration script to add multi-day event support
-- Run this before updating the application code

-- Create the new event_dates table
CREATE TABLE IF NOT EXISTS event_dates(
    id INT NOT NULL AUTO_INCREMENT,
    event_id INT NOT NULL,
    event_date DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_event_id (event_id)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

-- Populate event_dates table with existing events
-- This assumes all existing events are single-day events
INSERT INTO event_dates (event_id, event_date)
SELECT id, start_date FROM events
WHERE id NOT IN (SELECT DISTINCT event_id FROM event_dates);

-- Update stored procedures
DELIMITER $$

CREATE PROCEDURE GetEventsToDisplay_V2 (IN input_date DATE)
BEGIN
    SELECT 
        e.id, 
        ed.event_date AS start_date,
        e.image_url,
        GROUP_CONCAT(et.tag_id) AS tag_ids
    FROM event_dates ed
    INNER JOIN events e ON ed.event_id = e.id
    LEFT JOIN event_tags et ON e.id = et.event_id
    WHERE e.approved = TRUE
    AND DATE(ed.event_date) BETWEEN DATE_SUB(input_date, INTERVAL 1 DAY) 
                                AND DATE_ADD(input_date, INTERVAL 10 DAY)
    GROUP BY e.id, ed.event_date, e.image_url
    ORDER BY ed.event_date ASC;
END$$

CREATE PROCEDURE GetEventDetails_V2 (IN input_id INT)
BEGIN
    SELECT 
        e.*, 
        GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS tags,
        GROUP_CONCAT(ed.event_date ORDER BY ed.event_date SEPARATOR ', ') AS all_dates
    FROM events e
    LEFT JOIN (
        event_tags et 
        INNER JOIN tags t ON et.tag_id = t.id
    ) ON e.id = et.event_id
    LEFT JOIN event_dates ed ON e.id = ed.event_id
    WHERE e.id = input_id
    GROUP BY e.id;
END$$

DELIMITER ; 
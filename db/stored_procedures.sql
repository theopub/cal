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

-- Deprecated procedures

CREATE PROCEDURE GetEventsToDisplay (IN input_date DATE)
BEGIN
    SELECT 
        e.id, 
        e.start_date, 
        e.image_url,
        GROUP_CONCAT(et.tag_id) AS tag_ids
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.event_id
    WHERE e.approved = TRUE
    AND DATE(e.start_date) BETWEEN DATE_SUB(input_date, INTERVAL 1 DAY) AND DATE_ADD(input_date, INTERVAL 10 DAY)
    GROUP BY e.id, e.start_date, e.image_url
    ORDER BY e.start_date ASC;
END$$

CREATE PROCEDURE GetEventDetails (IN input_id INT)
BEGIN
    SELECT 
        e.*, 
        GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS tags
    FROM events e
    LEFT JOIN (
        event_tags et 
        INNER JOIN tags t ON et.tag_id = t.id
    ) ON e.id = et.event_id
    WHERE e.id = input_id
    GROUP BY e.id;
END$$

DELIMITER ;

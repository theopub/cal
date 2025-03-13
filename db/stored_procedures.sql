DELIMITER $$

CREATE PROCEDURE GetEventsToDisplay (IN input_date DATE)
BEGIN
    SELECT id, start_date, image_url
    FROM events
    WHERE approved = TRUE
    AND start_date BETWEEN input_date AND DATE_ADD(input_date, INTERVAL 30 DAY)
    ORDER BY start_date ASC;
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

CREATE PROCEDURE GetEventsbyTagID (IN input_tag_ids VARCHAR(255))
BEGIN
    SELECT DISTINCT
        e.id, 
        e.start_date, 
        e.image_url
    FROM events e
    INNER JOIN event_tags et ON e.id = et.event_id
    WHERE FIND_IN_SET(et.tag_id, input_tag_ids)
    AND e.approved = TRUE
    ORDER BY e.start_date ASC;
END$$

DELIMITER ;

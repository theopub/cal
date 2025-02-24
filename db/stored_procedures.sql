DELIMITER $$

CREATE PROCEDURE GetEventsToDisplay (IN input_date DATE)
BEGIN
    SELECT id, start_date, image_url
    FROM events
    WHERE approved = TRUE
    AND start_date BETWEEN DATE_SUB(input_date, INTERVAL 5 DAY) AND DATE_ADD(input_date, INTERVAL 14 DAY)
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

DELIMITER ;
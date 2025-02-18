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
    SELECT *
    FROM events
    WHERE id = input_id;
END$$

CREATE PROCEDURE GetEventTags (IN input_id INT)
BEGIN
    SELECT tag_name
    FROM tags
    JOIN event_tags
    ON tags.id = event_tags.tag_id
    WHERE event_tags.event_id = input_id;
END$$

DELIMITER ;
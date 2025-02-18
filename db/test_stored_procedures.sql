DELIMITER $$

CREATE PROCEDURE GetTestEventsToDisplay (IN input_date DATE)
BEGIN
    SELECT id, start_date, image_url
    FROM test_events
    WHERE approved = TRUE
    AND start_date BETWEEN DATE_SUB(input_date, INTERVAL 5 DAY) AND DATE_ADD(input_date, INTERVAL 14 DAY)
    ORDER BY start_date ASC;
END$$

CREATE PROCEDURE GetTestEventDetails (IN input_id INT)
BEGIN
    SELECT *
    FROM test_events
    WHERE id = input_id;
END$$

CREATE PROCEDURE GetTestEventTags (IN input_id INT)
BEGIN
    SELECT tag_name
    FROM test_tags
    JOIN test_event_tags
    ON tags.id = test_event_tags.tag_id
    WHERE test_event_tags.event_id = input_id;
END$$

DELIMITER ;
-- Populate event_dates table with existing events
-- This ensures all events have corresponding event_dates records for the multi-day event functionality

INSERT INTO event_dates (event_id, event_date)
SELECT id, start_date FROM events 
WHERE id NOT IN (SELECT DISTINCT event_id FROM event_dates); 
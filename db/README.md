# MySQL Database Directory

This directory contains all the SQL files needed to set up and populate the Red Calendar database.

## table_schemas.sql

Contains the database schema definitions for the Red Calendar application.

### Tables

- **events**: Main table storing event information including name, dates, location, descriptions, image url and submission information.
- **tags**: Table containing tags for categorizing events.
- **event_tags**: Junction table linking events to their associated tags.

The `events` table has a composite [index](https://dev.mysql.com/doc/refman/8.4/en/mysql-indexes.html) to optimize retrieval of events by date. [Foreign key constraints](https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html) in the `event_tags` table maintain data consistency across the tables.

## stored_procedures.sql

Contains MySQL [stored procedures](https://en.wikipedia.org/wiki/Stored_procedure) for common database operations.

### Procedures

- **GetEventsToDisplay(input_date)**: Retrieves events for display on the calendar within a date range.
- **GetEventDetails(input_id)**: Gets complete event details including associated tags.

## Snapshots

SQL files containing insert statements for populating the local database with production-like data.

- `tags_snapshot.sql`
- `event_tags_snapshot.sql`
- `events_snapshot.sql`

The `events_snapshot.sql` file uses MySQL date functions to dynamically calculate event dates relative to the current date.

## Database Initialization for local development

These files are automatically loaded when the MySQL Docker container starts up, as configured in `docker-compose.yml`:

1. `table_schemas.sql` - Creates the database structure
2. `stored_procedures.sql` - Adds stored procedures
3. `tags_snapshot.sql` - Populates tags
4. `events_snapshot.sql` - Adds sample events
5. `event_tags_snapshot.sql` - Links events to tags

This ensures a complete, ready-to-use database for local development.
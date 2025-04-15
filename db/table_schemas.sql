CREATE TABLE events(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    start_date DATETIME,
    cost VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    owner_name VARCHAR(100) NOT NULL,
    owner_url VARCHAR(512),
    email VARCHAR(255) NOT NULL,
    event_url VARCHAR(512),
    event_url_text VARCHAR(512),
    image_url VARCHAR(512),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

CREATE INDEX event_start_created ON events(start_date, created_at);

CREATE TABLE tags (
    id INT NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

CREATE TABLE event_tags (
    event_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

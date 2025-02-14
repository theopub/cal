CREATE TABLE test_events(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    start_date DATETIME,
    cost INT,
    location VARCHAR(255),
    description TEXT,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    event_url VARCHAR(512),
    image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

CREATE INDEX test_event_start_created ON test_events(start_date, created_at);

CREATE TABLE test_tags (
    id INT NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

CREATE TABLE test_event_tags (
    event_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (event_id, tag_id),
    FOREIGN KEY (event_id) REFERENCES test_events(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES test_tags(id) ON DELETE CASCADE
) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci';

INSERT INTO test_tags (tag_name) VALUES ('activism'), ('readings'), ('music'), ('performance'), ('dance'), ('rebel code'), ('artsy tech'), ('education'), ('protest'), ('mutual aid'), ('fashion'), ('film'), ('theatre'), ('comedy'), ('literature'), ('religion'), ('politics'), ('community'), ('environment');

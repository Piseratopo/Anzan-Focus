CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL
);
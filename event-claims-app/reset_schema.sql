-- Drop existing tables
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS task_types CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- Create users table
CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(50),
    role VARCHAR(50)
);

-- Create claims table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    short_desc TEXT,
    details TEXT,
    submitted_by VARCHAR(255),
    submitted_at TIMESTAMPTZ,
    status VARCHAR(50),
    due_date TIMESTAMPTZ,
    priority VARCHAR(50),
    last_updated TIMESTAMPTZ,
    userId INT,
    task_type INTEGER NOT NULL,
    amount DECIMAL(10, 2),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE task_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    short_desc TEXT,
    details TEXT,
    submitted_by VARCHAR(255),
    submitted_at TIMESTAMPTZ,
    status VARCHAR(50),
    due_date TIMESTAMPTZ,
    priority VARCHAR(50),
    last_updated TIMESTAMPTZ,
    userId INT,
    task_type VARCHAR(50),
    amount DECIMAL(10, 2),
    FOREIGN KEY (userId) REFERENCES users(userId)
);


INSERT INTO task_types (name) VALUES 
    ('Event Idea'),
    ('Expense');

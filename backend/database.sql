-- Dishes Table
CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    ingredients JSONB -- Stores array of ingredients: [{id, name, qty, cost}]
);

-- Packages Table
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    price_per_pax DECIMAL(10,2),
    selected_dish_ids JSONB -- Stores array of dish IDs: [1, 2, 5]
);

-- Quotations Table
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    lead_id INT,
    lead_name VARCHAR(255),
    lead_phone VARCHAR(50),
    package_id INT,
    package_name VARCHAR(255),
    hall_id INT,
    hall_name VARCHAR(255),
    event_date DATE,
    pax INT,
    price_per_pax DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Data for Dishes
INSERT INTO dishes (name, category, cost_price, selling_price, ingredients) VALUES 
('Paneer Tikka', 'Starter', 45.00, 150.00, '[{"name": "Paneer", "qty": 0.2, "cost": 40}]'),
('Butter Chicken', 'Main Course', 80.00, 250.00, '[{"name": "Chicken", "qty": 0.3, "cost": 60}]');

-- Insert Dummy Data for Packages
INSERT INTO packages (name, type, price_per_pax, selected_dish_ids) VALUES 
('Gold Wedding', 'Wedding', 850.00, '[1, 2]');

-- Insert Dummy Data for Quotations
INSERT INTO quotations (lead_name, package_name, event_date, pax, total_amount, status) VALUES 
('Rahul Kapoor', 'Gold Wedding', '2025-12-15', 300, 255000.00, 'Draft');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    password VARCHAR(255), -- Note: In production, use bcrypt to hash passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table (Full Schema)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    event_date DATE,
    pax INT,
    status VARCHAR(50),
    quote_id INT,
    package_id INT,
    damage_cost DECIMAL(10,2) DEFAULT 0,
    damage_description TEXT,
    audit_status VARCHAR(50),
    inventory_deducted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    event_id INT,
    amount DECIMAL(10,2),
    mode VARCHAR(50),
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banquet Halls
CREATE TABLE banquet_halls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(100),
    capacity INT,
    rate DECIMAL(10,2)
);

-- Time Slots
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    start_time VARCHAR(20),
    end_time VARCHAR(20)
);

-- Event Types
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100)
);

-- Taxes
CREATE TABLE taxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    rate DECIMAL(5,2),
    is_default BOOLEAN DEFAULT FALSE
);

-- Payment Modes
CREATE TABLE payment_modes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE
);

-- Services (Add-ons)
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    cost DECIMAL(10,2),
    unit VARCHAR(50)
);

-- Task Templates
CREATE TABLE task_templates (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100),
    task_name VARCHAR(255),
    assigned_role VARCHAR(100)
);

-- Tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    event_id INT,
    event_title VARCHAR(255),
    event_date DATE,
    description VARCHAR(255),
    assigned_role VARCHAR(100),
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- Staff Assignments
CREATE TABLE staff_assignments (
    id SERIAL PRIMARY KEY,
    event_id INT,
    event_title VARCHAR(255),
    event_date DATE,
    staff_id INT,
    staff_name VARCHAR(100),
    staff_role VARCHAR(100)
);
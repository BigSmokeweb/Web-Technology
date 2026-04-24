-- Create and use the database
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO products (name, category, price, quantity, description) VALUES
('Wireless Keyboard', 'Electronics', 1299.00, 50, 'Compact wireless keyboard with 2.4GHz connectivity'),
('Office Chair', 'Furniture', 8999.00, 15, 'Ergonomic office chair with lumbar support'),
('Notebook A4', 'Stationery', 120.00, 200, 'Ruled notebook with 200 pages'),
('USB-C Hub', 'Electronics', 2499.00, 30, '7-in-1 USB-C hub with HDMI and SD card reader'),
('Desk Lamp', 'Furniture', 799.00, 40, 'LED desk lamp with adjustable brightness');

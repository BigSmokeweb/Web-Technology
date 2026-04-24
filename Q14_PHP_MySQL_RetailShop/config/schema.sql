-- Create database
CREATE DATABASE IF NOT EXISTS retailshop_db;
USE retailshop_db;

CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    product_id  VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(150) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    quantity    INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO products (product_id, name, price, quantity) VALUES
('PRD-A1B2C3', 'Wireless Keyboard', 1299.00, 45),
('PRD-D4E5F6', 'USB-C Hub', 2499.00, 30),
('PRD-G7H8I9', 'Notebook A4 (200 pages)', 120.00, 200),
('PRD-J1K2L3', 'Desk Lamp LED', 799.00, 60),
('PRD-M4N5O6', 'Office Chair', 8999.00, 8);

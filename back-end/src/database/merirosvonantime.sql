-- Drop existing tables if they exist
DROP TABLE IF EXISTS OrderDetails;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS FoodItem;
DROP TABLE IF EXISTS Users;

-- Continue with your script to create the database and tables
CREATE DATABASE IF NOT EXISTS merirosvonAntimet;
USE merirosvonAntimet;


-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'staff', 'admin') NOT NULL
);

-- Create FoodItem table
CREATE TABLE FoodItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(40),
    imageUrl VARCHAR(255)
);

-- Modify Cart table to include food items and quantity
CREATE TABLE Cart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    foodItemId INT,
    quantity INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (foodItemId) REFERENCES FoodItem(id)
);

-- Create Order table
CREATE TABLE `Order` (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    totalPrice DECIMAL(10,2) NOT NULL,
    orderDate DATETIME NOT NULL,
    orderStatus ENUM('pending', 'completed', 'cancelled') NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create OrderDetails table for storing order items
CREATE TABLE OrderDetails (
    orderDetailId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    foodItemId INT,
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES `Order`(orderId),
    FOREIGN KEY (foodItemId) REFERENCES FoodItem(id)
);

-- Insert test users
INSERT INTO Users (username, email, password, role) VALUES 
('john_doe', 'john.doe@example.com', 'hashed_password', 'user'),
('jane_staff', 'jane.staff@example.com', 'hashed_password', 'staff'),
('admin_user', 'admin@example.com', 'hashed_password', 'admin');

-- Insert test food items
INSERT INTO FoodItem (name, description, price, category, imageUrl) VALUES 
('Margherita Pizza', 'Classic Margherita with mozzarella cheese and basil.', 9.99, 'Pizza', './assets/images/menu-placeholder.png'),
('Veggie Burger', 'A healthy veggie burger loaded with fresh vegetables.', 7.99, 'Burger', './assets/images/menu-placeholder.png'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing.', 5.99, 'Salad', 'images/caesarsalad.jpg');

-- Insert a test cart item for user 1
INSERT INTO Cart (userId, foodItemId, quantity) VALUES 
(1, 1, 2); -- User 1 adds 2 Margherita Pizzas to their cart

-- Insert a test order for user 1
INSERT INTO `Order` (userId, totalPrice, orderDate, orderStatus) VALUES 
(1, 23.97, NOW(), 'completed');

-- Insert test order details for order 1
INSERT INTO OrderDetails (orderId, foodItemId, quantity) VALUES 
(1, 1, 1), -- Order 1 contains 1 Margherita Pizza
(1, 2, 1), -- Order 1 contains 1 Veggie Burger
(1, 3, 1); -- Order 1 contains 1 Caesar Salad

CREATE DATABASE merirosvonAntimet;
USE merirosvonAntimet;


-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(255) NOT NULL, -- should be hashed in production
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

-- Create Cart table
CREATE TABLE Cart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES Users(id)
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

-- Create OrderDetails table
CREATE TABLE OrderDetails (
    orderDetailId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    foodItemId INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES `Order`(orderId),
    FOREIGN KEY (foodItemId) REFERENCES FoodItem(id)
);


-- iNSERT MOCK DATA


-- Insert Users
INSERT INTO Users (username, email, password, role) VALUES 
('john_doe', 'john.doe@example.com', 'hashed_password', 'user'),
('jane_staff', 'jane.staff@example.com', 'hashed_password', 'staff'),
('admin_user', 'admin@example.com', 'hashed_password', 'admin');

-- Insert FoodItems
INSERT INTO FoodItem (name, description, price, category, imageUrl) VALUES 
('Margherita Pizza', 'Classic Margherita with mozzarella cheese and basil.', 9.99, 'Pizza', 'images/margherita.jpg'),
('Veggie Burger', 'A healthy veggie burger loaded with fresh vegetables.', 7.99, 'Burger', 'images/veggieburger.jpg'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing.', 5.99, 'Salad', 'images/caesarsalad.jpg');

-- Insert Cart (Assuming user with id 1 is adding to their cart)
INSERT INTO Cart (userId) VALUES 
(1);

-- Insert Orders (Assuming user with id 1 made an order)
INSERT INTO `Order` (userId, totalPrice, orderDate, orderStatus) VALUES 
(1, 23.97, NOW(), 'completed');

-- Assuming the order with orderId 1 consists of all three food items added
-- Insert OrderDetails (orderId, foodItemId, quantity, price)
INSERT INTO OrderDetails (orderId, foodItemId, quantity, price) VALUES 
(1, 1, 1, 9.99),
(1, 2, 1, 7.99),
(1, 3, 1, 5.99);

-- USE CASES

-- SQL to update a user's email address
UPDATE Users SET email = 'new_email@example.com' WHERE id = 1;

-- SQL to update a user's password (should be hashed in production)
UPDATE Users SET password = 'new_hashed_password' WHERE id = 1;


-- SQL to delete a user and associated records (cascading delete)
DELETE FROM Users WHERE id = 2;


-- SQL to query food items by category
SELECT * FROM FoodItem WHERE category = 'Pizza';

-- SQL to mark an order as completed
UPDATE `Order` SET orderStatus = 'completed' WHERE orderId = 1;

-- SQL to remove specific items from a user's cart
DELETE FROM OrderDetails WHERE cartId = 1 AND foodItemId = 3;

-- SHOW TABLES
SHOW TABLES;
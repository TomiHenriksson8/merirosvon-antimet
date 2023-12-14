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
    orderStatus ENUM('pending', 'completed', 'accepted', 'cancelled') NOT NULL,
    estimatedPickupTime INT,
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

-- Insert food items
INSERT INTO FoodItem (name, description, price, category, imageUrl) VALUES 
('Pizza Margherita', 'Klassinen pizza mozzarella juustolla, tomaattikastikkeella sekä tuoreella basilikalla.', 9.99, 'Pizza', './assets/images/pizzamar.png'),
('Pizza Sardiini ja makrilli', 'Merellinen pizza jossa on sardiineja ja makrilli.', 9.99, 'Pizza', './assets/images/sardiinipizza.png'),
('Pizza Kasvi', 'Vegaaneille sopiva juustoton pizza, jossa päivän kasvi.', 9.99, 'Pizza', './assets/images/kasvipizza.png'),
('Kapteenin hampurilainen', 'Naudanlihapihvi, cheddarjuustoa, majoneesia, tomaattia ja jäävuorisalaattia.', 7.99, 'Burger', './assets/images/hampurikap.png'),
('Merirosvon kasvispurilainen', 'Merirosvon vegepihvi, vuustokastiketta, BBQ-kastiketta, coleslawia ja majoneesia', 7.99, 'Burger', './assets/images/hampurimeriros.png'),
('Kalapuri auts!', 'Rapea seitipihvi, valkosipuli-kastiketta ja salaattia.', 7.99, 'Burger', './assets/images/hampurikala.png'),
('Maakrapun kanasalaatti', 'kananrintaa ja salaattia', 5.99, 'Salaatit', './assets/images/salaattikana.png'),
('Merenpohjan salaatti', 'Merilevää ja merisuolaa', 5.99, 'Salaatit', './assets/images/salaattimeri.png'),
('Itämeren vettä', 'Tynnyri rehevää vettä', 2.99, 'Juomat', './assets/images/juomatynnyri.png'),
('Jäämeren jäävesi', 'Kimpale pohjoisnapaa lasissa', 7.99, 'Juomat', './assets/images/juomajää.png'),
('Cola', 'Cola-juomaa', 3.99, 'Juomat', './assets/images/juomacola.png');



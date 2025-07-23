-- Create and select database
CREATE DATABASE retail_dashboard;
USE retail_dashboard;

-- SCHEMA CREATION
-- Table: products
CREATE TABLE products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Category VARCHAR(50),
    Price DECIMAL(10, 2),
    Stock INT
);

-- Table: stores
CREATE TABLE stores (
    StoreID INT PRIMARY KEY,
    StoreName VARCHAR(100),
    Location VARCHAR(100)
);

-- Table: employees
CREATE TABLE employees (
    EmployeeID INT PRIMARY KEY,
    Name VARCHAR(100),
    Role VARCHAR(50),
    StoreID INT,
    FOREIGN KEY (StoreID) REFERENCES stores(StoreID)
);

-- Table: sales
CREATE TABLE sales (
    SaleID INT PRIMARY KEY,
    ProductID INT,
    StoreID INT,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES products(ProductID),
    FOREIGN KEY (StoreID) REFERENCES stores(StoreID)
);

-- CRUD OPERATIONS
-- Insert into products
INSERT INTO products VALUES
(1, 'Laptop', 'Electronics', 55000.00, 30),
(2, 'Mobile Phone', 'Electronics', 25000.00, 50),
(3, 'Shoes', 'Footwear', 2000.00, 100),
(4, 'T-Shirt', 'Clothing', 800.00, 70),
(5, 'Smart Watch', 'Electronics', 5000.00, 40),
(6, 'Bluetooth Speaker', 'Electronics', 1500.00, 25);

-- Insert into stores
INSERT INTO stores VALUES
(101, 'Hexa Retail - Bangalore', 'Bangalore'),
(102, 'Hexa Retail - Hyderabad', 'Hyderabad'),
(103, 'Hexa Retail - Chennai', 'Chennai'),
(104, 'Hexa Retail - Delhi', 'Delhi'),
(105, 'Hexa Retail - Pune', 'Pune');

-- Insert into employees
INSERT INTO employees VALUES
(201, 'Rishitha', 'Manager', 101),
(202, 'Kiran', 'Cashier', 101),
(203, 'Sudha', 'Salesperson', 102),
(204, 'Anjali', 'Cashier', 103),
(205, 'Savitri', 'Stock Manager', 102);

-- Insert into sales
INSERT INTO sales VALUES
(301, 1, 101, 3, '2024-07-01'),
(302, 2, 102, 5, '2024-07-02'),
(303, 3, 103, 2, '2024-07-02'),
(304, 5, 102, 6, '2024-07-03'),
(305, 4, 101, 4, '2024-07-03'),
(306, 2, 104, 7, '2024-07-04'),
(307, 6, 105, 5, '2024-07-04');

-- READ (Select data)
SELECT * FROM products;
SELECT * FROM stores;
SELECT * FROM employees;
SELECT * FROM sales;
SELECT * FROM sales WHERE StoreID = (SELECT StoreID FROM stores WHERE Location = 'Bangalore');

-- UPDATE 
UPDATE products
SET Price = 60000
WHERE ProductID = 1;

-- DELETE 
DELETE FROM sales WHERE SaleID = 305;

-- STORED PROCEDURE

-- To Get total quantity sold by a specific store
DELIMITER //

CREATE PROCEDURE GetTotalSalesByStore(IN inputStoreID INT)
BEGIN
    SELECT StoreID, SUM(QuantitySold) AS TotalQuantity
    FROM sales
    WHERE StoreID = inputStoreID
    GROUP BY StoreID;
END //

DELIMITER ;

-- CALLING THE STORED PROCEDURE
-- Example: Get total quantity sold by StoreID 102
CALL GetTotalSalesByStore(102);

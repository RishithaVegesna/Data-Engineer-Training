create database books;
use books;

-- PART 1: Design the Database
CREATE TABLE books (
    book_id INT PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    genre VARCHAR(50),
    price DECIMAL(8,2)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    book_id INT,
    order_date DATE,
    quantity INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- PART 2: Insert Sample data
INSERT INTO books (book_id, title, author, genre, price) VALUES
(1, 'The Silent River', 'Anita Desai', 'Fiction', 450.00),
(2, 'Python Basics', 'John Mathew', 'Education', 650.00),
(3, 'Space & Beyond', 'Neil Tyson', 'Science', 720.00),
(4, 'Love & Hope', 'Chetan Bhagat', 'Romance', 300.00),
(5, 'MySQL Guide', 'Robert Smith', 'Education', 800.00);

INSERT INTO customers (customer_id, name, email, city) VALUES
(1, 'Riya Sharma', 'riya@example.com', 'Hyderabad'),
(2, 'Amit Verma', 'amitv@example.com', 'Delhi'),
(3, 'Sneha Rao', 'sneha@example.com', 'Bangalore'),
(4, 'Karan Mehta', 'karan@example.com', 'Hyderabad'),
(5, 'Nisha Jain', 'nisha@example.com', 'Mumbai');

INSERT INTO orders (order_id, customer_id, book_id, order_date, quantity) VALUES
(1, 1, 2, '2023-02-15', 1),
(2, 2, 3, '2023-05-12', 2),
(3, 3, 5, '2023-01-20', 1),
(4, 4, 2, '2024-03-10', 1),
(5, 1, 5, '2024-06-25', 2),
(6, 5, 3, '2024-07-10', 1),
(7, 1, 3, '2024-07-15', 1);

-- PART 3: Queries
-- 1. List all books with price above 500.
SELECT * FROM books WHERE price > 500;

-- 2. Show all customers from the city of ‘Hyderabad’.
SELECT * FROM customers WHERE city='Hyderabad';

-- 3. Find all orders placed after ‘2023-01-01’.
SELECT * FROM orders WHERE order_date > '2023-01-01';

-- 4. Show customer names along with book titles they purchased.
SELECT c.name AS customer_name,b.title AS book_title
FROM orders o
INNER JOIN customers c ON o.customer_id=c.customer_id
INNER JOIN books b ON o.book_id=b.book_id;

-- 5. List each genre and total number of books sold in that genre.
SELECT b.genre AND SUM(o.quantity) AS total_sold
FROM orders o
INNER JOIN books b ON o.book_id=b.book_id
GROUP BY b.genre;

-- 6. Find the total sales amount (price × quantity) for each book.
SELECT b.title,SUM(b.price * o.quantity) AS total_sales
FROM orders o
INNER JOIN books b ON b.book_id=o.book_id
GROUP BY b.title;	

-- 7. Show the customer who placed the highest number of orders.
SELECT c.name,COUNT(o.order_id) AS total_orders
FROM orders o 
INNER JOIN customers c ON o.customer_id=c.customer_id
GROUP BY c.name
ORDER BY total_orders DESC
LIMIT 1;

-- 8. Display average price of books by genre.
SELECT genre,AVG(price) AS avg_price
FROM books
GROUP BY genre;

-- 9. List all books that have not been ordered.
SELECT * FROM  books
WHERE book_id NOT IN(SELECT DISTINCT book_id FROM orders );

-- 10. Show the name of the customer who has spent the most in total.
SELECT c.name,SUM(b.price*o.quantity) AS total_spent
FROM orders o 
INNER JOIN customers c ON o.customer_id=c.customer_id
INNER JOIN books b ON o.book_id=b.book_id
GROUP BY c.name
ORDER BY total_spent DESC
LIMIT 1;


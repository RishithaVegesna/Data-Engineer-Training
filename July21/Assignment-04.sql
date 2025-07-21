create database movies;
use movies;
-- SECTION 1: DATABASE DESIGN
CREATE TABLE movies (
  movie_id INT PRIMARY KEY,
  title VARCHAR(100),
  genre VARCHAR(50),
  release_year INT,
  rental_rate DECIMAL(5,2)
);

CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  city VARCHAR(50)
);

CREATE TABLE rentals (
  rental_id INT PRIMARY KEY,
  customer_id INT,
  movie_id INT,
  rental_date DATE,
  return_date DATE,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);
-- SECTION 2: DATA INSERTION
INSERT INTO movies (movie_id, title, genre, release_year, rental_rate) VALUES
(1, 'Baahubali', 'Epic', 2015, 120.00),
(2, 'Pushpa: The Rise', 'Action', 2021, 150.00),
(3, 'Kalki 2898 AD', 'Sci-Fi', 2024, 100.00),
(4, 'RRR', 'Historical', 2022, 170.00),
(5, 'Hi Nanna', 'Drama', 2023, 130.00);

INSERT INTO customers (customer_id, name, email, city) VALUES
(1, 'Amit Sharma', 'amit@gmail.com', 'Delhi'),
(2, 'Ravi Kumar', 'ravi@gmail.com', 'Bangalore'),
(3, 'Sneha Reddy', 'sneha@gmail.com', 'Hyderabad'),
(4, 'Priya Das', 'priya@gmail.com', 'Mumbai'),
(5, 'Karan Mehta', 'karan@gmail.com', 'Chennai');  

INSERT INTO rentals (rental_id, customer_id, movie_id, rental_date, return_date) VALUES
(1, 1, 1, '2024-01-01', '2024-01-05'),  
(2, 2, 2, '2024-01-10', '2024-01-14'),  
(3, 3, 3, '2024-02-01', '2024-02-05'),  
(4, 1, 2, '2024-03-01', '2024-03-04'), 
(5, 4, 4, '2024-04-01', '2024-04-06'),  
(6, 3, 1, '2024-05-01', '2024-05-05'), 
(7, 2, 5, '2024-06-01', NULL),          
(8, 1, 3, '2024-07-01', '2024-07-04'); 

-- SECTION 3: QUERY EXECUTION
-- BASIC QUERIES
-- 1. Retrieve all movies rented by a customer named 'Amit Sharma'.
SELECT m.*
FROM movies m
INNER JOIN rentals r ON m.movie_id=r.movie_id
INNER JOIN customers c ON c.customer_id=r.customer_id
WHERE c.name='Amit Sharma';

-- 2. Show the details of customers from 'Bangalore'.
SELECT * FROM customers
WHERE city='Bangalore';

-- 3. List all movies released after the year 2020.
SELECT * FROM movies
WHERE release_year > 2020;

-- Aggregate Queries
-- 4. Count how many movies each customer has rented.
SELECT c.name,COUNT(r.rental_id) AS rental_count
FROM customers c 
LEFT JOIN rentals r ON c.customer_id=r.customer_id
GROUP BY c.name;

-- 5. Find the most rented movie title.
SELECT m.title,COUNT(r.rental_id) AS times_rented
FROM movies m
INNER JOIN rentals r ON m.movie_id=r.movie_id
GROUP BY  m.title
ORDER BY times_rented DESC
LIMIT 1;

-- 6. Calculate total revenue earned from all rentals.
SELECT SUM(m.rental_rate) AS total_rent
FROM rentals r 
INNER JOIN movies m ON r.movie_id=m.movie_id;

-- Advanced Queries
-- 7. List all customers who have never rented a movie.
SELECT * FROM customers
WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM rentals);

-- 8. Show each genre and the total revenue from that genre.
SELECT m.genre,SUM(m.rental_rate) AS revenue
FROM rentals r
INNER JOIN movies m ON r.movie_id=m.movie_id
GROUP BY m.genre;

-- 9. Find the customer who spent the most money on rentals.
SELECT c.name,SUM(m.rental_rate) AS total_spent
FROM rentals r
INNER JOIN customers c ON r.customer_id=c.customer_id
INNER JOIN movies m ON r.movie_id=m.movie_id
GROUP BY c.name
ORDER BY total_spent DESC
LIMIT 1;

-- 10. Display movie titles that were rented and not yet returned (return_date IS NULL).
SELECT m.title
FROM rentals r 
INNER JOIN movies m ON r.movie_id=m.movie_id
WHERE r.return_date IS NULL;



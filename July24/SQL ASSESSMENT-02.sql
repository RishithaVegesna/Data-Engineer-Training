create database travel;
use travel;
-- CREATING TABLES
CREATE TABLE Destinations (
  destination_id INT PRIMARY KEY,
  city VARCHAR(50),
  country VARCHAR(50),
  category VARCHAR(30), -- Beach, Historical, Adventure, Nature
  avg_cost_per_day INT
);

CREATE TABLE Trips (
  trip_id INT PRIMARY KEY,
  destination_id INT,
  traveler_name VARCHAR(50),
  start_date DATE,
  end_date DATE,
  budget INT,
  FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id)
);
-- INSERTING DATA
INSERT INTO Destinations VALUES
(1, 'Goa', 'India', 'Beach', 2500),
(2, 'Jaipur', 'India', 'Historical', 1800),
(3, 'Paris', 'France', 'Historical', 4000),
(4, 'Bali', 'Indonesia', 'Beach', 3000),
(5, 'Swiss Alps', 'Switzerland', 'Nature', 5000),
(6, 'New York', 'USA', 'Adventure', 4500);

INSERT INTO Trips VALUES
(101, 1, 'Rishitha', '2025-02-01', '2025-02-05', 15000),
(102, 2, 'Sudha', '2025-03-10', '2025-03-20', 20000),
(103, 3, 'Savitri', '2025-04-01', '2025-04-05', 25000),
(104, 4, 'Sowmya', '2025-01-10', '2025-01-15', 18000),
(105, 5, 'Bala', '2024-12-20', '2024-12-30', 60000),
(106, 6, 'Sravya', '2022-12-10', '2022-12-20', 55000),
(107, 3, 'Savitri', '2025-05-10', '2025-05-15', 30000),
(108, 2, 'Sudha', '2023-06-01', '2023-06-10', 22000),
(109, 1, 'Rishitha', '2023-07-15', '2023-07-18', 9000),
(110, 4, 'Rukhmini', '2024-10-05', '2024-10-10', 17000),
(111, 1, 'Charitha', '2024-09-01', '2024-09-07', 20000);

--  Queries 
-- 1. Show all trips where the destination is in India
SELECT * FROM Trips
WHERE destination_id IN (SELECT destination_id FROM Destinations WHERE country = 'India'
);

-- 2. Get all destinations where the average cost per day is below 3000
SELECT * FROM Destinations
WHERE avg_cost_per_day < 3000;

-- 3. Calculate and display how many days each trip lasted
SELECT trip_id, traveler_name,DATEDIFF(end_date, start_date) + 1 AS total_days
FROM Trips;

-- 4. List trips that were longer than 7 days
SELECT * FROM Trips
WHERE DATEDIFF(end_date, start_date) + 1 > 7;

-- 5. Show each traveler’s name, destination city, and total trip cost (days × daily cost)
SELECT t.traveler_name, d.city,(DATEDIFF(t.end_date, t.start_date) + 1) * d.avg_cost_per_day AS total_trip_cost
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id;

-- 6. Count how many trips were made to each country
SELECT d.country, COUNT(*) AS number_of_trips
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id
GROUP BY d.country;

-- 7. Show the average trip budget per country
SELECT d.country, AVG(t.budget) AS average_budget
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id
GROUP BY d.country;

-- 8. Find the traveler who took the most trips overall
SELECT traveler_name, COUNT(*) AS trips_taken
FROM Trips
GROUP BY traveler_name
ORDER BY trips_taken DESC
LIMIT 1;

-- 9. Show destinations that haven’t been visited at all
SELECT * FROM Destinations
WHERE destination_id NOT IN (SELECT DISTINCT destination_id FROM Trips
);

-- 10. Find the trip that had the highest cost per day (budget ÷ number of days)
SELECT trip_id, traveler_name,budget / (DATEDIFF(end_date, start_date) + 1) AS cost_per_day
FROM Trips
ORDER BY cost_per_day DESC
LIMIT 1;

-- 11. Update a trip’s budget if it was extended by 3 days
UPDATE Trips
SET budget = budget + (SELECT avg_cost_per_day FROM Destinations
WHERE Destinations.destination_id = Trips.destination_id) * 3
WHERE trip_id = 101;

-- 12. Delete trips that ended before January 1, 2023 (safe-mode friendly)
DELETE FROM Trips
WHERE trip_id IN (
  SELECT trip_id FROM (
  SELECT trip_id FROM Trips
  WHERE end_date < '2023-01-01'
  ) AS temp
);

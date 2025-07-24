create database exercises;
use exercises;
-- CREATING TABLES
CREATE TABLE Exercises (
  exercise_id INT PRIMARY KEY,
  exercise_name VARCHAR(50),
  category VARCHAR(30),
  calories_burn_per_min INT
);

CREATE TABLE WorkoutLog (
  log_id INT PRIMARY KEY,
  exercise_id INT,
  date DATE,
  duration_min INT,
  mood VARCHAR(30),
  FOREIGN KEY (exercise_id) REFERENCES Exercises(exercise_id)
);
-- INSERT EXERCISES 
INSERT INTO Exercises VALUES
(1, 'Running', 'Cardio', 10),
(2, 'Cycling', 'Cardio', 8),
(3, 'Yoga', 'Flexibility', 4),
(4, 'Weight Lifting', 'Strength', 7),
(5, 'Pilates', 'Flexibility', 5),
(6, 'Swimming', 'Cardio', 9);

-- INSERT WORKOUT LOGS 
INSERT INTO WorkoutLog VALUES
(101, 1, '2025-03-05', 40, 'Energized'),
(102, 1, '2025-03-10', 30, 'Tired'),

(103, 2, '2025-03-12', 25, 'Normal'),
(104, 2, '2025-04-01', 45, 'Energized'),
(105, 3, '2025-03-15', 60, 'Tired'),
(106, 3, '2025-04-05', 50, 'Normal'),
(107, 4, '2025-03-20', 35, 'Tired'),
(108, 4, '2025-04-10', 40, 'Energized'),
(109, 5, '2025-03-22', 30, 'Normal'),
(110, 5, '2025-04-12', 20, 'Tired');

-- ADDITIONALLY INSERTING 2 RECORDS FROM FEB 2024 FOR DELETE QUERY

INSERT INTO WorkoutLog VALUES
(201, 1, '2024-02-05', 30, 'Normal'),
(202, 2, '2024-02-10', 45, 'Tired');

-- QUERIES 
-- 1. Show all exercises under the “Cardio” category.
SELECT * FROM Exercises
WHERE category = 'Cardio';

-- 2. Show workouts done in the month of March 2025.
SELECT * FROM WorkoutLog
WHERE MONTH(date) = 3 AND YEAR(date) = 2025;

-- 3. Calculate total calories burned per workout
SELECT w.log_id, w.duration_min, e.calories_burn_per_min,
       (w.duration_min * e.calories_burn_per_min) AS total_calories
FROM WorkoutLog w
JOIN Exercises e ON w.exercise_id = e.exercise_id;

-- 4. Calculate average workout duration per category
SELECT e.category, AVG(w.duration_min) AS avg_duration
FROM WorkoutLog w
JOIN Exercises e ON w.exercise_id = e.exercise_id
GROUP BY e.category;

-- 5. List exercise name, date, duration, and calories burned using a join
SELECT e.exercise_name, w.date, w.duration_min,(w.duration_min * e.calories_burn_per_min) AS calories_burned
FROM WorkoutLog w
JOIN Exercises e ON w.exercise_id = e.exercise_id;

-- 6. Show total calories burned per day
SELECT w.date,SUM(w.duration_min * e.calories_burn_per_min) AS total_calories_burned
FROM WorkoutLog w
JOIN Exercises e ON w.exercise_id = e.exercise_id
GROUP BY w.date;

-- 7. Find the exercise that burned the most calories in total
SELECT e.exercise_name,SUM(w.duration_min * e.calories_burn_per_min) AS total_burned
FROM WorkoutLog w
JOIN Exercises e ON w.exercise_id = e.exercise_id
GROUP BY e.exercise_name
ORDER BY total_burned DESC
LIMIT 1;

-- 8. List exercises never logged in the workout log
SELECT * FROM Exercises
WHERE exercise_id NOT IN (SELECT DISTINCT exercise_id FROM WorkoutLog
);

-- 9. Show workouts where mood was “Tired” and duration > 30 mins
SELECT * FROM WorkoutLog
WHERE mood = 'Tired' AND duration_min > 30;

-- 10. Update a workout log to correct a wrongly entered mood (using log_id for safe mode)
UPDATE WorkoutLog
SET mood = 'Normal'
WHERE log_id = 102;

-- 11. Update the calories per minute for “Running” (using exercise_id for safe mode)
UPDATE Exercises
SET calories_burn_per_min = 11
WHERE exercise_id = 1;

-- 12. Delete all logs from February 2024 (using log_id for safe mode)
DELETE FROM WorkoutLog
WHERE log_id IN (201, 202);





 
 
 


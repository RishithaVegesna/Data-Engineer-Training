-- Create and select database
CREATE DATABASE employee;
USE employee;

-- SCHEMA CREATION
-- Table: departments
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

-- Table: employees
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Table: attendance
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    date DATE,
    clock_in TIME,
    clock_out TIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Table: tasks
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    task_name VARCHAR(200),
    task_status VARCHAR(50),
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

--  CRUD OPERATIONS
-- CREATE (Insert values)
-- Insert departments
INSERT INTO departments (department_name) VALUES
('HR'), ('IT'), ('Sales'), ('Marketing'), ('Finance');

-- Insert employees
INSERT INTO employees (name, department_id) VALUES
('Rishitha', 1),
('Anil', 2),
('Sneha', 3),
('Karthik', 2),
('Priya', 4),
('Manoj', 3),
('Meena', 1),
('Varun', 5);

-- Insert multiple attendance records
INSERT INTO attendance (employee_id, date, clock_in, clock_out) VALUES
(1, '2025-07-20', '09:00:00', '17:00:00'),
(1, '2025-07-21', '09:15:00', '17:05:00'),
(2, '2025-07-21', '09:30:00', '16:50:00'),
(3, '2025-07-21', '10:00:00', '17:00:00'),
(4, '2025-07-21', '09:00:00', '17:00:00'),
(5, '2025-07-21', '09:10:00', '17:30:00'),
(6, '2025-07-21', '09:00:00', '16:00:00'),
(7, '2025-07-21', '09:45:00', '18:00:00'),
(8, '2025-07-21', '08:50:00', '17:10:00'),
(1, '2025-07-22', '09:00:00', '16:30:00'),
(2, '2025-07-22', '09:25:00', '17:00:00'),
(3, '2025-07-22', '09:40:00', '17:10:00'),
(4, '2025-07-22', '09:10:00', '16:50:00'),
(5, '2025-07-22', '09:20:00', '17:40:00');

-- Insert multiple tasks
INSERT INTO tasks (employee_id, task_name, task_status, assigned_date, completed_date) VALUES
(1, 'Prepare Report', 'Completed', '2025-07-18', '2025-07-21'),
(2, 'Fix Login Bug', 'In Progress', '2025-07-20', NULL),
(3, 'Sales Presentation', 'Completed', '2025-07-19', '2025-07-21'),
(4, 'Code Review', 'Completed', '2025-07-20', '2025-07-21'),
(5, 'Campaign Strategy', 'In Progress', '2025-07-20', NULL),
(6, 'Client Follow-up', 'Completed', '2025-07-19', '2025-07-21'),
(7, 'Recruitment Drive', 'Completed', '2025-07-18', '2025-07-21'),
(8, 'Budget Review', 'In Progress', '2025-07-20', NULL);

-- READ (Select data)
SELECT * FROM attendance;
SELECT * FROM tasks WHERE employee_id = 1;
SELECT * FROM employees;

-- UPDATE (Modify data)
UPDATE attendance
SET clock_out = '17:30:00'
WHERE employee_id = 1 AND date = '2025-07-21';

UPDATE tasks
SET task_status = 'Completed', completed_date = '2025-07-21'
WHERE task_id = 2;

-- DELETE (Remove data)
DELETE FROM employees WHERE employee_id = 8;
DELETE FROM tasks WHERE task_id = 5;
-- STORED PROCEDURE
DELIMITER $$

CREATE PROCEDURE Get_Total_Work_Hours(IN emp_id INT)
BEGIN
    SELECT 
        employee_id,
        SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(clock_out, clock_in)))) AS total_hours
    FROM attendance
    WHERE employee_id = emp_id
      AND clock_in IS NOT NULL
      AND clock_out IS NOT NULL
    GROUP BY employee_id;
END $$

DELIMITER ;

-- To test:
-- CALL Get_Total_Work_Hours(1);

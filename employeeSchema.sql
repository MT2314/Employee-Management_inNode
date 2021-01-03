CREATE TABLE employee (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT
);
-- After Creating Role and Department Tables
ALTER TABLE employee
ADD FOREIGN KEY(role_id) REFERENCES role(id),
ADD FOREIGN KEY(manager_id) REFERENCES role(id);
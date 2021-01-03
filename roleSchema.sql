CREATE TABLE role (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT
);

ALTER TABLE role
ADD FOREIGN KEY(department_id) REFERENCES department(id);
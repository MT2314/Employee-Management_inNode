CREATE TABLE role (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT
);

ALTER TABLE role
ADD FOREIGN KEY(department_id) REFERENCES department(id);
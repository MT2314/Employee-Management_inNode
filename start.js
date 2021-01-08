const mysql = require(`mysql`);
const inquirer = require('inquirer');
const cTable = require('console.table');
var asciify = require('asciify-image');

var options = {
    fit: 'box',
    width: 200,
    height: 20
}

asciify('Assets/EMS.jpg', options, function (err, asciified) {
    if (err) throw err;

    // Print to console
    console.log(asciified);
    // Connection to MySql

    connection.connect((err, res) => {
        if (err) throw err;
        console.log(`Connected to Employee Database`)
        // resetAutoIncrement('role');
        start();
    });
});

const connection = mysql.createConnection(
    {
        host: `localhost`,
        port: `3306`,
        user: `root`,
        password: `mikeServer1!`,
        database: `employee_managementDB`

    }
);


const resetAutoIncrement = (table) => {
    connection.query(
        `SELECT MAX(id) FROM ${table}`,
        ((err, res) => {
            if (err) throw err;
            let maxarr = Object.values(res[0]);
            let max;
            if (maxarr[0]) {
                max = maxarr[0];
            }
            else {
                max = 0;
            }
            connection.query(
                `ALTER TABLE ${table} AUTO_INCREMENT = ${max}`,
                ((err) => {
                    if (err) throw err;
                })
            )
        })
    );
};

const start = () => {
    console.log(`Welcome to your Employee Management System!`);

    inquirer.prompt([
        {
            type: `list`,
            name: `action`,
            message: `What would you like to do?`,
            choices: [
                `Add a new department`,
                `Add a new role`,
                `Add a new employee`,
                `View all the existing departments`,
                `View all the existing roles`,
                `View all the existing employees`,
                `Update existing employee's role`
            ]
        }
    ])
        .then((user) => {
            if (user.action == `Add a new department`) {
                newDepartment();
            }
            else if (user.action == `Add a new role`) {
                newRole();
            }
            else if (user.action == `Add a new employee`) {
                newEmployee();
            }
            else if (user.action == `View all the existing departments`) {
                viewDepartments();
            }
            else if (user.action == `View all the existing roles`) {
                viewRoles();
            }
            else if (user.action == `View all the existing employees`) {
                viewEmployees();
            }
            else if (user.action == `Update existing employee's role`) {
                updateEmployeeRole()
            }
            else {
                console.log('none');
            }
        })
};

// Add New Department
const newDepartment = () => {
    resetAutoIncrement("department");
    inquirer.prompt(
        {
            type: `input`,
            name: `name`,
            message: `What is the name of the new department?`,
            validate(value) {
                if (value.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    )
        .then((user) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    name: user.name
                }
                ,
                ((err) => {
                    if (err) throw err;
                    console.log(`${user.name} has been added successfully!`)
                    start();
                }))
        })
};

// Add New Role
const newRole = () => {
    resetAutoIncrement("role");
    inquirer.prompt([
        {
            type: `input`,
            name: `title`,
            message: `What is the title of the new role?`,
            validate(value) {
                if (value.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: `input`,
            name: `salary`,
            message: `What is the salary of the new role?`
        },
        {
            type: `input`,
            name: `id`,
            message: `What is the corresponding department id?`
        }
    ])
        .then((user) => {
            connection.query(
                `INSERT INTO role SET ?`,
                {
                    title: user.title,
                    salary: user.salary || null,
                    department_id: user.id || null,
                }
                ,
                ((err) => {
                    if (err) {
                        console.log(`There was an error, check if the selected department id exists`)
                        start();
                    }
                    else {
                        console.log(`${user.title} has been added successfully!`)
                        start();
                    }
                }))
        })
};
// Add New Employee
const newEmployee = () => {
    resetAutoIncrement("employee");
    inquirer.prompt([
        {
            type: `input`,
            name: `firstName`,
            message: `What is the employee's First Name?`
        },
        {
            type: `input`,
            name: `lastName`,
            message: `What is the employee's Last Name?`
        },
        {
            type: `input`,
            name: `role_id`,
            message: `What is the corresponding role id?`
        },
        {
            type: `input`,
            name: `manager_id`,
            message: `What is the corresponding manager id if it exists?`
        }
    ])
        .then((user) => {
            connection.query(
                `INSERT INTO employee SET ?`,
                {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    role_id: user.role_id || null,
                    manager_id: user.manager_id || null

                }
                ,
                ((err) => {
                    if (err) {
                        console.log(`There was an error, check if the selected corresponding id's exist`)
                        throw err;
                        start();
                    }
                    else {
                        console.log(`${user.firstName} ${user.lastName} has been added successfully!`)
                        start();
                    }
                }))
        })
};
// View All Departments
const viewDepartments = () => {
    connection.query(
        `SELECT * FROM department`,
        ((err, res) => {
            if (err) throw err;
            let departments = [];
            res.forEach((department) => departments.push([department.id, department.name]));
            console.table(['Id', 'Department'], departments);
            start();
        })
    )
};
// View All Roles
const viewRoles = () => {

    connection.query(
        `SELECT * FROM role`,
        ((err, res) => {
            if (err) throw err;
            let roles = [];
            res.forEach((role) => roles.push([role.id, role.title, role.salary]));
            console.table(['Id', 'Role', 'Salary'], roles);
            start();
        })
    )
};
// View All Employees
const viewEmployees = () => {
    connection.query(
        `SELECT employee.id AS ID, CONCAT(employee.first_name, ' ', employee.last_name) AS Employee, role.title AS Title,
        CONCAT(M.first_name, ' ' ,  M.last_name) AS Manager, department.name AS Department, role.salary AS Salary
        FROM employee
        LEFT OUTER JOIN role ON (employee.role_id = role.id)
        LEFT OUTER JOIN department ON (role.department_id = department.id)
        LEFT OUTER JOIN employee M ON (employee.manager_id = M.id)`,
        ((err, res) => {
            if (err) throw err;
            let employees = [];
            res.forEach((employee) => {
                employees.push([employee.ID, employee.Employee, employee.Title, employee.Manager, employee.Department, employee.Salary]);
            });
            console.table(['Id', 'Employee Name', 'Role', 'Managers', 'Department', 'Salary'], employees);
            start();
        })
    )
};

const updateEmployeeRole = () => {
    let employees = [];
    connection.query(
        `SELECT * FROM employee`,
        ((err, res) => {
            if (err) throw err;
            res.forEach((employee) => employees.push(`${employee.first_name} ${employee.last_name}`));
            inquirer.prompt([

                {
                    type: `list`,
                    name: `employee`,
                    choices: employees,
                    message: `Which employee's role do you want to change?`
                }
            ])
                .then((user) => {
                    let roles = [];
                    let employee = user.employee.split(" ");
                    console.log(employee);
                    connection.query(
                        `SELECT title FROM role`,
                        ((err, res) => {
                            if (err) throw err;
                            res.forEach((role) => roles.push(role.title));
                            inquirer.prompt([

                                {
                                    type: `list`,
                                    name: `title`,
                                    choices: roles,
                                    message: `What is the employees new role?`
                                }
                            ])
                                .then((user) => {
                                    connection.query(
                                        ` UPDATE employee e
                                        INNER JOIN role r
                                        ON r.title = "${user.title}"
                                        SET e.role_id = r.id
                                        WHERE e.first_name = "${employee[0]}" AND e.last_name = "${employee[1]}" `,
                                        ((err) => {
                                            if (err) throw err;
                                            console.log(`The employee's role has been updated`)
                                            start();
                                        })

                                    )
                                });
                        }));
                });
        })
    )
};



const mysql = require(`mysql`);
const inquirer = require('inquirer');

// MySql Connection Information
const connection = mysql.createConnection(
    {
        host: `localhost`,
        port: `3306`,
        user:`root`,
        password:`mikeServer1!`,
        database: `employee_managementDB`

    }
);

const resetAutoIncrement = (table) => {
    connection.query(
    `SELECT MAX(id) FROM ${table}`,
    ((err,res) => {
        if(err) throw err;
        let maxarr = Object.values(res[0]);
        let max;
        if(maxarr[0]){
            max = maxarr[0];
        }
        else{
            max = 0;
        }
        connection.query(
            `ALTER TABLE ${table} AUTO_INCREMENT = ${max}`,
            ((err) => {
                if(err) throw err;
                console.log(`Successfully reset id`);
            })
        )
    }) 
    );
};

const start = () => {
    console.log(`Welcome to your Employee Management System!`);

    inquirer.prompt([
        {
            type:`list`,
            name:`action`,
            message:`What would you like to do?`,
            choices:[
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
        if(user.action == `Add a new department`){
            newDepartment();
        }
        else if(user.action == `Add a new role`){
            newRole();
        }
        else if(user.action == `Add a new employee`){
            newEmployee();
        }
        else if(user.action == `View all the existing departments`){
            
        }
        else if(user.action == `View all the existing role`){
            
        }
        else if(user.action == `View all the existing employees`){
            
        }
        else if(user.action == `Update existing employee's role`){
            
        }
        else{
            console.log('none');
        }
    })
};

// Add New Department
const newDepartment = () => {
    inquirer.prompt(
        {
            type: `input`,
            name: `name`,
            message:`What is the name of the new department?`
        }
    )
    .then((user) => {
        connection.query(
            `INSERT INTO department SET ?`,
            {
                name : user.name
            }
        ,
        ((err) => {
            if(err) throw err;
            console.log(`${user.name} has been added successfully!`)
            start();
        }))
    })
};

// Add New Role
const newRole = () => {
    inquirer.prompt([
        {
            type: `input`,
            name: `title`,
            message:`What is the title of the new role?`
        },
        {
            type: `input`,
            name: `salary`,
            message:`What is the salary of the new role?`
        },
        {
            type: `input`,
            name: `id`,
            message:`What is the corresponding department id?`
        }
    ])
    .then((user) => {
        connection.query(
            `INSERT INTO role SET ?`,
            {
                title : user.title,
                salary: user.salary,
                department_id: user.id
            }
        ,
        ((err) => {
            if(err){
                console.log(`There was an error, check if the selected department id exists`)
                start();
            }
            else{
            console.log(`${user.title} has been added successfully!`)
            start();
            }
        }))
    })
};



// Connection to MySql
connection.connect((err,res) =>{
    if(err) throw err;
    console.log(`Connected to Employee Database`)
    // resetAutoIncrement('role');
    start();
});

// Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
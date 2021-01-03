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

const start = () => {
    console.log(`Lets begin`);
};

// Connection to MySql
connection.connect((err,res) =>{
    if(err) throw err;
    console.log(`Connected to Employee Database`)
    start();
});
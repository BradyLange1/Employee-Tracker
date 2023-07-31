const express = require('express')
const inquirer = require('inquirer')
const mysql = require('mysql2')
require('dotenv').config()

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// creates the connection to SQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
},
    console.log(`Connected to the employee_db database.`)
)

const start = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'view all employees by manager', 'view all employees by department', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'update an employees manager', 'delete employee', 'delete department', 'delete role', 'quit']
        }
    ])
    .then((res) => {
        switch (res.start) {
            case 'view all departments':
                viewDepartments()
                break;
            case 'view all roles':
                viewRoles()
                break;
            case 'view all employees':
                viewEmployees()
                break;
            case 'add a department':
                addDepartment()
                break;
            case 'add a role':
                addRole()
                break;
            case 'add an employee':
                addEmployee()
                break;
            case 'update an employee role':
                updateEmployeeRole()
                break;
            case 'update an employees manager':
                updateManager()
                break;
            case 'view all employees by manager':
                viewEmployeesByManager()
                break;
            case 'view all employees by department':
                viewEmployeesByDept()
                break;
            case 'delete employee':
                deleteEmployee()
                break;
            case 'delete department':
                deleteDepartment()
                break;
            case 'delete role':
                deleteRole()
                break;
            case 'quit':
                console.log('Bye!')
                process.exit()
        }
    })
}

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        start()
    })
}

const viewRoles = () => {
    db.query('SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id;', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        start()
    })
}

const viewEmployees = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(mgr_emp.first_name, ' ', mgr_emp.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr_emp ON employee.manager_id = mgr_emp.id;`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        start()
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter new department name: ',
            }
        ])
        .then ((res) => {
            db.query(`INSERT INTO department (name) VALUES ("${res.department}")`, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`Added ${res.department} department to datatbase!`)
                start()
            })
        })
}

const addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter new role title: ',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter new role salary: ',
            },
            {
                type: 'input',
                name: 'depId',
                message: 'Enter new role department id: ',
            },
        ])
        .then ((res) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.title}", "${res.salary}", "${res.depId}")`, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`Added ${res.title} role to datatbase!`)
                start()
            })
        })
}

const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `Enter new employee's first name: `,
            },
            {
                type: 'input',
                name: 'last_name',
                message: `Enter new employee's last name: `,
            },
            {
                type: 'input',
                name: 'role_id',
                message: `Enter new employee's role id: `,
            },
            {
                type: 'input',
                name: 'manager_id',
                message: `Enter new employee's manager id: `,
            },
        ])
        .then ((res) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", "${res.role_id}", "${res.manager_id}")`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log(`Added ${res.first_name} ${res.last_name} to datatbase!`)
                start()
            })
        })
}

const updateEmployeeRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employee',
                message: `Enter the employee's id that you would like to update: `,
            },
            {
                type: 'input',
                name: 'role',
                message: `Enter new role id for selected employee: `,
            },
        ])
        .then ((res) => {
            db.query(`UPDATE employee SET role_id = ${res.role} WHERE id = ${res.employee}`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log(`Updated employee!`)
                start()
            })
        })
}

const updateManager = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employee',
                message: `Enter the employee's id that you would like to update: `,
            },
            {
                type: 'input',
                name: 'manager',
                message: `Enter new manager id for selected employee: `,
            },
        ])
        .then ((res) => {
            db.query(`UPDATE employee SET manager_id = ${res.manager} WHERE id = ${res.employee}`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log(`Updated employee!`)
                start()
            })
        })
}

const viewEmployeesByManager = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'manager',
                message: `Enter the manager's id: `,
            },
        ])
        .then ((res) => {
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(mgr_emp.first_name, ' ', mgr_emp.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr_emp ON employee.manager_id = mgr_emp.id WHERE employee.manager_id = ${res.manager}`, (err, result) =>{ 
                if (err) {
                    console.log(err)
                }
                console.table(result)
                start()
            })
        })
}

const viewEmployeesByDept = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept',
                message: `Enter the department's id: `,
            },
        ])
        .then ((res) => {
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(mgr_emp.first_name, ' ', mgr_emp.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee mgr_emp ON employee.manager_id = mgr_emp.id WHERE role.department_id = ${res.dept}`, (err, result) =>{ 
                if (err) {
                    console.log(err)
                }
                console.table(result)
                start()
            })
        })
}

const deleteEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employee',
                message: `Enter the employee id you would like to delete: `,
            },
        ])
        .then ((res) => {
            db.query(`DELETE FROM employee WHERE id = ${res.employee}`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log('Deleted employee!')
                start()
            })
        })
}

const deleteDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept',
                message: `Enter the departments id you would like to delete: `,
            },
        ])
        .then ((res) => {
            db.query(`DELETE FROM department WHERE id = ${res.dept}`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log('Deleted department!')
                start()
            })
        })
}

const deleteRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: `Enter the role id you would like to delete: `,
            },
        ])
        .then ((res) => {
            db.query(`DELETE FROM role WHERE id = ${res.role}`, (err) =>{ 
                if (err) {
                    console.log(err)
                }
                console.log('Deleted role!')
                start()
            })
        })
}

start()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
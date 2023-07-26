const inquirer = require('inquirer')
const mysql = require('mysql2')
require('dotenv').config()

// creates the connection to SQL database
const connection = mysql.createConnection({
    host: '',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: ''
})
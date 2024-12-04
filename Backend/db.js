require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

const pool = mysql.createPool({
    connectionLimit: 10, 
    port: 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});


app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connection pool established successfully!");
        connection.release(); 
    }
});

module.exports = pool;


const express = require('express');
const mysql = require('mysql');
const app = express();


const db = mysql.createConnection({
    port:3306,
    host: 'localhost',     
    database: 'job_portal', 
    user: 'root',           
    password: 'root'         
});

// Corrected app.listen
app.listen(3000, () => {
    console.log("listening");
});

// executing connection
db.connect(function(err) {
    if (err) {
        console.log("error occurred while connecting:", err );
    } else {
        console.log("connection created with mysql successfully");
    //     var sql="INSERT INTO USERS (user_id,username,password,email,phone_no,registeration_date) VALUES ?";
    //     var values=[
    //         ['k1234','abc','9988','abc@gmail.com','21325645','24-9-2024']
    //     ]
    //     connection.query(sql,[values],function(err,result)
    //     {
    //         if (err) {
    //             console.error("Error inserting record:", err.sqlMessage);
    //             return;
    //         }
    //         console.log("Record inserted: " + result.affectedRows);
    //     })
     }
});

module.exports = db;


// const express = require('express');
// const { Pool } = require('pg');
// const app = express();

// // Configuration for Neon SQL connection
// const db = new Pool({
//     user: '<your-username>',        
//     host: '<your-neon-host>',       
//     database: '<your-database>',    
//     password: '<your-password>',    
//     port: 5432,                     
//     ssl: {
//         rejectUnauthorized: false,  // For secure connections
//     },
// });

// // Test the connection
// db.connect((err, client, release) => {
//     if (err) {
//         console.error('Error connecting to Neon SQL:', err.stack);
//     } else {
//         console.log('Connected to Neon SQL successfully');
//         release();
//     }
// });

// // Corrected app.listen
// app.listen(3000, () => {
//     console.log('Server is listening on port 3000');
// });

// module.exports = db;

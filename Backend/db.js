const express = require('express');
const mysql = require('mysql');
const app = express();

// configurations for creating mysql connection
const db = mysql.createConnection({
    port:3306,
    host: 'localhost',     // host for connection
    database: 'mydb', // database from which we want to connect our node application
    user: 'root',           // username of the mysql connection
    password: ''            // password of the mysql connection
});

// Corrected app.listen
app.listen(3000, () => {
    console.log("listening");
});

// executing connection
db.connect(function(err) {
    if (err) {
        console.log("error occurred while connecting");
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
// Function to insert data into all entities
// function insertData() {
//     connection.beginTransaction((err) => {
//         if (err) throw err;

//         // 1. Insert data into `users`
//         const usersSql = "INSERT INTO users (user_id, username, password, email, phone_no, registeration_date) VALUES ?";
//         const usersValues = [
//             [1, 'john_doe', 'password123', 'john.doe@example.com', '1234567890', '2024-11-15']
//         ];

//         connection.query(usersSql, [usersValues], (err, result) => {
//             if (err) return rollbackTransaction(err, "Users");
//             console.log("Inserted into `Users`.");

//             // 2. Insert data into `roles`
//             const rolesSql = "INSERT INTO role (user_id, role_type) VALUES ?";
//             const rolesValues = [
//                 [1, 'job_seeker']
//             ];

//             connection.query(rolesSql, [rolesValues], (err, result) => {
//                 if (err) return rollbackTransaction(err, "Roles");
//                 console.log("Inserted into `Roles`.");

//                 // 3. Insert data into `profiles`
//                 const profilesSql = "INSERT INTO profile (profile_id, user_id, skills, expirience, education, certifications) VALUES ?";
//                 const profilesValues = [
//                     [1, 1, 'JavaScript, Node.js, SQL', '3 years', 'Bachelor in CS', 'Certified Node.js Developer']
//                 ];

//                 connection.query(profilesSql, [profilesValues], (err, result) => {
//                     if (err) return rollbackTransaction(err, "Profiles");
//                     console.log("Inserted into `Profiles`.");

//                     // 4. Insert data into `employers`
//                     const employersSql = "INSERT INTO employers (employers_id, employer_name, company_name, company_description, contact_info) VALUES ?";
//                     const employersValues = [
//                         [1, 'TechCorp', 'TechCorp Ltd.', 'Leading IT company', 'info@techcorp.com']
//                     ];

//                     connection.query(employersSql, [employersValues], (err, result) => {
//                         if (err) return rollbackTransaction(err, "Employers");
//                         console.log("Inserted into `Employers`.");

//                         // 5. Insert data into `job_categories`
//                         const categoriesSql = "INSERT INTO job_categories (category_id, category_name, description) VALUES ?";
//                         const categoriesValues = [
//                             [1, 'Software Development', 'Jobs in software development.']
//                         ];

//                         connection.query(categoriesSql, [categoriesValues], (err, result) => {
//                             if (err) return rollbackTransaction(err, "Job Categories");
//                             console.log("Inserted into `Job Categories`.");

//                             // 6. Insert data into `job_listings`
//                             const listingsSql = "INSERT INTO job_listing (job_id, title, description, requirement, salary, location_id, posting_date, employer_id, status) VALUES ?";
//                             const listingsValues = [
//                                 [1, 'Full Stack Developer', 'Develop web applications.', 'React, Node.js', 80000, 1, '2024-11-15', 1, 'active']
//                             ];

//                             connection.query(listingsSql, [listingsValues], (err, result) => {
//                                 if (err) return rollbackTransaction(err, "Job Listings");
//                                 console.log("Inserted into `Job Listings`.");

//                                 // 7. Insert data into `locations`
//                                 const locationsSql = "INSERT INTO locations (location_id, loaction_name, country, state, city) VALUES ?";
//                                 const locationsValues = [
//                                     [1, 'Office A', 'USA', 'California', 'San Francisco']
//                                 ];

//                                 connection.query(locationsSql, [locationsValues], (err, result) => {
//                                     if (err) return rollbackTransaction(err, "Locations");
//                                     console.log("Inserted into `Locations`.");

//                                     // 8. Insert data into `applications`
//                                     const applicationsSql = "INSERT INTO application (application_id, job_id, user_id, status, application_date) VALUES ?";
//                                     const applicationsValues = [
//                                         [1, 1, 1, 'applied', '2024-11-15']
//                                     ];

//                                     connection.query(applicationsSql, [applicationsValues], (err, result) => {
//                                         if (err) return rollbackTransaction(err, "Applications");
//                                         console.log("Inserted into `Applications`.");

//                                         // 9. Insert data into `interview`
//                                         const interviewsSql = "INSERT INTO interview (interview_id, application_id, interview_date, interview_type, interviewer_id, status) VALUES ?";
//                                         const interviewsValues = [
//                                             [1, 1, '2024-11-20', 'online', 2, 'scheduled']
//                                         ];

//                                         connection.query(interviewsSql, [interviewsValues], (err, result) => {
//                                             if (err) return rollbackTransaction(err, "Interview");
//                                             console.log("Inserted into `Interview`.");

//                                             // 10. Insert data into `feedback`
//                                             const feedbackSql = "INSERT INTO feedback (feedback_id, user_id, review, rating) VALUES ?";
//                                             const feedbackValues = [
//                                                 [1, 1, 'Great platform!', 5]
//                                             ];

//                                             connection.query(feedbackSql, [feedbackValues], (err, result) => {
//                                                 if (err) return rollbackTransaction(err, "Feedback");
//                                                 console.log("Inserted into `Feedback`.");

//                                                 // Commit the transaction after all inserts
//                                                 connection.commit((err) => {
//                                                     if (err) return rollbackTransaction(err, "Commit");
//                                                     console.log("Transaction committed successfully!");
//                                                     connection.end();
//                                                 });
//                                             });
//                                         });
//                                     });
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         });
//     });
// }
// // Function to handle transaction rollback
// function rollbackTransaction(err, table) {
//     console.error(`Error inserting into ${table}:`, err.message);
//     connection.rollback(() => {
//         console.error("Transaction rolled back.");
//         connection.end();
//     });
// }
// insertData();
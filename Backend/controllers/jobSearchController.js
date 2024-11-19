// jobSearchController.js
const db = require('../db');  // Your MySQL connection
const express = require('express');

// Function to handle job search requests
const searchJobs = (req, res) => {
  const { company_name, min_salary, max_salary, location, job_title } = req.query;
  
  // Base query
  let query = `
    SELECT Jobs.job_id, Jobs.title, Jobs.description, Jobs.salary, 
           Companies.name AS company_name, Locations.city, Locations.state
    FROM Jobs
    JOIN Companies ON Jobs.company_id = Companies.company_id
    JOIN Locations ON Jobs.location_id = Locations.location_id
    WHERE 1=1
  `;
  
  const params = [];

  // Add filters if they are provided
  if (company_name) {
    query += ' AND Companies.name = ?';
    params.push(company_name);
  }
  if (min_salary && max_salary) {
    query += ' AND Jobs.salary BETWEEN ? AND ?';
    params.push(min_salary, max_salary);
  }
  if (location) {
    query += ' AND Locations.city = ?';
    params.push(location);
  }
  if (job_title) {
    query += ' AND Jobs.title LIKE ?';
    params.push(`%${job_title}%`);
  }

  // Execute the query
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
};

module.exports = { searchJobs };

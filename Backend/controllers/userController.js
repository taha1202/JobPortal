const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Signup function
const signup = (req, res) => {
  const { first_name, email, password,phone_number, role_id,last_name } = req.body;
  console.log('Signup request body:', req.body); // Log the incoming data

  // Check if email already exists
  db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Error hashing password' });
      }

      // Insert the new user into the database
      db.query('INSERT INTO users (first_name, email, password, phone_number, registration_date, role_id, last_name) VALUES (?, ?, ?, ?,NOW(), ?, ?)',
      [first_name, email, hashedPassword, phone_number,role_id,last_name],
        (err, results) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ error: 'Error inserting user into database' });
          }
          console.log("Resuls = " , results);
          const user = { user_id: results.insertId, role_id: role_id,first_name:first_name}; // Use the inserted user's ID
          const token = jwt.sign(user, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' }); 
          console.log(token);
          res.status(201).json({ message: 'User Registered Successfully',token, Uname:first_name, role_id: role_id, });
        }
      );
    });
  });
};

// module.exports = { signup };

// controllers/userController.js
const login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length === 0) {
      
      return res.status(400).json({ message: 'User not found' });
    }
    console.log(results);
    const user = results[0];
    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(
          { user_id: user.user_id, role_id: user.role_id, first_name: user.first_name }, // Payload
          process.env.JWT_SECRET || 'fallback-secret', // Secret key (you can store it in an env variable)
          { expiresIn: '1d' } // Token expiration time (1 hour)
        );
        // // Store user session
        // console.log('Session:', req.session);
        // req.session.user = { user_id: user.user_id, role_id: user.role_id };
        // console.log('Session:', req.session);
        console.log(token);
        res.status(200).json({ message: 'Login successful', token, Uname: user.first_name, role_id: user.role_id});
      } else {
        
        res.status(400).json({ message: 'Invalid Password' });
      }
    });
  });
};




// controllers/userController.js
// const db = require('../db');

// Resume upload function
const uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumePath = req.file.path;
  const userId = req.body.user_id;  // Assuming user_id is provided

  // Save resume path to the database for the user
  db.query(
    'UPDATE Users SET resume_path = ? WHERE user_id = ?',
    [resumePath, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
      res.status(200).json({ message: 'Resume uploaded successfully', path: resumePath });
    }
  );
};




const fs = require('fs');
const path = require('path');

// Function to handle editing (replacing) resume
const editResume = (req, res) => {
  const userId = req.body.user_id;

  // First, fetch the current resume path from the database
  db.query('SELECT resume_path FROM Users WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldResumePath = results[0].resume_path;

    // Delete the old resume file if it exists
    if (oldResumePath && fs.existsSync(oldResumePath)) {
      fs.unlinkSync(oldResumePath);
    }

    // Save the new resume file
    const newResumePath = req.file.path;

    // Update the new resume path in the database
    db.query(
      'UPDATE Users SET resume_path = ? WHERE user_id = ?',
      [newResumePath, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating resume in database' });
        }
        res.status(200).json({ message: 'Resume updated successfully', path: newResumePath });
      }
    );
  });
};


const uploadImages = (req, res) => {
  console.log("File = ");
  console.log(req.file); 

  if (!req.file) {
    console.error("No file");
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = req.file.path;
  res.status(200).json({ message: 'Image uploaded successfully', url: imagePath });
};


module.exports = {
  signup,
  login,
  uploadResume,
  editResume,
  uploadImages
};

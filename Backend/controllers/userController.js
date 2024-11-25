const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const signup = (req, res) => {
  const { first_name, email, password,phone_number, role_id,last_name } = req.body;
  // console.log('Signup request body:', req.body); 

  
  db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Error hashing password' });
      }

      db.query('INSERT INTO users (first_name, email, password, phone_number, registration_date, role_id, last_name) VALUES (?, ?, ?, ?,NOW(), ?, ?)',
      [first_name, email, hashedPassword, phone_number,role_id,last_name],
        (err, results) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ error: 'Error inserting user into database' });
          }
          const user = { user_id: results.insertId, role_id: role_id,first_name:first_name};
          const token = jwt.sign(user, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' }); 
          console.log(token);
          db.query(`INSERT INTO profiles (user_id) VALUES (?)`,[results.insertId],(err,result)=>{
            if(err) {
              console.error(err);
              return res.status(500).json({ error: 'Error inserting profile into database' }); 
            }
          });
          res.status(201).json({ message: 'User Registered Successfully',token, Uname:first_name, role_id: role_id, });
        }
      );
    });
  });
};

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


const uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumePath = req.file.path;
  console.log("Resume Path: ",resumePath);
  res.status(200).json({ message: 'Resume uploaded successfully', url: resumePath });
};


const uploadImages = (req, res) => {

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
  uploadImages
};

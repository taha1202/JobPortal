require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const signup = (req, res) => {
  const { first_name, email, password,phone_number, role_id,last_name } = req.body;

  
  db.query('SELECT email FROM Users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (!results || results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Error hashing password' });
      }

      db.query('INSERT INTO Users (first_name, email, password, phone_number, registration_date, role_id, last_name) VALUES (?, ?, ?, ?,NOW(), ?, ?)',
      [first_name, email, hashedPassword, phone_number,role_id,last_name],
        (err, results) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ error: 'Error inserting user into database' });
          }
          const user = { user_id: results.insertId, role_id: role_id,first_name:first_name};
          const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' }); 
          console.log(token);
          db.query(`INSERT INTO profiles (user_id) VALUES (?)`,[results.insertId],(err,result)=>{
            if(err) {
              console.error(err);
              return res.status(500).json({ error: 'Error inserting profile into database' }); 
            }
          });
          res.status(201).json({ message: 'User Registered Successfully',token, Uname:first_name, role_id: role_id,user_id: results.insertId});
        }
      );
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
    if (results <= 0) {
      
      return res.status(400).json({ message: 'User not found' });
    }
    console.log(results);
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(
          { user_id: user.user_id, role_id: user.role_id, first_name: user.first_name }, 
          process.env.JWT_SECRET,{ expiresIn: '1d' } );
        console.log(token);
        res.status(200).json({ message: 'Login successful', token, Uname: user.first_name, role_id: user.role_id,user_id: user.user_id});
      } 
      else {
        
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

  console.log('File:', req.file);
  console.log('Body:', req.body);

  if (!req.file) {
    console.error("No file");
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = req.file.path;
  res.status(200).json({ message: 'Image uploaded successfully', url: imagePath });
};


const GiveFeedBack = async (req, res) => {
  const { user_id } = req.user;
  try {
    
    console.log(user_id);
    const { rating, feedback_text, feedback_type,isAnonymous } = req.body;
    let sql;
    
    sql = `INSERT INTO feedback (user_id, rating, comments, created_at,feedback_type,is_anonymous) 
          VALUES (?,?,?,NOW(),?, ?)`;

    db.query(sql, [user_id,rating,feedback_text,feedback_type,isAnonymous], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Unable to Submit Feedback. Please Try Again Later.",
        });
      }
      res.status(200).send({
        success: true,
        message: "Feedback Submitted Successfully",
        jobs: result,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Submitting Feedback",
      error,
    });
  }
};

const Getfeedback = async (req, res) => {
  try {
    const { user_id } = req.user;
    let sql = `SELECT F.comment, U.first_name,U.last_name FROM feedback F JOIN 
      Users C ON F.user_id = U.user_id 
      where F.rating >=  4`;

    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Posted Job Details",
        jobs: result,
      });
    });
  }
   catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting posted job details API",
      error,
    });
  }
};

module.exports = {
  signup,
  login,
  uploadResume,
  uploadImages,
  GiveFeedBack,
  Getfeedback
};

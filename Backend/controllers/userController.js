require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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


const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    db.query("SELECT * FROM Users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Error finding email:", err);
        return res.status(500).json({ error: "Error finding email" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user_id = results[0].user_id;

      const tempPassword = crypto.randomBytes(6).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      db.query(
        "UPDATE Users SET password = ? WHERE user_id = ?",
        [hashedPassword, user_id],
        async (err) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ message: "Error updating password" });
          }

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "tahaghulam10@gmail.com", 
              pass: "kyri kqzi mryo tkbb", 
            },
          });

          const mailOptions = {
            from: "tahaghulam10@gmail.com",
            to: email,
            subject: "Password Reset Request",
            text: `Hello, 

We have received a request to reset your password. Your temporary password is: ${tempPassword}

Please log in using this temporary password and reset it immediately.

Thank you!`,
          };

          try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Temporary password sent to your email" });
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            res.status(500).json({ message: "Failed to send the temporary password email" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};





module.exports = {signup,login,ForgotPassword};

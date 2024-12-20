const db = require("../db");
const bcrypt = require('bcrypt');

const getprofile = async (req, res) => {
  const { user_id } = req.user;
 
  try {
    let sql = "SELECT * FROM profiles WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      if (result.length === 0) {
        sql = "INSERT INTO profiles (user_id) VALUES (?)";
        db.query(sql, [user_id], (err, result) => {
          if (err) {
            return res.status(404).send({
              success: false,
              message: "Profile Incomplete. Please filled the details",
            });
          }
          return res.status(404).send({
            success: false,
            message: "Profile Incomplete. Please filled the details",
          });
        });
      } else {
        const profile = result[0];
        console.log(profile);
        const hasNull = Object.entries(profile).some(
          ([key, value]) => value === null && key !== 'notes'
        );
        if (hasNull) {
          return res.status(404).send({
            success: false,
            message: "Profile Incomplete. Please fill in the details.",
          });
        }

        res.status(200).send({
          success: true,
          message: "Profile Details",
          profile,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get Profile API",
      error,
    });
  }
};

const viewProfile = async (req, res) => {
  const { user_id } = req.user;

  try {
    let sql = "SELECT * FROM profiles WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      if (result.length === 0 && user_id) {
        sql = "INSERT INTO profiles (user_id) VALUES (?)";
        db.query(sql, [user_id], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(404).send({
              success: false,
              message: "Profile Not Found",
            });
          }
        });
      }
      sql = `SELECT U.first_name, U.last_name, P.skills, P.experience,P.education,
          P.resume, P.profile_pic FROM profiles P
          JOIN Users U on P.user_id = U.user_id WHERE P.user_id = ?`;
      db.query(sql, [user_id], (err, result) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        if (result.length === 0) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "Profile Details",
          profile: result[0],
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Profile API",
      error,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { skills, experience, education, resume, profile_pic,first_name,last_name } = req.body;
    console.log("Values in backend: ",skills, experience, education, resume, profile_pic);
    let sql = `UPDATE profiles SET skills = ?, experience = ?, education = ?, resume = ?, 
    profile_pic = ? WHERE user_id = ?`;
    db.query(sql, [skills, experience, education, resume, profile_pic,user_id],(err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Error In Updating Data",
        });
      }
      sql = `UPDATE Users SET first_name = ?, last_name = ? WHERE user_id = ?`
      db.query(sql, [first_name, last_name,user_id],(err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({
            success: false,
            message: "Error In Updating Data",
          });
        }
      });
      res.status(200).send({
        success: true,
        message: "Profile Details Updated",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Edit Profile API",
      error,
    });
  }
};


const applicantProfile = async (req, res) => {
  const { id } = req.params;
  try {
      let sql = `SELECT U.first_name, U.last_name, P.skills, P.experience,P.education,
      P.resume, P.profile_pic FROM profiles P
      JOIN Users U on P.user_id = U.user_id WHERE P.user_id = ?`;
      db.query(sql, [id], (err, result) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        if (result.length === 0) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "Profile Details",
          profile: result[0],
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Profile API",
      error,
    });
  }
};

const viewEmployerProfile = async (req, res) => {
  const { user_id } = req.user;

  try {
    let sql = "SELECT * FROM profiles WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      if (result.length === 0 && user_id) {
        sql = "INSERT INTO profiles (user_id) VALUES (?)";
        db.query(sql, [user_id], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(404).send({
              success: false,
              message: "Profile Not Found",
            });
          }
        });
      }
      sql = `SELECT U.first_name, U.last_name, P.notes,P.profile_pic,Count(A.application_id) as totalApplication,
          Count(J.job_id) as active_jobs FROM profiles P
          JOIN Users U on P.user_id = U.user_id 
          JOIN employers C on P.user_id = C.employer_id
          JOIN job_listings J on C.company_id = J.company_id
          JOIN applications A on J.job_id = A.job_id
          WHERE P.user_id = ? AND J.status = 'active'
          group by U.first_name, U.last_name, P.notes, P.profile_pic`;

      db.query(sql, [user_id], (err, result) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        if (result.length === 0) {
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "Profile Details",
          profile: result[0],
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Profile API",
      error,
    });
  }
};

const editEmployerProfile = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { add_notes,first_name,last_name,profile_pic,notes } = req.body;
    let sql = `UPDATE profiles SET notes = ?, profile_pic = ?, notes = ? WHERE user_id = ?`;
    db.query(sql, [add_notes,profile_pic,notes,user_id],(err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Error In Updating Data",
        });
      }
      sql = `UPDATE Users SET first_name = ?, last_name = ? WHERE user_id = ?`
      db.query(sql, [first_name, last_name,user_id],(err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({
            success: false,
            message: "Error In Updating Data",
          });
        }
      });
      res.status(200).send({
        success: true,
        message: "Profile Details Updated",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Edit Profile API",
      error,
    });
  }
};

const UpdatePassword = (req, res) => {
  const {user_id} = req.user
  const { oldPass, newPass } = req.body;
  console.log(oldPass,newPass);
  db.query('SELECT * FROM Users WHERE user_id = ?', [user_id], (err, results) => {
    if (results <= 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    console.log(results);
    const user = results[0];
    bcrypt.compare(oldPass, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        bcrypt.hash(newPass, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
          }
         let sql = `Update Users SET password = ? where user_id = ?`;
         db.query(sql, [hashedPassword,user_id],(err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send({
                success: false,
                message: "Error In Changing Password",
              });
            }
          });
        });
        res.status(200).json({ success: true, message: 'Password Changed successful'});
      } 
      else {
        res.status(400).json({ message: 'Invalid Old Password' });
      }
    });
  });
};

module.exports = { getprofile, viewProfile, editProfile,applicantProfile,editEmployerProfile,viewEmployerProfile,UpdatePassword};

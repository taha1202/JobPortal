const db = require("../db");

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
        const hasNull = Object.values(profile).some((value) => value === null);
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
    const { skills, experience, education, resume, profile_pic } = req.body;
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
      db.query(sql, [add_notes,user_id],(err, result) => {
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
      sql = `SELECT U.first_name, U.last_name, P.notes,Count(A.application_id) as totalApplication,
          Count(J.job_id) as active_jobs FROM profiles P
          JOIN Users U on P.user_id = U.user_id 
          JOIN employers C on P.user_id = C.employer_id
          JOIN job_listings J on C.company_id = J.company_id
          JOIN applications A on J.job_id = A.job_id
          WHERE P.user_id = ? AND J.status = 'active'
          group by U.first_name, U.last_name, P.notes`;

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
    const { add_notes,first_name,last_name } = req.body;
    let sql = `UPDATE profiles SET notes = ? WHERE user_id = ?`;
    db.query(sql, [add_notes,user_id],(err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Error In Updating Data",
        });
      }
      sql = `UPDATE Users SET first_name = ?, last_name = ? WHERE user_id = ?`
      db.query(sql, [add_notes,user_id],(err, result) => {
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

module.exports = { getprofile, viewProfile, editProfile,applicantProfile,editEmployerProfile,viewEmployerProfile};

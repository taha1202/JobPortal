const db = require("../db");

const applyForJob = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.user;
  console.log(user_id);
  try {
    const check = `SELECT * FROM applications WHERE user_id =  ? AND job_id = ?`;
    db.query(check, [user_id, id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Applying",
        });
      }
      if (results.length > 0) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Already Applied For The Job",
        });
      } else {
        const sql = `INSERT INTO applications (job_id, user_id,status,application_date ) VALUES (?, ?,'pending',NOW())`;
        db.query(sql, [id, user_id], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(404).send({
              success: false,
              message: "Error In Applying",
            });
          }
          res.status(200).send({
            success: true,
            message: "Applied For Job",
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Applying For Job",
      error,
    });
  }
};

const AppliedJobs = (req, res) => {
  const { user_id } = req.user;
  try {
    let sql = `SELECT J.title, J.salary, J.status,A.status AS application_status,A.application_date,A.job_id 
    FROM applications A JOIN job_listings J on A.job_id = J.job_id 
    WHERE A.user_id =  ?`;
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Retrieving Applied Jobs",
        });
      }
      if (results.length === 0) {
        return res.status(404).send({
          success: false,
          message: "No Record Found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Applied Jobs",
        jobs: results,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Applied Jobs",
      error,
    });
  }
};

const DeleteAppliedJob = (req, res) => {
  const { user_id } = req.user;
  const { id } = req.params;
  try {
    let sql = `DELETE FROM applications WHERE user_id = ? AND job_id = ?`;
    db.query(sql, [user_id, id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Deleting Applied Job",
        });
      }
      res.status(200).send({
        success: true,
        message: "Application Deleted Successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Deleting Applied Job",
      error,
    });
  }
};


const viewApplications = async (req,res) => {
  const {user_id} = req.user;
  try {
      let query =`SELECT A.application_id,A.application_date,U.first_name,U.last_name,A.user_id,A.status,
                  J.title, C.company_name, JC.category_name FROM applications A
                  JOIN users U on A.user_id = U.user_id
                  JOIN job_listings J on A.job_id = J.job_id
                  JOIN Employers C ON J.company_id = C.company_id
                  JOIN Job_categories JC ON J.category_id = JC.category_id
                  WHERE C.employer_id = ? `; 
      const data = db.query(query,[user_id],(err,result)=>{
          if (err){
              return res.status(404).send({
                  success: false,
                  message: "No Records found",
              });
          }
          res.status(200).send({
              success: true,
              message: "All Application Records",
              value: result,
          });
  });    
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success:false,
          message:'Error in View Applications API',
          error
      })
  }
};

const updateStatus = async (req, res) => {
  try {
    const {status,application_id} = req.body;
    let sql = `UPDATE applications SET status = ? where application_id = ?`
    db.query(sql, [status,application_id],(err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Error In Updating Data",
        });
      }
      res.status(200).send({
        success: true,
        message:"",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating Status API",
      error,
    });
  }
};





module.exports = { applyForJob, AppliedJobs, DeleteAppliedJob,viewApplications,updateStatus };

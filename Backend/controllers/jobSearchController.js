const db = require("../db");
// const express = require('express');

const searchJobs = (req, res) => {

  const { filter, filterval,min_salary,max_salary} = req.query;
  let sql;
  if (filter && filterval) {
    sql = `SELECT J.job_id,J.title,J.description,J.salary,J.posting_date,C.company_name,
       C.company_image,JC.category_name FROM job_listings J join 
       employers C on J.company_id = C.company_id 
       join Job_categories JC on J.category_id = JC.category_id
       join locations L on J.location_id = L.location_id
       WHERE J.status = 'active' `;

    if (filter === "Company") {
      sql += " AND C.company_name = ?";
    }
    if (filter === "Location") {
      sql += " AND L.country = ?";
    }
    if (filter === "Category") {
      sql += " AND JC.category_name = ?";
    }
    db.query(sql, [filterval], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      res.status(200).send({
        success: true,
        message: "All Job Listing Records",
        totaljobs: result.length,
        result,
      });
    });
  }

  else if (min_salary || max_salary) {
    const params = [];
    sql = `SELECT J.job_id,J.title,J.description,J.salary,J.posting_date,C.company_name,
       C.company_image,JC.category_name FROM job_listings J join 
       employers C on J.company_id = C.company_id 
       join Job_categories JC on J.category_id = JC.category_id
       WHERE J.status = 'active' `;

    if(min_salary  && !max_salary)
    {
      sql += `AND J.salary >= ?`
      params.push(parseInt(min_salary, 10));
    }
    else if(!min_salary && max_salary)
    {
      sql += `AND J.salary <= ?`
      params.push(parseInt(max_salary, 10));
    } 
    else{
      sql += `AND (J.salary >= ? AND J.salary  <= ? ) `
      params.push(parseInt(min_salary, 10),parseInt(max_salary, 10));
    }
      db.query(sql, [min_salary, max_salary], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "All Job Listing Records",
          totaljobs: result.length,
          result,
        });
      });
  } 
};

const getJobs = async (req, res) => {
  const { sort,order} = req.query;
  let sql;

  try {
    if (sort && order) {
      sql = `SELECT J.job_id,J.title,J.description,J.salary,J.posting_date,C.company_name,
       C.company_image,JC.category_name FROM job_listings J join 
       employers C on J.company_id = C.company_id 
       join Job_categories JC on J.category_id = JC.category_id
       WHERE J.status = 'active' Order BY J.${sort} ${order}`;
      db.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "All Job Listing Records",
          totaljobs: result.length,
          result,
        });
      });
    } 
    else {
      sql = `SELECT J.job_id,J.title,J.description,J.salary,J.posting_date,C.company_name,
       C.company_image,JC.category_name FROM job_listings J join 
       employers C on J.company_id = C.company_id 
       join Job_categories JC on J.category_id = JC.category_id
       WHERE J.status = 'active' `;
      db.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "All Job Listing Records",
          totaljobs: result.length,
          result,
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Job Listings API",
      error,
    });
  }
};

const viewDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT J.job_id, J.title AS job_title,J.status, J.description AS job_description, J.requirements,
      J.salary,J.posting_date,C.company_name,C.company_description,C.company_image AS picture,
      JC.category_name AS job_category,L.city,L.state,L.country,L.street_name AS street
      FROM job_listings J JOIN 
      employers C ON J.company_id = C.company_id
      JOIN Job_categories JC ON J.category_id = JC.category_id
      JOIN locations L ON J.location_id = L.location_id
      WHERE J.job_id = ?`;

    db.query(sql, id, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      if (result.length === 0) {
        return res.status(404).send({
          success: false,
          message: "Job not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Job Details",
        job: result[0],
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Job Listings API",
      error,
    });
  }
};

const viewPostJob = async (req, res) => {
  try {
    const { user_id } = req.user;
    let sql = `SELECT J.job_id, J.title,J.salary,J.status,J.posting_date,C.company_name,
      JC.category_name FROM job_listings J JOIN 
      employers C ON J.company_id = C.company_id
      JOIN Job_categories JC ON J.category_id = JC.category_id
      WHERE C.employer_id = ? `;

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
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting posted job details API",
      error,
    });
  }
};


const GetCategory = async (req, res) => {
  try {
    let sql = `SELECT category_name, category_description from Job_categories
                order by category_name asc`;

    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "No Records found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Category Details",
        category: result,
        pages: result.length,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Categories",
      error,
    });
  }
};



const SaveJobs = async (req, res) => {
  const {user_id } = req.user;
  const {id} = req.params;
  try {
    let sql = `INSERT INTO saved_jobs (user_id,job_id) VALUE (? , ? ) `;

    db.query(sql, [user_id,id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In inserting",
        });
      }
      res.status(200).send({
        success: true,
        message: "Job Saved Successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Inserting Job",
      error,
    });
  }
};


const DeleteJobs = async (req, res) => {
  const {user_id } = req.user;
  const {id} = req.params;
  try {
    let sql = `DELETE FROM saved_jobs where user_id = ? AND job_id = ? `;

    db.query(sql, [user_id,id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Deleting",
        });
      }
      res.status(200).send({
        success: true,
        message: "Job Removed Successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Deleting Job",
      error,
    });
  }
};

const getSavedJobs = async (req,res) =>{
  const { user_id } = req.user;
  try {
    let sql = `SELECT J.title, J.salary, J.status,J.posting_date,S.job_id,JC.category_name 
    FROM saved_jobs S JOIN job_listings J on S.job_id = J.job_id Join 
    Job_categories JC on J.category_id = JC.category_id WHERE S.user_id = ?`;
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Retrieving Saved Jobs.",
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
        message: "Saved Jobs",
        job: results,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Saved Jobs",
      error,
    });
  }
};


const ScheduleInterview = async (req, res) => {
  const {user_id } = req.user;
  const {J_id,A_id} = req.params;
  const {interview} = req.body
  if(!interview || (interview  < new Date())) {
    return res.status(404).send({
      success: false,
      message: "Error In inserting",
    });
  }
  try {
    let sql = `INSERT INTO interviews (employer_id,job_seeker_id,application_id,interview_date,status) 
              VALUE (?, ?, ?, ?,'scheduled' ) `;

    db.query(sql, [user_id,J_id,A_id,interview], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In inserting",
        });
      }
      res.status(200).send({
        success: true,
        message: "Interview Scheduled Successfully.",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Scheduling Interview",
      error,
    });
  }
};


const updatePostJob = async (req, res) => {
  let sql;
  try {
    const {field,update} = req.body;
    console.log(field, update);
    const {id} = req.params;
    if(update === "job_title" && field){
      sql = `UPDATE job_listings SET title = ? WHERE job_id = ?`;
    }
    if(update === "job_description" && field) {
      sql = `UPDATE job_listings SET description = ? WHERE job_id = ?`;
    }

    if((update === "status" || update === "salary" || update === "requirements") && field) {
      sql = `UPDATE job_listings SET ${update} = ? WHERE job_id = ?`;
    }

    else if (field){
      sql = `UPDATE employers SET ${update} = ? 
       WHERE company_id = (SELECT company_id FROM job_listings WHERE job_id = ? )`;
    }
    db.query(sql, [field,id],(err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Error In Updating Data",
        });
      }
      res.status(200).send({
        success: true,
        message:"Job Edited Successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Editing Job API",
      error,
    });
  }
};

const DeletePostJobs = async (req, res) => {
  const {id} = req.params;
  try {
    let sql = `DELETE FROM job_listings where job_id = ? `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In Deleting",
        });
      }
      res.status(200).send({
        success: true,
        message: "Job Removed Successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Deleting Job",
      error,
    });
  }
};

const CheckInterview = async (req, res) => {
  const {user_id } = req.user;
  const {J_id,A_id} = req.params;
  console.log(user_id,J_id,A_id);
  try {
    let sql = `SELECT interview_id FROM interviews WHERE employer_id = ? AND 
           job_seeker_id = ? AND application_id = ? `;

    db.query(sql, [user_id,J_id,A_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In inserting",
        });
      }
      if (result.length <= 0){
        res.status(200).send({
          success: true,
          status: "",
        });
      }
      res.status(200).send({
        success: true,
        status: result[0].status,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Scheduling Interview",
      error,
    });
  }
};

const UpdateInterview = async (req, res) => {
  const {user_id } = req.user;
  const {J_id,A_id} = req.params;
  const {interview} = req.body
  console.log(user_id,J_id,A_id,interview);
  if(!interview || (interview  < new Date())) {
    return res.status(404).send({
      success: false,
      message: "Error In inserting",
    });
  }
  try {
    let sql = `UPDATE interviews SET interview_date = ? WHERE 
            employer_id = ? AND job_seeker_id = ? AND application_id = ? `;

    db.query(sql, [interview,user_id,J_id,A_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).send({
          success: false,
          message: "Error In inserting",
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "No matching interview found to update.",
        });
      }
      res.status(200).send({
        success: true,
        message: "Interview Re-Scheduled Successfully.",
      });
    });
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Scheduling Interview",
      error,
    });
  }
};


module.exports = { searchJobs, getJobs, viewDetails, viewPostJob,DeletePostJobs,UpdateInterview,
                  GetCategory,SaveJobs,DeleteJobs,getSavedJobs,ScheduleInterview,updatePostJob,
                  CheckInterview };

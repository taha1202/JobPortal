const db = require("../db");
// const express = require('express');

const searchJobs = (req, res) => {
  const { filter, filterval,min_salary,max_salary} = req.query;
  let sql;
  if (filter && filterval) {
    sql = `SELECT J.job_id,J.title,J.description,J.salary,J.posting_date,C.company_name,
       C.company_image,JC.category_name FROM job_listings J join 
       Employers C on J.company_id = C.company_id 
       join job_categories JC on J.category_id = JC.category_id
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
       Employers C on J.company_id = C.company_id 
       join job_categories JC on J.category_id = JC.category_id
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
       Employers C on J.company_id = C.company_id 
       join job_categories JC on J.category_id = JC.category_id
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
       Employers C on J.company_id = C.company_id 
       join job_categories JC on J.category_id = JC.category_id
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
      SELECT J.job_id, J.title AS job_title, J.description AS job_description, J.requirements,
      J.salary,J.posting_date,C.company_name,C.company_description,C.company_image AS picture,
      JC.category_name AS job_category,L.city,L.state,L.country,L.street_name AS street
      FROM Job_listings J JOIN 
      Employers C ON J.company_id = C.company_id
      JOIN Job_categories JC ON J.category_id = JC.category_id
      JOIN Locations L ON J.location_id = L.location_id
      WHERE J.job_id = ? AND J.status = 'active'`;

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
    console.log(user_id);
    let sql = `SELECT J.job_id, J.title,J.salary,J.status,J.posting_date,C.company_name,
      JC.category_name FROM Job_listings J JOIN 
      Employers C ON J.company_id = C.company_id
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

module.exports = { searchJobs, getJobs, viewDetails, viewPostJob };

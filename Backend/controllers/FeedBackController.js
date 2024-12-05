
const db = require("../db");

const GiveFeedBack = async (req, res) => {
    const { user_id } = req.user;
    try {
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
     
      let sql = `SELECT F.comments, U.first_name,U.last_name FROM feedback F JOIN 
        Users U ON F.user_id = U.user_id 
        where F.rating >=  4 and is_anonymous = 'No'`;
  
      db.query(sql,(err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "FeedBacks Given By User",
          feedbacks: result,
          pages: result.length,
        });
      });
    }
     catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Getting feedbacks",
        error,
      });
    }
  };

  module.exports = {GiveFeedBack,Getfeedback};
  
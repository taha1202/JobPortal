const db = require("../db");

const SendMessage = async (req, res) => {
    const { user_id } = req.user;
    const {id} = req.params;

    try {
      const { message } = req.body;
      if(!message){
        return res.status(400).json({ error: "Incomplete Message. Please send again." });
      }
      let sql;
      
      sql = `SELECT message_id FROM messages where sender_id = ? AND receiver_id = ?`
      db.query(sql, [user_id, id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "Unable to send message.",
          });
        }
        if(result.length > 0) {
            const msg_id = result[0].message_id;
            sql = `Update messages SET sender_id = ?, receiver_id = ?, content = ? where message_id = ?`;
            db.query(sql, [user_id,id,message,msg_id], (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(404).send({
                    success: false,
                    message: "Unable to Send Message.",
                  });
                }
                res.status(200).send({
                  success: true,
                  message: "Message Send Successfully.",
                });
            });
        }
        else {
            sql = `INSERT INTO messages (sender_id, receiver_id,content) VALUES (? , ? , ?)`;
            db.query(sql, [user_id,id,message], (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(404).send({
                    success: false,
                    message: "Unable to Send Message.",
                  });
                }
                res.status(200).send({
                  success: true,
                  message: "Message Send Successfully.",
                });
            });
        }
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
  
  const ReceiveMessage = async (req, res) => {
    const { user_id } = req.user;
    try {
      let sql = `SELECT M.sender_id, U.first_name,U.last_name FROM messages M
        JOIN Users U on M.sender_id = U.user_id
        WHERE receiver_id = ?`;
  
      db.query(sql,[user_id],(err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        res.status(200).send({
          success: true,
          message: "Message Received Successfully",
          messages: result,
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

  const ReceiveSelectedMessage = async (req, res) => {
    const { user_id } = req.user;
    const {id} = req.params
    try {
      let sql = `SELECT M.content,M.sender_id, U.first_name,U.last_name FROM messages M
        JOIN Users U on M.sender_id = U.user_id
        WHERE receiver_id = ? AND sender_id = ?`;
  
      db.query(sql,[user_id,id],(err, result) => {
        if (err) {
          console.error(err);
          return res.status(404).send({
            success: false,
            message: "No Records found",
          });
        }
        console.log("Sender ID = ", result[0].sender_id);
        res.status(200).send({
          success: true,
          message: "Message Received Successfully",
          messages: result[0],
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
  module.exports = {SendMessage,ReceiveMessage,ReceiveSelectedMessage};
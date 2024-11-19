// controllers/applicationController.js
const applyForJob = (req, res) => {
    const { jobId, resume } = req.body;
    const userId = req.session.user.id;
  
    // Insert a new application into the database
    db.query('INSERT INTO applications (jobId, userId, resume) VALUES (?, ?, ?)', 
      [jobId, userId, resume], 
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error applying for job' });
        res.status(201).json({ message: 'Applied successfully' });
      }
    );
  };
  
  module.exports = { applyForJob };
  
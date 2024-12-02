const express = require('express');
const { signup, login} = require('../controllers/userController');
const router = express.Router();
const { uploadS3 } = require('../middleware/upload');


router.post('/upload-resume', uploadS3.single('U_resume'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'Resume uploaded successfully',
      url: req.file.location, 
    });
  });
  

  router.post('/upload-image', uploadS3.single('picture'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.location, 
    });
  });

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;

const express = require('express');
const { signup, login} = require('../controllers/userController');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/upload-resume', upload.single('U_resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Resume uploaded successfully',
    url: req.file.path,  
  });
});

router.post('/upload-image', upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    url: req.file.path,  
  });
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;

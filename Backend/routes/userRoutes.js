const express = require('express');
const { signup, login, uploadResume, uploadImages, editResume} = require('../controllers/userController');
const router = express.Router();



// routes/userRoutes.js
const {uploadImage,uploadRes} = require('../middleware/upload');  // Multer upload middleware
// Resume upload route
router.post('/signup', signup);
router.post('/login', login);
router.post('/upload-resume', uploadRes.single('resume'), uploadResume);

router.post('/upload-resume', uploadRes.single('resume'), uploadResume);

router.post('/upload-image', uploadImage.single('picture'), uploadImages),

// Route to edit (replace) resume
router.post('/edit-resume', uploadRes.single('resume'), editResume);

module.exports = router;

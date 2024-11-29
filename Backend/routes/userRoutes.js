const express = require('express');
const { signup, login, uploadResume, uploadImages, GiveFeedBack, Getfeedback} = require('../controllers/userController');
const router = express.Router();
const {uploadImage,uploadRes} = require('../middleware/upload');  


router.post('/signup', signup);
router.post('/login', login);
router.post('/upload-resume', uploadRes.single('U_resume'), uploadResume);
router.post('/upload-image', uploadImage.single('picture'), uploadImages);

module.exports = router;

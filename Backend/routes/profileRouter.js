const express = require('express');
const { getprofile,viewProfile,editProfile, applicantProfile } = require('../controllers/profileController');


const router = express.Router();

router.get('/get-profile', getprofile);
router.get('/view-profile', viewProfile);
router.put('/edit-profile', editProfile);
router.get('/view-applicant-profile/:id', applicantProfile);
module.exports = router;
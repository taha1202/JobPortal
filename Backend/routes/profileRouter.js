const express = require('express');
const { getprofile,viewProfile,editProfile, applicantProfile, editEmployerProfile, viewEmployerProfile, UpdatePassword } = require('../controllers/profileController');


const router = express.Router();

router.get('/get-profile', getprofile);
router.get('/view-profile', viewProfile);
router.put('/edit-profile', editProfile);
router.get('/view-applicant-profile/:id', applicantProfile);
router.get('/view-emp-profile', viewEmployerProfile);
router.put('/edit-emp-profile', editEmployerProfile);
router.patch('/update-password', UpdatePassword);
module.exports = router;

const express = require('express');
const { applyForJob, AppliedJobs, DeleteAppliedJob, viewApplications, updateStatus } = require('../controllers/applicationController');
const router = express.Router();

router.post('/apply/:id',applyForJob);
router.get('/applied-jobs',AppliedJobs );
router.delete('/delete-appliedjob/:id', DeleteAppliedJob);
router.get('/view-applications',viewApplications);
router.put('/update-status',updateStatus);
module.exports = router;

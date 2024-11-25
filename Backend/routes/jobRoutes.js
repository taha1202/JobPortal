const express = require('express');

const { searchJobs,getJobs, viewDetails, viewPostJob } = require('../controllers/jobSearchController');
const { postJob } = require('../controllers/postjob');
const router = express.Router();
// Job search route
router.get('/search-jobs', searchJobs);
router.get('/get-jobs', getJobs);
router.get("/job-details/:id", viewDetails);
router.get('/view-postjobs',viewPostJob)
router.post('/post-job', postJob);

module.exports = router;
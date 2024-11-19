const express = require('express');

const { searchJobs } = require('../controllers/jobSearchController');
const { postJob , upload } = require('../controllers/postjob');
const router = express.Router();
// Job search route
router.get('/search-jobs', searchJobs);

// module.exports = router;

// Add the post job route
router.post('/post-job', postJob);

module.exports = router;
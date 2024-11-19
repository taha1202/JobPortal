// routes/applicationRoutes.js
const express = require('express');
const { applyForJob } = require('../controllers/applicationController');
const ensureAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

// POST: Apply for a job (only for job seekers)
router.post('/apply', ensureAuthenticated, applyForJob);

module.exports = router;

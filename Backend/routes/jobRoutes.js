const express = require("express");

const {
  searchJobs,
  getJobs,
  viewDetails,
  viewPostJob,
  SaveJobs,
  DeleteJobs,
  getSavedJobs,
  ScheduleInterview,
  DeletePostJobs,
  updatePostJob,
  CheckInterview,
  UpdateInterview,
} = require("../controllers/jobSearchController");
const { postJob } = require("../controllers/postjob");
const router = express.Router();

router.get("/search-jobs", searchJobs);
router.get("/get-jobs", getJobs);
router.get("/job-details/:id", viewDetails);
router.get("/view-postjobs", viewPostJob);
router.post("/post-job", postJob);
router.post("/save-jobs/:id", SaveJobs);
router.delete("/delete-save-jobs/:id", DeleteJobs);
router.get("/get-save-jobs", getSavedJobs);
router.post("/schedule-interview/:J_id/:A_id", ScheduleInterview);
router.delete("/delete-post-jobs/:id", DeletePostJobs);
router.patch("/edit-job/:id", updatePostJob);
router.get("/check-status/:J_id/:A_id", CheckInterview);
router.post("/update-interview/:J_id/:A_id", UpdateInterview);
module.exports = router;

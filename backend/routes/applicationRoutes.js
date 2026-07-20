const express = require("express");
const router = express.Router();

const {
  applyJob, getMyApplications, getApplicantsForJob, updateApplicationStatus,
} = require("../controllers/applicationController");
const { auth, isCandidate, isEmployer } = require("../middlewares/auth");

// candidate
router.post("/apply", auth, isCandidate, applyJob);
router.get("/my-applications", auth, isCandidate, getMyApplications);

// employer
router.get("/job/:jobId", auth, isEmployer, getApplicantsForJob);
router.put("/:id/status", auth, isEmployer, updateApplicationStatus);

module.exports = router;

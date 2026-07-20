const express = require("express");
const router = express.Router();

const { createJob, updateJob, deleteJob, getMyJobs, getJobById, getAllJobs } = require("../controllers/jobController");
const { auth, isEmployer } = require("../middlewares/auth");

// public
router.get("/all", getAllJobs);       // supports ?keyword=&category=&jobType=&city=&minSalary=&maxSalary=&experience=&page=&limit=

// employer only (must come before "/:id" so "employer" isn't treated as an id)
router.post("/create", auth, isEmployer, createJob);
router.get("/employer/my-jobs", auth, isEmployer, getMyJobs);
router.put("/:id", auth, isEmployer, updateJob);
router.delete("/:id", auth, isEmployer, deleteJob);

// public - keep last since it's a wildcard
router.get("/:id", getJobById);

module.exports = router;

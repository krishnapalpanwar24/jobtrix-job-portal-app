const asyncHandler = require("../utils/asyncHandler");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

// CANDIDATE: apply to a job (uses resume already saved on profile)
const applyJob = asyncHandler(async (req, res) => {
  const candidateId = req.user.id;
  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job || job.isBlocked || job.status !== "active") {
    return res.status(404).json({ success: false, message: "Job not available" });
  }

  const user = await User.findById(candidateId);
  if (!user.resume?.url) {
    return res.status(400).json({ success: false, message: "Please upload your resume before applying" });
  }

  const alreadyApplied = await Application.findOne({ job: jobId, candidate: candidateId });
  if (alreadyApplied) {
    return res.status(400).json({ success: false, message: "You already applied to this job" });
  }

  const application = await Application.create({
    job: jobId,
    candidate: candidateId,
    employer: job.employer,
    resume: user.resume,
  });

  res.status(201).json({ success: true, message: "Applied successfully", data: application });
});

// CANDIDATE: track own applications
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user.id })
    .populate("job", "title category jobType location")
    .populate("employer", "name image")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: applications });
});

// EMPLOYER: view applicants for one of their jobs
const getApplicantsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  if (job.employer.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const applicants = await Application.find({ job: jobId })
    .populate("candidate", "-password")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: applicants });
});

// EMPLOYER: update application status (shortlist / reject / hire)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["applied", "shortlisted", "rejected", "hired"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const application = await Application.findById(id);
  if (!application) return res.status(404).json({ success: false, message: "Application not found" });

  if (application.employer.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  application.status = status;
  await application.save();

  res.status(200).json({ success: true, message: "Status updated", data: application });
});

module.exports = { applyJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };

const asyncHandler = require("../utils/asyncHandler");
const Job = require("../models/jobModel");

// CREATE JOB (employer)
const createJob = asyncHandler(async (req, res) => {
  const employerId = req.user.id;
  const {
    title, description, category, jobType, experience, skills,
    location, salaryMin, salaryMax, vacancies,
  } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, message: "Title, description and category are required" });
  }

  const job = await Job.create({
    employer: employerId,
    title,
    description,
    category,
    jobType,
    experience,
    skills: typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills,
    location,
    salaryMin,
    salaryMax,
    vacancies,
  });

  res.status(201).json({ success: true, message: "Job posted successfully", data: job });
});

// UPDATE JOB (employer, only own job)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  if (job.employer.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to edit this job" });
  }

  const updates = { ...req.body };
  if (updates.skills && typeof updates.skills === "string") {
    updates.skills = updates.skills.split(",").map((s) => s.trim());
  }

  const updated = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.status(200).json({ success: true, message: "Job updated", data: updated });
});

// DELETE JOB (employer, only own job)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  if (job.employer.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
  }

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted" });
});

// EMPLOYER: get own posted jobs
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: jobs });
});

// SINGLE JOB (public)
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("employer", "name image category");
  if (!job || job.isBlocked) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, data: job });
});

// PUBLIC: search + filter + paginate jobs
// query params: keyword, category, jobType, city, minSalary, maxSalary, experience, page, limit
const getAllJobs = asyncHandler(async (req, res) => {
  const {
    keyword, category, jobType, city, minSalary, maxSalary, experience,
    page = 1, limit = 10,
  } = req.query;

  const query = { status: "active", isBlocked: false };

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) query.category = category;
  if (jobType) query.jobType = jobType;
  if (experience) query.experience = experience;
  if (city) query["location.city"] = { $regex: city, $options: "i" };

  if (minSalary || maxSalary) {
    query.salaryMax = query.salaryMax || {};
    if (minSalary) query.salaryMax.$gte = Number(minSalary);
    if (maxSalary) query.salaryMin = { $lte: Number(maxSalary) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("employer", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: jobs,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

module.exports = { createJob, updateJob, deleteJob, getMyJobs, getJobById, getAllJobs };

const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/generateToken");
const { sendTokenCookie, clearTokenCookie } = require("../utils/cookieHelper");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Employer = require("../models/employerModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const Contact = require("../models/contactModel");

// REGISTER ADMIN (protected by a secret signup code so randoms can't self-register as admin)
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, signupCode } = req.body;

  if (!name || !email || !password || !signupCode) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  if (signupCode !== process.env.ADMIN_SIGNUP_CODE) {
    return res.status(403).json({ success: false, message: "Invalid signup code" });
  }

  const exist = await Admin.findOne({ email });
  if (exist) {
    return res.status(400).json({ success: false, message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, password: hashedPassword });

  res.status(201).json({ success: true, message: "Admin registered" });
});

// LOGIN
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

  const token = generateToken({ id: admin._id, role: admin.role });
  sendTokenCookie(res, token);

  const data = admin.toObject();
  delete data.password;

  res.status(200).json({ success: true, message: "Login successful", data });
});

// LOGOUT
const logoutAdmin = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// DASHBOARD STATS
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalCandidates, totalEmployers, totalJobs, totalApplications] = await Promise.all([
    User.countDocuments(),
    Employer.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: { totalCandidates, totalEmployers, totalJobs, totalApplications },
  });
});

// ---- CANDIDATES ----
const getAllCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: candidates });
});

const toggleBlockCandidate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "Candidate not found" });
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.status(200).json({ success: true, message: `Candidate ${user.isBlocked ? "blocked" : "unblocked"}` });
});

const deleteCandidate = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "Candidate not found" });
  res.status(200).json({ success: true, message: "Candidate deleted" });
});

// ---- EMPLOYERS ----
const getAllEmployers = asyncHandler(async (req, res) => {
  const employers = await Employer.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: employers });
});

const toggleBlockEmployer = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.params.id);
  if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
  employer.isBlocked = !employer.isBlocked;
  await employer.save();
  res.status(200).json({ success: true, message: `Employer ${employer.isBlocked ? "blocked" : "unblocked"}` });
});

const deleteEmployer = asyncHandler(async (req, res) => {
  const employer = await Employer.findByIdAndDelete(req.params.id);
  if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
  res.status(200).json({ success: true, message: "Employer deleted" });
});

// ---- JOBS ----
const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate("employer", "name email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: jobs });
});

const toggleBlockJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  job.isBlocked = !job.isBlocked;
  await job.save();
  res.status(200).json({ success: true, message: `Job ${job.isBlocked ? "blocked" : "unblocked"}` });
});

const deleteJobAdmin = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  res.status(200).json({ success: true, message: "Job deleted" });
});

// ---- CONTACT MESSAGES ----
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: contacts });
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getAllCandidates,
  toggleBlockCandidate,
  deleteCandidate,
  getAllEmployers,
  toggleBlockEmployer,
  deleteEmployer,
  getAllJobsAdmin,
  toggleBlockJob,
  deleteJobAdmin,
  getAllContacts,
};

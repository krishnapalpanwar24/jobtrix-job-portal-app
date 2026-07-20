const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/generateToken");
const { sendTokenCookie, clearTokenCookie } = require("../utils/cookieHelper");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imagekit");
const User = require("../models/userModel");

// REGISTER
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  res.status(201).json({ success: true, message: "User registered successfully" });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ success: false, message: "Your account has been blocked" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken({ id: user._id, role: user.role });
  sendTokenCookie(res, token);

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: userData,
  });
});

// LOGOUT
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// GET PROFILE
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "Profile fetched", data: user });
});

// UPDATE PERSONAL INFO (+ profile image)
const updatePersonalInfo = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const {
    name, jobTitle, email, address, phoneNumber, experience, age,
    educationLevel, gender, currentSalary, expectedSalary, skills,
    education, description, workExperience,
  } = req.body;

  const file = req.file;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  let profileImage = user.profileImage;
  if (file) {
    if (user.profileImage?.fileId) await deleteFromImageKit(user.profileImage.fileId);
    const { url, fileId } = await uploadToImageKit(file.buffer, `profile_${id}_${Date.now()}`, "profiles");
    profileImage = { url, fileId };
  }

  const updated = await User.findByIdAndUpdate(
    id,
    {
      name, jobTitle, email, address, phoneNumber, experience, age,
      educationLevel, gender, currentSalary, expectedSalary,
      skills: typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills,
      education, description, workExperience, profileImage,
    },
    { new: true }
  ).select("-password");

  res.status(200).json({ success: true, message: "Personal info updated", data: updated });
});

// UPDATE RESUME
const updateResume = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const file = req.file;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!file) {
    return res.status(400).json({ success: false, message: "No resume file provided" });
  }

  if (user.resume?.fileId) await deleteFromImageKit(user.resume.fileId);

  const { url, fileId } = await uploadToImageKit(file.buffer, `resume_${id}_${Date.now()}`, "resumes");
  const resume = { url, fileId };

  const updated = await User.findByIdAndUpdate(id, { resume }, { new: true }).select("-password");

  res.status(200).json({ success: true, message: "Resume updated", data: updated });
});

module.exports = { register, login, logout, getProfile, updatePersonalInfo, updateResume };

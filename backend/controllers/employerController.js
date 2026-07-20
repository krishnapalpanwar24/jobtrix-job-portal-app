const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/generateToken");
const { sendTokenCookie, clearTokenCookie } = require("../utils/cookieHelper");
const { uploadToImageKit, deleteFromImageKit } = require("../utils/imagekit");
const Employer = require("../models/employerModel");

// REGISTER
const registerEmployer = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, industryType } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const exist = await Employer.findOne({ email });
  if (exist) {
    return res.status(400).json({ success: false, message: "Employer already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Employer.create({ name, email, password: hashedPassword, phoneNumber, industryType });

  res.status(201).json({ success: true, message: "Employer registered" });
});

// LOGIN
const loginEmployer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email & password required" });
  }

  const employer = await Employer.findOne({ email });
  if (!employer) {
    return res.status(404).json({ success: false, message: "Employer not found" });
  }

  if (employer.isBlocked) {
    return res.status(403).json({ success: false, message: "Your account has been blocked" });
  }

  const match = await bcrypt.compare(password, employer.password);
  if (!match) {
    return res.status(400).json({ success: false, message: "Invalid password" });
  }

  const token = generateToken({ id: employer._id, role: employer.role });
  sendTokenCookie(res, token);

  const data = employer.toObject();
  delete data.password;

  res.status(200).json({ success: true, message: "Login successful", data });
});

// LOGOUT
const logoutEmployer = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// GET PROFILE
const getEmployerProfile = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.user.id).select("-password");
  if (!employer) {
    return res.status(404).json({ success: false, message: "Employer not found" });
  }
  res.status(200).json({ success: true, message: "Profile fetched", data: employer });
});

// UPDATE PROFILE (+ logo / cover image)
const updateEmployerProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { website, category, industryType, foundedIn, teamSize, about, name, phoneNumber } = req.body;
  const files = req.files;

  const employer = await Employer.findById(id);
  if (!employer) {
    return res.status(404).json({ success: false, message: "Employer not found" });
  }

  let image = employer.image;
  if (files?.logo) {
    if (employer.image?.fileId) await deleteFromImageKit(employer.image.fileId);
    const { url, fileId } = await uploadToImageKit(files.logo[0].buffer, `logo_${id}_${Date.now()}`, "logos");
    image = { url, fileId };
  }

  let coverImage = employer.coverImage;
  if (files?.coverImage) {
    if (employer.coverImage?.fileId) await deleteFromImageKit(employer.coverImage.fileId);
    const { url, fileId } = await uploadToImageKit(files.coverImage[0].buffer, `cover_${id}_${Date.now()}`, "covers");
    coverImage = { url, fileId };
  }

  const updated = await Employer.findByIdAndUpdate(
    id,
    {
      name, phoneNumber, website, category, industryType, foundedIn, teamSize, about,
      address: {
        country: req.body["address[country]"] || employer.address?.country,
        state: req.body["address[state]"] || employer.address?.state,
        city: req.body["address[city]"] || employer.address?.city,
        area: req.body["address[area]"] || employer.address?.area,
        fullAddress: req.body["address[fullAddress]"] || employer.address?.fullAddress,
      },
      image,
      coverImage,
    },
    { new: true }
  ).select("-password");

  res.status(200).json({ success: true, message: "Profile updated", data: updated });
});

// PUBLIC: get single employer/company details (for candidates to view)
const getEmployerById = asyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.params.id).select("-password");
  if (!employer) {
    return res.status(404).json({ success: false, message: "Employer not found" });
  }
  res.status(200).json({ success: true, data: employer });
});

module.exports = {
  registerEmployer,
  loginEmployer,
  logoutEmployer,
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerById,
};

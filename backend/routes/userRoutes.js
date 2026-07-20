const express = require("express");
const router = express.Router();

const { register, login, logout, getProfile, updatePersonalInfo, updateResume } = require("../controllers/userController");
const { auth, isCandidate } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/getprofile", auth, isCandidate, getProfile);
router.put("/update-personal-info", auth, isCandidate, upload.single("profileImage"), updatePersonalInfo);
router.put("/update-resume", auth, isCandidate, upload.single("resume"), updateResume);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  registerEmployer, loginEmployer, logoutEmployer, getEmployerProfile, updateEmployerProfile, getEmployerById,
} = require("../controllers/employerController");
const { auth, isEmployer } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/register", registerEmployer);
router.post("/login", loginEmployer);
router.post("/logout", logoutEmployer);

router.get("/profile", auth, isEmployer, getEmployerProfile);
router.put(
  "/update",
  auth,
  isEmployer,
  upload.fields([{ name: "logo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
  updateEmployerProfile
);

router.get("/:id", getEmployerById); // public - view company profile

module.exports = router;

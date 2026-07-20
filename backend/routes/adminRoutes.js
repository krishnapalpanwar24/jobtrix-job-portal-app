const express = require("express");
const router = express.Router();

const {
  registerAdmin, loginAdmin, logoutAdmin, getDashboardStats,
  getAllCandidates, toggleBlockCandidate, deleteCandidate,
  getAllEmployers, toggleBlockEmployer, deleteEmployer,
  getAllJobsAdmin, toggleBlockJob, deleteJobAdmin,
  getAllContacts,
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/dashboard-stats", auth, isAdmin, getDashboardStats);

router.get("/candidates", auth, isAdmin, getAllCandidates);
router.put("/candidates/:id/toggle-block", auth, isAdmin, toggleBlockCandidate);
router.delete("/candidates/:id", auth, isAdmin, deleteCandidate);

router.get("/employers", auth, isAdmin, getAllEmployers);
router.put("/employers/:id/toggle-block", auth, isAdmin, toggleBlockEmployer);
router.delete("/employers/:id", auth, isAdmin, deleteEmployer);

router.get("/jobs", auth, isAdmin, getAllJobsAdmin);
router.put("/jobs/:id/toggle-block", auth, isAdmin, toggleBlockJob);
router.delete("/jobs/:id", auth, isAdmin, deleteJobAdmin);

router.get("/contacts", auth, isAdmin, getAllContacts);

module.exports = router;

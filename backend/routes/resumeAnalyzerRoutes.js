const express = require("express");
const { analyzeResume } = require("../controllers/resumeAnalyzerController");
const router = express.Router();

router.post("/analyze", analyzeResume);

module.exports = router;
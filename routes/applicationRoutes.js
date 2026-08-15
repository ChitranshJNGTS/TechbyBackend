const express = require("express");

const router = express.Router();
const protect = require("../middleware/AuthMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  applyJob,
  getAllApplications,
} = require("../controllers/JobApplication");

// Candidate Apply
router.post("/apply/:jobId", protect, applyJob);

// Admin View Applications
router.get("/all", adminMiddleware, getAllApplications);

module.exports = router;
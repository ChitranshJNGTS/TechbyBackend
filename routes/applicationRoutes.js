const express = require("express");

const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  applyJob,
  getAllApplications,
} = require("../controllers/JobApplication");

// Candidate Apply
router.post("/apply/:jobId", adminMiddleware, applyJob);

// Admin View Applications
router.get("/all", adminMiddleware, getAllApplications);

module.exports = router;
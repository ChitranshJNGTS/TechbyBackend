const express = require("express");

const router = express.Router();

const auth = require("../middleware/AuthMiddleware");

const {
  applyJob,
  getAllApplications,
} = require("../controllers/JobApplication");

// Candidate Apply
router.post("/apply/:jobId", auth, applyJob);

// Admin View Applications
router.get("/all", auth, getAllApplications);

module.exports = router;
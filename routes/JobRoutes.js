const express = require("express");

const router = express.Router();

const auth = require("../middleware/AuthMiddleware");
const upload = require("../middleware/upload");

const { createJob ,getAllJobs ,getJobById } = require("../controllers/JobController");

router.post(
  "/create",
  auth,
  upload.single("companyLogo"),
  createJob
);
// Get All Jobs
router.get("/", getAllJobs);

// Get Job By Id
router.get("/:id", getJobById);
module.exports = router;
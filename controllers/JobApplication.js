const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const JobApplication = require("../models/JobApplicationModel");

// =========================
// Apply Job
// =========================

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Firebase UID
    const firebaseUid = req.user.uid;

    console.log("jobId:", jobId);
    console.log("firebaseUid:", firebaseUid);

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Find MongoDB user using Firebase UID
    const user = await User.findOne({
      firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // Check resume
    if (!user.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    // Check duplicate application
    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      candidate: user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this job.",
      });
    }

    // Create application
    await JobApplication.create({
      job: jobId,
      candidate: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// Get All Applications
// =========================



exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate(
        "candidate",
        "name email phone resume education experience skills city state profileImage"
      )
      .populate(
        "job",
        "jobTitle companyName city state salaryMin salaryMax"
      )
      .sort({ createdAt: -1 });
      console.log(JSON.stringify(applications, null, 2));

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const JobApplication = require("../models/JobApplicationModel");

// =========================
// Apply Job
// =========================

exports.applyJob = async (req, res) => {
  try {


    const { jobId } = req.params;
    const userId = req.user.id;

    console.log("jobId:", jobId);
    console.log("userId:", userId);
    // const { jobId } = req.params;

    // const userId = req.user.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const user = await User.findById(userId);

    if (!user.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      candidate: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this job.",
      });
    }

    await JobApplication.create({
      job: jobId,
      candidate: userId,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
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
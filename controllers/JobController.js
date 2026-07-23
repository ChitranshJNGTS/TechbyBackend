const Job = require("../models/JobModel");

// ==========================
// Create Job
// ==========================
exports.createJob = async (req, res) => {
  try {
    const data = req.body;

    if (data.skills) {
      data.skills = data.skills
        .split(",")
        .map((item) => item.trim());
    }

    if (req.file) {
      data.companyLogo = req.file.path;
    }

    const job = await Job.create(data);

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Jobs
// ==========================
exports.getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      experience,
      workMode,
      jobType,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    const query = {};

    // Search by title or company
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Experience
    if (experience) {
      query.experience = experience;
    }

    // Work Mode
    if (workMode) {
      query.workMode = workMode;
    }

    // Job Type
    if (jobType) {
      query.jobType = jobType;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "salaryHigh") {
      sortOption = { maxSalary: -1 };
    }

    if (sort === "salaryLow") {
      sortOption = { minSalary: 1 };
    }

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Job By ID
// ==========================
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
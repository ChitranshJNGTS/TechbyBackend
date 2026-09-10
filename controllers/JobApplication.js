// const Job = require("../models/JobModel");
// const User = require("../models/UserModel");
// const JobApplication = require("../models/JobApplicationModel");

// // =========================
// // Apply Job
// // =========================

// exports.applyJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     // Firebase UID
//     const firebaseUid = req.user.uid;


//     // Find job
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     // Find MongoDB user using Firebase UID
//     const user = await User.findOne({
//       firebaseUid,
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User profile not found",
//       });
//     }

//     // Check resume
//     if (!user.resume) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload your resume first.",
//       });
//     }

//     // Check duplicate application
//     const alreadyApplied = await JobApplication.findOne({
//       job: jobId,
//       candidate: user._id,
//     });

//     if (alreadyApplied) {
//       return res.status(400).json({
//         success: false,
//         message: "You already applied for this job.",
//       });
//     }

//     // Create application
//     await JobApplication.create({
//       job: jobId,
//       candidate: user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Application submitted successfully.",
//     });

//   } catch (error) {
//     console.error("Apply Job Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // =========================
// // Get All Applications
// // =========================



// exports.getAllApplications = async (req, res) => {
//   try {
//     const applications = await JobApplication.find()
//       .populate(
//         "candidate",
//         "name email phone resume education experience skills city state profileImage"
//       )
//       .populate(
//         "job",
//         "jobTitle companyName city state salaryMin salaryMax"
//       )
//       .sort({ createdAt: -1 });
//       console.log(JSON.stringify(applications, null, 2));

//     res.status(200).json({
//       success: true,
//       totalApplications: applications.length,
//       applications,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }; 



const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const JobApplication = require("../models/JobApplicationModel");
const cloudinary = require("../config/cloudinary");

// =========================
// Upload Resume to Cloudinary
// =========================

const uploadResumeToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "techby/applications/resumes",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// =========================
// Apply Job
// =========================

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const {
      name,
      email,
      phone,
      experience,
      coverLetter,
    } = req.body;

    // =========================
    // Validate basic details
    // =========================

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required.",
      });
    }

    // =========================
    // Validate resume
    // =========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume.",
      });
    }

    // =========================
    // Validate resume size
    // =========================

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume size must be less than 5 MB.",
      });
    }

    // =========================
    // Validate file type
    // =========================

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF, DOC and DOCX resumes are allowed.",
      });
    }

    // =========================
    // Find Job
    // =========================

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // =========================
    // Clean email
    // =========================

    const candidateEmail = email.trim().toLowerCase();

    // =========================
    // Check duplicate application
    // =========================

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      candidateEmail,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // =========================
    // Upload Resume
    // =========================

    const uploadResult = await uploadResumeToCloudinary(
      req.file
    );

    // =========================
    // Create Application
    // =========================

    const application = await JobApplication.create({
      job: jobId,

      candidate: null,

      candidateName: name.trim(),

      candidateEmail,

      candidatePhone: phone.trim(),

      experience: experience?.trim() || "",

      resumeUrl: uploadResult.secure_url,

      resumePublicId: uploadResult.public_id,

      coverLetter: coverLetter?.trim() || "",

      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: application._id,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);

    // Mongo duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

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

    console.log(
      JSON.stringify(applications, null, 2)
    );

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "Get Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
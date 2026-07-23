const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    // Applied Job
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Candidate
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Application Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Selected",
      ],
      default: "Pending",
    },

    // Admin Notes
    adminRemark: {
      type: String,
      default: "",
    },

    // Interview Details
    interviewDate: {
      type: Date,
      default: null,
    },

    interviewMode: {
      type: String,
      enum: ["Online", "Offline", ""],
      default: "",
    },

    interviewLink: {
      type: String,
      default: "",
    },

    interviewLocation: {
      type: String,
      default: "",
    },

    // Candidate Cover Letter (Optional)
    coverLetter: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
JobApplicationSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "JobApplication",
  JobApplicationSchema
);
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    companyWebsite: String,

    companyEmail: {
      type: String,
      required: true,
    },

    companyLogo: String,

    jobTitle: {
      type: String,
      required: true,
    },

    category: String,

    employmentType: String,

    workMode: String,

    experience: String,

    salaryMin: Number,

    salaryMax: Number,

    country: String,

    state: String,

    city: String,

    pinCode: String,

    officeAddress: String,

    jobSummary: String,

    responsibilities: String,

    requirements: String,

    skills: [String],

    benefits: String,

    openPositions: Number,

    applicationDeadline: Date,

    joiningDate: Date,

    recruiterName: String,

    recruiterEmail: String,

    recruiterPhone: String,

    interviewProcess: String,

    screeningQuestions: String,

    featured: {
      type: Boolean,
      default: false,
    },

    urgentHiring: {
      type: Boolean,
      default: false,
    },

    allowRemoteApplicants: {
      type: Boolean,
      default: false,
    },

    emailNotifications: {
      type: Boolean,
      default: false,
    },

    postedBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
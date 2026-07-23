const mongoose = require("mongoose");

const DemoInterviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    recruiter: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      default: "90 Minutes",
    },

    mode: {
      type: String,
      default: "Google Meet",
    },

    price: {
      type: Number,
      required: true,
    },

    totalSeats: {
      type: Number,
      default: 5,
    },

    bookedSeats: {
      type: Number,
      default: 0,
    },

    interviewLink: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DemoInterview",
  DemoInterviewSchema
);
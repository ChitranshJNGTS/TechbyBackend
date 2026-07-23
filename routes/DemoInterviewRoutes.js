const express = require("express");

const router = express.Router();

const controller = require("../controllers/DemoInterviewController");

const auth = require("../middleware/AuthMiddleware");

// Admin
router.post("/create", controller.createInterview);

// User
router.get("/", controller.getInterviews);

router.post(
  "/book/:interviewId",
  auth,
  controller.bookInterview
);

// Admin
router.get(
  "/bookings",
  controller.getAllBookings
);

module.exports = router;
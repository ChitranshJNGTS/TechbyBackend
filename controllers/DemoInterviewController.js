const DemoInterview = require("../models/DemoInterviewModel");
const Booking = require("../models/DemoInterviewBookingModel");

exports.createInterview = async (req, res) => {
  try {
    const interview = await DemoInterview.create(req.body);

    res.json({
      success: true,
      interview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await DemoInterview.find({
      isActive: true,
    }).sort({
      date: 1,
    });

    res.json({
      success: true,
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.bookInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview =
      await DemoInterview.findById(interviewId);

    if (!interview)
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });

    if (
      interview.bookedSeats >=
      interview.totalSeats
    ) {
      return res.status(400).json({
        success: false,
        message: "Seats Full",
      });
    }

    const alreadyBooked =
      await Booking.findOne({
        interview: interviewId,
        candidate: req.user.id,
      });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "Already Booked",
      });
    }

    const booking = await Booking.create({
      interview: interviewId,
      candidate: req.user.id,
      paymentStatus: "Paid",
      amount: interview.price,
    });

    interview.bookedSeats++;

    await interview.save();

    res.json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "candidate",
        "name email phone resume"
      )
      .populate("interview")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
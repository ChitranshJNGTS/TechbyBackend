// const User = require("../models/UserModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ================= Register =================

// exports.register = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       password,
//       confirmPassword,
//       role,
//     } = req.body;

//     if (!name || !email || !phone || !password || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match",
//       });
//     }

//     const exists = await User.findOne({ email });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password: hash,
//       role,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Registration Successful",
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



// exports.updateProfile = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         name: req.body.name,
//         phone: req.body.phone,
//         education: req.body.education,
//         experience: req.body.experience,
//         skills: req.body.skills,
//         currentCompany: req.body.currentCompany,
//         currentCTC: req.body.currentCTC,
//         expectedCTC: req.body.expectedCTC,
//         noticePeriod: req.body.noticePeriod,
//         address: req.body.address,
//         city: req.body.city,
//         state: req.body.state,
//         country: req.body.country,
//         about: req.body.about,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password");

//     res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ================= Get Profile =================

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// // ================= Login =================

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Email",
//       });
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.json({
//       success: true,
//       message: "Login Successful",
//       token,
//       user,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // ================= Upload Resume =================

// exports.uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a resume.",
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//        resume: `uploads/${req.file.filename}`,
//       },
//       {
//         new: true,
//       }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Resume uploaded successfully.",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

















const User = require("../models/UserModel");

// ================= Create Profile =================
// Firebase handles registration.
// This function creates the user's MongoDB profile.

exports.createProfile = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    // Name is required.
    // Phone is optional because Google login
    // normally does not provide a phone number.
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Firebase UID comes from auth middleware
    const firebaseUid = req.user.uid;
    const email = req.user.email;

    // Check if profile already exists
    const exists = await User.findOne({
      firebaseUid,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User profile already exists",
      });
    }

    // Create MongoDB profile
    const user = await User.create({
      firebaseUid,
      name,
      email,
      phone: phone || "",
      role: role || "candidate",
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      user,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Profile =================

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        firebaseUid: req.user.uid,
      },
      {
        name: req.body.name,
        phone: req.body.phone,
        education: req.body.education,
        experience: req.body.experience,
        skills: req.body.skills,
        currentCompany: req.body.currentCompany,
        currentCTC: req.body.currentCTC,
        expectedCTC: req.body.expectedCTC,
        noticePeriod: req.body.noticePeriod,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        about: req.body.about,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get Profile =================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Upload Resume =================

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        firebaseUid: req.user.uid,
      },
      {
        resume: `uploads/${req.file.filename}`,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      user,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
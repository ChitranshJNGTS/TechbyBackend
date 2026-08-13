// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//       firebaseUid: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["candidate", "employer"],
//       default: "candidate",
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },

//     // Candidate Profile
//     resume: {
//       type: String,
//       default: "",
//     },

//     education: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     experience: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     skills: {
//       type: [String],
//       default: [],
//     },

//     currentCompany: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     currentCTC: {
//       type: String,
//       default: "",
//     },

//     expectedCTC: {
//       type: String,
//       default: "",
//     },

//     about: {
//   type: String,
//   default: "",
// },
//     noticePeriod: {
//       type: String,
//       default: "",
//     },

//     address: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     city: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     state: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     country: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", UserSchema); 


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Optional because Google login may not provide phone
    phone: {
      type: String,
      default: "",
    },

    // Firebase handles the password
    // DO NOT keep password required here

    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },

    education: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    currentCompany: {
      type: String,
      default: "",
    },

    currentCTC: {
      type: String,
      default: "",
    },

    expectedCTC: {
      type: String,
      default: "",
    },

    noticePeriod: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    photoURL: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
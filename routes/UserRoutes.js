// const express = require("express");

// const router = express.Router();
// const auth = require("../middleware/AuthMiddleware");
// const upload = require("../middleware/upload");
// const {
//   register,
//   login,
//   uploadResume,
//   getProfile,
//   updateProfile
// } = require("../controllers/userController");


// router.put("/update-profile", auth, updateProfile);
// router.get("/profile", auth, getProfile);

// router.put(
//   "/upload-resume",
//   auth,
//   upload.single("resume"),
//   uploadResume
// );


// router.post("/register", register);

// router.post("/login", login);

// module.exports = router; 

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload");
const {
  createProfile,
  updateProfile,
  getProfile,
  uploadResume,
} = require("../controllers/UserController");

const protect = require("../middleware/authMiddleware");

router.post("/profile", protect, createProfile);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post(
  "/resume",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;
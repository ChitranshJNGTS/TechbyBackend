const express = require("express");

const router = express.Router();
const auth = require("../middleware/AuthMiddleware");
const upload = require("../middleware/upload");
const {
  register,
  login,
  uploadResume,
  getProfile,
  updateProfile
} = require("../controllers/userController");


router.put("/update-profile", auth, updateProfile);
router.get("/profile", auth, getProfile);

router.put(
  "/upload-resume",
  auth,
  upload.single("resume"),
  uploadResume
);


router.post("/register", register);

router.post("/login", login);

module.exports = router;
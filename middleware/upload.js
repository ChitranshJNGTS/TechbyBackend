const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadPath = path.join(__dirname, "../uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, fileName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, DOC and DOCX files are allowed.")
    );
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
// const multer = require("multer");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "companyLogo") {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       return cb(null, true);
//     }

//     return cb(
//       new Error("Only JPG, JPEG, PNG and WEBP images are allowed.")
//     );
//   }

//   if (file.fieldname === "resume") {
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       return cb(null, true);
//     }

//     return cb(
//       new Error("Only PDF, DOC and DOCX files are allowed.")
//     );
//   }

//   return cb(new Error("Invalid upload field."));
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });















// // module.exports = upload;
// const multer = require("multer");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   // =========================
//   // COMPANY LOGO
//   // =========================
//   if (file.fieldname === "companyLogo") {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       return cb(null, true);
//     }

//     return cb(
//       new Error(
//         "Only JPG, JPEG, PNG and WEBP images are allowed."
//       )
//     );
//   }

//   // =========================
//   // RESUME
//   // =========================
//   if (file.fieldname === "resume") {
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       return cb(null, true);
//     }

//     return cb(
//       new Error(
//         "Only PDF, DOC and DOCX files are allowed."
//       )
//     );
//   }

//   // =========================
//   // NEWS PDF
//   // =========================
//   if (file.fieldname === "pdf") {
//     if (file.mimetype === "application/pdf") {
//       return cb(null, true);
//     }

//     return cb(
//       new Error("Only PDF files are allowed for government notifications.")
//     );
//   }

//   // =========================
//   // INVALID FIELD
//   // =========================
//   return cb(new Error("Invalid upload field."));
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB
//   },
// });

// module.exports = upload;


const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // ==========================================
  // NEWS IMAGE
  // ==========================================

  if (file.fieldname === "image") {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }

  // ==========================================
  // COMPANY LOGO
  // ==========================================

  if (file.fieldname === "companyLogo") {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }

  // ==========================================
  // RESUME
  // ==========================================

  if (file.fieldname === "resume") {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed."
      )
    );
  }

  // ==========================================
  // NEWS PDF
  // ==========================================

  if (file.fieldname === "pdf") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PDF files are allowed for government notifications."
      )
    );
  }

  // ==========================================
  // INVALID
  // ==========================================

  return cb(
    new Error("Invalid upload field.")
  );
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
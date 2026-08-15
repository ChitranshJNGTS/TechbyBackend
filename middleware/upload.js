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

// module.exports = upload;


const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

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

  return cb(new Error("Invalid upload field."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
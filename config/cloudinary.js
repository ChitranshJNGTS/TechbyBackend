
// const dotenv = require("dotenv");
// dotenv.config();

// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadPdfToCloudinary = (buffer, originalName) => {
//   return new Promise((resolve, reject) => {
//     const safeName = originalName
//       .replace(/\.pdf$/i, "")
//       .replace(/[^a-zA-Z0-9-_]/g, "-");

//     const publicId = `${safeName}-${Date.now()}`;

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: "techby/news-pdfs",
//         resource_type: "image",
//         type: "upload",
//         public_id: publicId,
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary PDF upload error:", error);
//           return reject(error);
//         }

//         const pdfUrl =
//           `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}` +
//           `/image/upload/v${result.version}/${result.public_id}.pdf`;

//         resolve({
//           ...result,
//           secure_url: pdfUrl,
//         });
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };

// module.exports = {
//   cloudinary,
//   uploadPdfToCloudinary,
// };



const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// UPLOAD NEWS IMAGE
// ==========================================

const uploadImageToCloudinary = (
  buffer,
  originalName
) => {
  return new Promise((resolve, reject) => {
    const safeName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const publicId = `${safeName}-${Date.now()}`;

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "techby/news-images",
          resource_type: "image",
          type: "upload",
          public_id: publicId,
        },

        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary image upload error:",
              error
            );

            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
};

// ==========================================
// UPLOAD NEWS PDF
// ==========================================

const uploadPdfToCloudinary = (
  buffer,
  originalName
) => {
  return new Promise((resolve, reject) => {
    const safeName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const publicId = `${safeName}-${Date.now()}`;

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "techby/news-pdfs",
          resource_type: "raw",
          type: "upload",
          public_id: publicId,
        },

        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary PDF upload error:",
              error
            );

            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
};
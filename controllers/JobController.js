// const Job = require("../models/JobModel");



// // ==========================
// // Create Job
// // ==========================
// // ==========================
// // Create Job
// // ==========================
// exports.createJob = async (req, res) => {
//   try {
//     const data = req.body;

//     // Convert skills string to array
//     if (data.skills) {
//       data.skills = data.skills
//         .split(",")
//         .map((item) => item.trim())
//         .filter(Boolean);
//     } else {
//       data.skills = [];
//     }

//     // Cloudinary uploaded company logo
//     if (req.file) {
//       data.companyLogo =
//         req.file.path ||
//         req.file.secure_url ||
//         req.file.url;
//     }

//     const job = await Job.create(data);

//     res.status(201).json({
//       success: true,
//       message: "Job Posted Successfully",
//       job,
//     });
//   } catch (error) {
//     console.log("Create Job Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================
// // Get All Jobs
// // ==========================
// exports.getAllJobs = async (req, res) => {
//   try {
//     const {
//       keyword,
//       location,
//       experience,
//       workMode,
//       jobType,
//       page = 1,
//       limit = 10,
//       sort = "latest",
//     } = req.query;

//     const query = {};

//     // Search by title or company
//     if (keyword) {
//       query.$or = [
//         { title: { $regex: keyword, $options: "i" } },
//         { company: { $regex: keyword, $options: "i" } },
//       ];
//     }

//     // Location
//     if (location) {
//       query.location = {
//         $regex: location,
//         $options: "i",
//       };
//     }

//     // Experience
//     if (experience) {
//       query.experience = experience;
//     }

//     // Work Mode
//     if (workMode) {
//       query.workMode = workMode;
//     }

//     // Job Type
//     if (jobType) {
//       query.jobType = jobType;
//     }

//     let sortOption = { createdAt: -1 };

//     if (sort === "oldest") {
//       sortOption = { createdAt: 1 };
//     }

//     if (sort === "salaryHigh") {
//       sortOption = { maxSalary: -1 };
//     }

//     if (sort === "salaryLow") {
//       sortOption = { minSalary: 1 };
//     }

//     const totalJobs = await Job.countDocuments(query);

//     const jobs = await Job.find(query)
//       .sort(sortOption)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.status(200).json({
//       success: true,
//       totalJobs,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalJobs / limit),
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ==========================
// // Get Job By ID
// // ==========================
// exports.getJobById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const job = await Job.findById(id);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       job,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }; 




















const Job = require("../models/JobModel");
const { postJobToTelegram } = require("../utility/telegram.js");
const cloudinary = require("../config/cloudinary");

// ==========================
// Create SEO Friendly Slug
// ==========================
const slugify = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const generateJobSlug = (job) => {
  const title = slugify(job.jobTitle);
  const company = slugify(job.companyName);
  const category = slugify(job.category);

  return `${title}-${company}-${category}-${job._id}`;
};

// ==========================
// Create Job
// ==========================
exports.createJob = async (req, res) => {
  try {
    const data = req.body;

    // ==========================
    // Convert skills string to array
    // ==========================
    if (data.skills) {
      data.skills = data.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      data.skills = [];
    }

    // ==========================
    // Upload Company Logo
    // ==========================
    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "workscout/company-logos",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(req.file.buffer);
        });
      };

      const result = await uploadToCloudinary();

      data.companyLogo = result.secure_url;

      console.log("Cloudinary uploaded:", result.secure_url);
    }

    // ==========================
    // Create Job
    // ==========================
    const job = await Job.create(data);

    // ==========================
    // Generate Unique SEO Slug
    // ==========================
  job.slug = generateJobSlug(job);

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.createJob = async (req, res) => {
//   try {
//     const data = req.body;

//     // ==========================
//     // Convert skills string to array
//     // ==========================

//     if (data.skills) {
//       data.skills = data.skills
//         .split(",")
//         .map((item) => item.trim())
//         .filter(Boolean);
//     } else {
//       data.skills = [];
//     }

//     // ==========================
//     // Upload Company Logo
//     // ==========================

//     if (req.file) {
//       const uploadToCloudinary = () => {
//         return new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             {
//               folder: "workscout/company-logos",
//               resource_type: "image",
//             },
//             (error, result) => {
//               if (error) {
//                 reject(error);
//               } else {
//                 resolve(result);
//               }
//             }
//           );

//           stream.end(req.file.buffer);
//         });
//       };

//       const result = await uploadToCloudinary();

//       data.companyLogo = result.secure_url;

//       console.log("Cloudinary uploaded:", result.secure_url);
//     }

//     // ==========================
//     // Create Job
//     // ==========================

//     const job = await Job.create(data);

//     // ==========================
//     // Generate Unique SEO Slug
//     // ==========================

//     job.slug = generateJobSlug(job);

//     await job.save();

//     // ==========================
//     // Post Job to Telegram
//     // ==========================

//     try {
//       await postJobToTelegram(job);

//       console.log("✅ Job posted to Telegram successfully");
//     } catch (telegramError) {
//       console.error(
//         "❌ Telegram posting failed:",
//         telegramError.message
//       );
//     }

//     // ==========================
//     // Send Response
//     // ==========================

//     res.status(201).json({
//       success: true,
//       message: "Job Posted Successfully",
//       job,
//     });
//   } catch (error) {
//     console.log("Create Job Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ==========================
// Get All Jobs
// ==========================
exports.getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      experience,
      workMode,
      jobType,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { companyName: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.$or = [
        { city: { $regex: location, $options: "i" } },
        { state: { $regex: location, $options: "i" } },
        { country: { $regex: location, $options: "i" } },
      ];
    }

    if (experience) {
      query.experience = experience;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      query.employmentType = jobType;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "salaryHigh") {
      sortOption = { salaryMax: -1 };
    }

    if (sort === "salaryLow") {
      sortOption = { salaryMin: 1 };
    }

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / Number(limit)),
      jobs,
    });
  } catch (error) {
    console.log("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Job By ID
// ==========================
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log("Get Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 


// ==========================
// Get Job By Slug
// ==========================
exports.getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const job = await Job.findOne({ slug });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log("Get Job By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.shareJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    const frontendUrl = "https://techby.in";
    const jobUrl = `${frontendUrl}/jobs/${job.slug}`;

    const title = `${job.title} | TechBy`;
    const description =
      job.shortDescription ||
      `Apply for ${job.title} on TechBy.`;

    const image =
      job.companyLogo ||
      "https://techby.in/default-job-image.jpg";

    res.set("Content-Type", "text/html");

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:url" content="${jobUrl}" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0;url=${jobUrl}" />
          <title>${title}</title>
        </head>
        <body>
          <script>
            window.location.replace(${JSON.stringify(jobUrl)});
          </script>
          <a href="${jobUrl}">View job on TechBy</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Share job error:", error);
    return res.status(500).send("Unable to share job");
  }
};

// ==========================
// Escape HTML
// ==========================
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
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




// const Job = require("../models/JobModel");

// ==========================
// Share Job Page
// ==========================

exports.shareJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    const frontendUrl = (
      process.env.FRONTEND_URL || "https://techby.in"
    ).replace(/\/+$/, "");

    // Use the SEO-friendly job slug.
    const jobUrl = job.slug
      ? `${frontendUrl}/jobs/${encodeURIComponent(job.slug)}`
      : `${frontendUrl}/jobs/${encodeURIComponent(id)}`;

    const title = `${job.jobTitle || "Job Opportunity"} at ${
      job.companyName || "Company"
    } | TechBy`;

    const description = [
      job.jobSummary || "Explore this job opportunity on TechBy.",
      job.experience ? `Experience: ${job.experience}.` : "",
      job.city
        ? `Location: ${job.city}${job.state ? `, ${job.state}` : ""}.`
        : "",
      job.salaryMin || job.salaryMax
        ? `Salary: ₹${job.salaryMin?.toLocaleString("en-IN") || "0"}${
            job.salaryMax
              ? ` - ₹${job.salaryMax.toLocaleString("en-IN")}`
              : ""
          }.`
        : "",
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 300);

    const logo = job.companyLogo;

    const image =
      typeof logo === "string" &&
      logo.trim() !== "" &&
      logo.trim().toLowerCase() !== "null" &&
      /^https?:\/\//i.test(logo.trim())
        ? logo.trim()
        : `${frontendUrl}/default-job-share.png`;

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImage = escapeHtml(image);
    const safeJobUrl = escapeHtml(jobUrl);
    const safeCompany = escapeHtml(job.companyName || "Company");
    const safeJobTitle = escapeHtml(job.jobTitle || "Job Opportunity");

    res.set("Cache-Control", "public, max-age=300");

    return res.status(200).type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <link rel="canonical" href="${safeJobUrl}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TechBy" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:image:alt" content="${safeCompany} logo" />
  <meta property="og:url" content="${safeJobUrl}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${safeImage}" />

  <meta http-equiv="refresh" content="1;url=${safeJobUrl}" />

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .container {
      max-width: 600px;
      width: 100%;
      padding: 30px;
      text-align: center;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
    }

    img {
      max-width: 180px;
      max-height: 120px;
      object-fit: contain;
      margin-bottom: 20px;
    }

    p {
      color: #475569;
      line-height: 1.6;
    }

    a {
      display: inline-block;
      margin-top: 20px;
      background: #10b981;
      color: #052e16;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${safeImage}" alt="${safeCompany}" />
    <h1>${safeJobTitle}</h1>
    <h3>${safeCompany}</h3>
    <p>${safeDescription}</p>
    <a href="${safeJobUrl}">View Job on TechBy</a>
    <p>Redirecting you to the job details...</p>
  </div>

  <script>
    window.setTimeout(() => {
      window.location.replace(${JSON.stringify(jobUrl)});
    }, 800);
  </script>
</body>
</html>`);
  } catch (error) {
    console.error("Error sharing job:", error);
    return res.status(500).send("Unable to share this job.");
  }
};

// Escape dynamic content before inserting it into HTML.
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

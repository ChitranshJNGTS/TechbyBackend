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
const cloudinary = require("../config/cloudinary");

// ==========================
// Create Job
// ==========================
exports.createJob = async (req, res) => {
  try {
    const data = req.body;

    // Convert skills string to array
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

      // Store Cloudinary URL in MongoDB
      data.companyLogo = result.secure_url;

      console.log("Cloudinary uploaded:", result.secure_url);
    }

    // ==========================
    // Create Job
    // ==========================
    const job = await Job.create(data);

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

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const jobUrl = `${frontendUrl}/jobs/${job._id}`;

    const title = `${job.jobTitle} at ${job.companyName}`;

    const description =
      `${job.jobSummary || "Apply for this job opportunity."} ` +
      `${job.experience ? `Experience: ${job.experience}. ` : ""}` +
      `${job.city ? `Location: ${job.city}, ${job.state || ""}. ` : ""}` +
      `${job.salaryMin && job.salaryMax
        ? `Salary: ₹${job.salaryMin.toLocaleString()} - ₹${job.salaryMax.toLocaleString()}.`
        : ""
      }`;

    const image =
      job.companyLogo ||
      `${frontendUrl}/default-job-image.png`;

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <title>${escapeHtml(title)}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="website" />

  <meta
    property="og:title"
    content="${escapeHtml(title)}"
  />

  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  />

  <meta
    property="og:image"
    content="${image}"
  />

  <meta
    property="og:url"
    content="${jobUrl}"
  />

  <meta
    property="og:site_name"
    content="WorkScout"
  />

  <!-- Twitter -->
  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="${escapeHtml(title)}"
  />

  <meta
    name="twitter:description"
    content="${escapeHtml(description)}"
  />

  <meta
    name="twitter:image"
    content="${image}"
  />

  <style>

    body {
      font-family: Arial, sans-serif;
      background: #020617;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }

    .container {
      max-width: 600px;
      padding: 30px;
      text-align: center;
    }

    img {
      max-width: 200px;
      max-height: 150px;
      object-fit: contain;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 28px;
    }

    p {
      color: #94a3b8;
      line-height: 1.6;
    }

    a {
      display: inline-block;
      margin-top: 20px;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
    }

  </style>

</head>

<body>

  <div class="container">

    <img
      src="${image}"
      alt="${escapeHtml(job.companyName)}"
    />

    <h1>
      ${escapeHtml(job.jobTitle)}
    </h1>

    <h3>
      ${escapeHtml(job.companyName)}
    </h3>

    <p>
      ${escapeHtml(description)}
    </p>

    <a href="${jobUrl}">
      View Job
    </a>

  </div>

</body>

</html>
`;

    res.status(200).send(html);

  } catch (error) {
    console.error("Share Job Error:", error);

    res.status(500).send("Unable to generate job share page");
  }
};


// ==========================
// HTML Escape
// ==========================

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
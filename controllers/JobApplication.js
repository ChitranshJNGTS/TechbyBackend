
// const Job = require("../models/JobModel");
// const User = require("../models/UserModel");
// const JobApplication = require("../models/JobApplicationModel");
// const cloudinary = require("../config/cloudinary");

// // =========================
// // Upload Resume to Cloudinary
// // =========================

// const uploadResumeToCloudinary = (file) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "techby/applications/resumes",
//         resource_type: "raw",
//         use_filename: true,
//         unique_filename: true,
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     stream.end(file.buffer);
//   });
// };

// // =========================
// // Apply Job
// // =========================

// exports.applyJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     const {
//       name,
//       email,
//       phone,
//       experience,
//       coverLetter,
//     } = req.body;

//     // =========================
//     // Validate basic details
//     // =========================

//     if (!name || !email || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email and phone are required.",
//       });
//     }

//     // =========================
//     // Validate resume
//     // =========================

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload your resume.",
//       });
//     }

//     // =========================
//     // Validate resume size
//     // =========================

//     if (req.file.size > 5 * 1024 * 1024) {
//       return res.status(400).json({
//         success: false,
//         message: "Resume size must be less than 5 MB.",
//       });
//     }

//     // =========================
//     // Validate file type
//     // =========================

//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (!allowedTypes.includes(req.file.mimetype)) {
//       return res.status(400).json({
//         success: false,
//         message: "Only PDF, DOC and DOCX resumes are allowed.",
//       });
//     }

//     // =========================
//     // Find Job
//     // =========================

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found.",
//       });
//     }

//     // =========================
//     // Clean email
//     // =========================

//     const candidateEmail = email.trim().toLowerCase();

//     // =========================
//     // Check duplicate application
//     // =========================

//     const alreadyApplied = await JobApplication.findOne({
//       job: jobId,
//       candidateEmail,
//     });

//     if (alreadyApplied) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already applied for this job.",
//       });
//     }

//     // =========================
//     // Upload Resume
//     // =========================

//     const uploadResult = await uploadResumeToCloudinary(
//       req.file
//     );

//     // =========================
//     // Create Application
//     // =========================

//     const application = await JobApplication.create({
//       job: jobId,

//       candidate: null,

//       candidateName: name.trim(),

//       candidateEmail,

//       candidatePhone: phone.trim(),

//       experience: experience?.trim() || "",

//       resumeUrl: uploadResult.secure_url,

//       resumePublicId: uploadResult.public_id,

//       coverLetter: coverLetter?.trim() || "",

//       status: "Pending",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Application submitted successfully.",
//       applicationId: application._id,
//     });

//   } catch (error) {
//     console.error("Apply Job Error:", error);

//     // Mongo duplicate error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already applied for this job.",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // =========================
// // Get All Applications
// // =========================

// exports.getAllApplications = async (req, res) => {
//   try {
//     const applications = await JobApplication.find()
//       .populate(
//         "candidate",
//         "name email phone resume education experience skills city state profileImage"
//       )
//       .populate(
//         "job",
//         "jobTitle companyName city state salaryMin salaryMax"
//       )
//       .sort({ createdAt: -1 });

//     console.log(
//       JSON.stringify(applications, null, 2)
//     );

//     res.status(200).json({
//       success: true,
//       totalApplications: applications.length,
//       applications,
//     });

//   } catch (error) {
//     console.error(
//       "Get Applications Error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const JobApplication = require("../models/JobApplicationModel");
const cloudinary = require("../config/cloudinary");
const transporter = require("../config/mailer");

// =========================
// Upload Resume to Cloudinary
// =========================

const uploadResumeToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "techby/applications/resumes",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// =========================
// Send Application Email
// =========================

const sendApplicationConfirmationEmail = async ({
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
}) => {
  try {
    await transporter.sendMail({
      from: `"TechBy Consultancy Services" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,

      subject: `Application Received - ${jobTitle}`,

      text: `
Hi ${candidateName},

Your application has been successfully received through TechBy.

Job: ${jobTitle}
Company: ${companyName}

Application Status: Pending

Your application has been submitted successfully. If the employer shortlists you for the next step, you will be contacted accordingly.

Thank you for applying through TechBy Consultancy Services.

Best regards,
TechBy Team
https://techby.in
      `,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">

          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="margin: 0; color: #10b981;">
              TechBy
            </h1>

            <p style="margin-top: 5px; color: #666;">
              TechBy Consultancy Services
            </p>
          </div>

          <h2 style="color: #222;">
            Application Received ✅
          </h2>

          <p>
            Hi <strong>${candidateName}</strong>,
          </p>

          <p>
            Your application has been successfully received through
            <strong>TechBy</strong>.
          </p>

          <div style="
            background: #f5f5f5;
            padding: 18px;
            border-radius: 8px;
            margin: 20px 0;
          ">

            <p style="margin: 6px 0;">
              <strong>Job:</strong> ${jobTitle}
            </p>

            <p style="margin: 6px 0;">
              <strong>Company:</strong> ${companyName}
            </p>

            <p style="margin: 6px 0;">
              <strong>Status:</strong>
              <span style="color: #f59e0b;">
                Pending
              </span>
            </p>

          </div>

          <p>
            Your application has been submitted successfully.
            If the employer shortlists you for the next step,
            you will be contacted accordingly.
          </p>

          <p>
            Thank you for applying through
            <strong>TechBy Consultancy Services</strong>.
          </p>

          <div style="
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #777;
            font-size: 13px;
          ">

            <p>
              Best regards,<br />
              <strong>TechBy Team</strong>
            </p>

            <p>
              <a
                href="https://techby.in"
                style="color: #10b981; text-decoration: none;"
              >
                techby.in
              </a>
            </p>

          </div>

        </div>
      `,
    });

    console.log(
      `Application confirmation email sent to ${candidateEmail}`
    );

    return true;

  } catch (error) {
    console.error(
      "Application confirmation email failed:",
      error.message
    );

    return false;
  }
};

// =========================
// Apply Job
// =========================

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const {
      name,
      email,
      phone,
      experience,
      coverLetter,
    } = req.body;

    // =========================
    // Validate basic details
    // =========================

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required.",
      });
    }

    // =========================
    // Validate resume
    // =========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume.",
      });
    }

    // =========================
    // Validate resume size
    // =========================

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume size must be less than 5 MB.",
      });
    }

    // =========================
    // Validate file type
    // =========================

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF, DOC and DOCX resumes are allowed.",
      });
    }

    // =========================
    // Find Job
    // =========================

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // =========================
    // Clean email
    // =========================

    const candidateEmail = email.trim().toLowerCase();

    // =========================
    // Check duplicate application
    // =========================

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      candidateEmail,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // =========================
    // Upload Resume
    // =========================

    const uploadResult = await uploadResumeToCloudinary(
      req.file
    );

    // =========================
    // Create Application
    // =========================

    const application = await JobApplication.create({
      job: jobId,

      candidate: null,

      candidateName: name.trim(),

      candidateEmail,

      candidatePhone: phone.trim(),

      experience: experience?.trim() || "",

      resumeUrl: uploadResult.secure_url,

      resumePublicId: uploadResult.public_id,

      coverLetter: coverLetter?.trim() || "",

      status: "Pending",
    });

    // =========================
    // Send Confirmation Email
    // =========================

    // Email failure will NOT fail the application.
    await sendApplicationConfirmationEmail({
      candidateName: name.trim(),
      candidateEmail,
      jobTitle: job.jobTitle || "Job",
      companyName: job.companyName || "Company",
    });

    // =========================
    // Success Response
    // =========================

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: application._id,
    });

  } catch (error) {
    console.error(
      "Apply Job Error:",
      error
    );

    // Mongo duplicate error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Applications
// =========================

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate(
        "candidate",
        "name email phone resume education experience skills city state profileImage"
      )
      .populate(
        "job",
        "jobTitle companyName city state salaryMin salaryMax"
      )
      .sort({ createdAt: -1 });

    console.log(
      JSON.stringify(applications, null, 2)
    );

    res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });

  } catch (error) {
    console.error(
      "Get Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
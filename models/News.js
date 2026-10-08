// const mongoose = require("mongoose");

// const newsSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 250,
//     },

//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       trim: true,
//     },

//     excerpt: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 500,
//     },
//     applyLink: {
//   type: String,
//   default: "",
// },

//     content: {
//       type: String,
//       required: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       enum: [
//         "IT Jobs",
//         "Government Jobs",
//         "Hiring News",
//         "Career Tips",
//         "Internships",
//         "Private Jobs",
//         "Tech News",
//         "Education",
//         "Other",
//       ],
//       index: true,
//     },

//     image: {
//       type: String,
//       default: "",
//     },

//     author: {
//       type: String,
//       default: "TechBy",
//       trim: true,
//     },

//     readTime: {
//       type: String,
//       default: "5 min",
//     },

//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "draft",
//       index: true,
//     },

//     featured: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     views: {
//       type: Number,
//       default: 0,
//       min: 0,
//       index: true,
//     },

//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     seoTitle: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 250,
//     },

//     seoDescription: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 500,
//     },
//     pdfUrl: {
//   type: String,
//   default: "",
// },

// pdfPublicId: {
//   type: String,
//   default: "",
// },

//     publishedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /*
//   Automatically set publishedAt when status becomes published.
// */
// newsSchema.pre("save", function (next) {
//   if (this.status === "published" && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }

//   if (this.status === "draft") {
//     this.publishedAt = null;
//   }

//   next();
// });

// module.exports = mongoose.model("News", newsSchema);


const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    // ==========================================
    // TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    // ==========================================
    // SLUG
    // ==========================================

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // ==========================================
    // EXCERPT
    // ==========================================

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // ==========================================
    // OFFICIAL APPLY LINK
    // ==========================================

    applyLink: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // CONTENT
    // ==========================================

    content: {
      type: String,
      required: true,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,

      enum: [
        // Existing TechBy categories
        "IT Jobs",
        "Government Jobs",
        "Hiring News",
        "Career Tips",
        "Internships",
        "Private Jobs",
        "Tech News",
        "Education",
        "Other",

        // Government News categories
        "SSC",
        "UPSC",
        "Railway",
        "Banking",
        "Defence",
        "Police",
        "Teaching",
        "State Government",
        "Admit Card",
        "Results",
        "Answer Key",
        "Exam Updates",
        "Scholarship",
      ],

      index: true,
    },

    // ==========================================
    // CLOUDINARY COVER IMAGE
    // ==========================================

    image: {
      type: String,
      default: "",
    },

    // Cloudinary public ID
    // Used later if we want to replace/delete
    // the image from Cloudinary.

    imagePublicId: {
      type: String,
      default: "",
    },

    // ==========================================
    // AUTHOR
    // ==========================================

    author: {
      type: String,
      default: "TechBy",
      trim: true,
    },

    // ==========================================
    // READ TIME
    // ==========================================

    readTime: {
      type: String,
      default: "5 min",
      trim: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    // ==========================================
    // FEATURED
    // ==========================================

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ==========================================
    // VIEWS
    // ==========================================

    views: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    // ==========================================
    // TAGS
    // ==========================================

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // SEO TITLE
    // ==========================================

    seoTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    // ==========================================
    // SEO DESCRIPTION
    // ==========================================

    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ==========================================
    // OFFICIAL NOTIFICATION PDF
    // ==========================================

    pdfUrl: {
      type: String,
      default: "",
    },

    // Cloudinary PDF public ID

    pdfPublicId: {
      type: String,
      default: "",
    },

    // ==========================================
    // PUBLISHED DATE
    // ==========================================

    publishedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// PUBLISHED DATE AUTOMATION
// ==========================================

newsSchema.pre("save", function (next) {
  // If publishing for the first time
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // If changed back to draft
  if (this.status === "draft") {
    this.publishedAt = null;
  }

  next();
});

module.exports = mongoose.model("News", newsSchema);
const News = require("../models/News");
const createSlug = require("../utility/createSlug");
const {
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
} = require("../config/cloudinary");

/*
========================================================
CREATE UNIQUE SLUG
========================================================
*/

const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = createSlug(title);

  if (!baseSlug) {
    baseSlug = `news-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingNews = await News.findOne(query);

    if (!existingNews) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/*
========================================================
CREATE NEWS
========================================================
*/



// exports.createNews = async (req, res) => {
//   try {
//     const {
//       title,
//       excerpt,
//       content,
//       category,
//       image,
//       author,
//       readTime,
//       status,
//       featured,
//       tags,
//       seoTitle,
//       seoDescription,
//     } = req.body;

//     if (!title || !excerpt || !content || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, excerpt, content and category are required",
//       });
//     }

//     const slug = await generateUniqueSlug(title);

//     const news = await News.create({
//       title,
//       slug,
//       excerpt,
//       content,
//       category,
//       image: image || "",
//       author: author || "TechBy",
//       readTime: readTime || "5 min",
//       status: status || "draft",
//       featured: Boolean(featured),
//       tags: Array.isArray(tags) ? tags : [],
//       seoTitle: seoTitle || title,
//       seoDescription: seoDescription || excerpt,
//       publishedAt:
//         status === "published"
//           ? new Date()
//           : null,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "News created successfully",
//       news,
//     });
//   } catch (error) {
//     console.error("Create news error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create news",
//       error: error.message,
//     });
//   }
// };


exports.createNews = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      author,
      readTime,
      status,
      featured,
      tags,
      seoTitle,
      seoDescription,
      applyLink,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Title, excerpt, content and category are required",
      });
    }

    // ==========================================
    // IMAGE REQUIRED
    // ==========================================

    const imageFile = req.files?.image?.[0];

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required",
      });
    }

    // ==========================================
    // GENERATE SLUG
    // ==========================================

    const slug = await generateUniqueSlug(title);

    // ==========================================
    // UPLOAD IMAGE
    // ==========================================

    let imageUrl = "";
    let imagePublicId = "";

    try {
      const imageResult =
        await uploadImageToCloudinary(
          imageFile.buffer,
          imageFile.originalname
        );

      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;

    } catch (uploadError) {
      console.error(
        "Image Cloudinary upload error:",
        uploadError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to upload cover image",
      });
    }

    // ==========================================
    // UPLOAD PDF
    // ==========================================

    let pdfUrl = "";
    let pdfPublicId = "";

    const pdfFile = req.files?.pdf?.[0];

    if (pdfFile) {
      try {
        const result =
          await uploadPdfToCloudinary(
            pdfFile.buffer,
            pdfFile.originalname
          );

        pdfUrl = result.secure_url;
        pdfPublicId = result.public_id;

      } catch (uploadError) {
        console.error(
          "PDF Cloudinary upload error:",
          uploadError
        );

        return res.status(500).json({
          success: false,
          message: "Failed to upload PDF",
        });
      }
    }

    // ==========================================
    // PARSE TAGS
    // ==========================================

    let parsedTags = [];

    if (tags) {
      try {
        parsedTags = JSON.parse(tags);

        if (!Array.isArray(parsedTags)) {
          parsedTags = [];
        }
      } catch (error) {
        parsedTags = [];
      }
    }

    // ==========================================
    // CREATE NEWS
    // ==========================================

    const news = await News.create({
      title: title.trim(),

      slug,

      excerpt: excerpt.trim(),

      content,

      category,

      image: imageUrl,

      imagePublicId,

      author:
        author?.trim() || "TechBy",

      readTime:
        readTime?.trim() || "5 min",

      status:
        status || "draft",

      featured:
        featured === true ||
        featured === "true",

      tags: parsedTags,

      seoTitle:
        seoTitle?.trim() || title.trim(),

      seoDescription:
        seoDescription?.trim() ||
        excerpt.trim(),

      applyLink:
        applyLink?.trim() || "",

      pdfUrl,

      pdfPublicId,

      publishedAt:
        status === "published"
          ? new Date()
          : null,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message:
        "News created successfully",

      news,
    });

  } catch (error) {
    console.error(
      "Create news error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create news",

      error:
        error.message,
    });
  }
};

/*
========================================================
GET ALL PUBLISHED NEWS
========================================================

GET /api/news

Examples:

/api/news?page=1&limit=10

/api/news?category=IT%20Jobs

/api/news?search=react

/api/news?featured=true

*/

exports.getAllNews = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const { category, search, featured } = req.query;

    const query = {
      status: "published",
    };

    if (category && category !== "All News") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [news, total] = await Promise.all([
      News.find(query)
        .sort({
          publishedAt: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      News.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,

      data: news,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};

/*
========================================================
GET SINGLE NEWS BY SLUG
========================================================

GET /api/news/slug/latest-it-jobs-for-freshers
========================================================
*/

exports.getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      slug,
      status: "published",
    }).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Get news by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};

/*
========================================================
INCREMENT NEWS VIEWS
========================================================

PATCH /api/news/:id/view
========================================================
*/

exports.incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findOneAndUpdate(
      {
        _id: id,
        status: "published",
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    ).select("views");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      views: news.views,
    });
  } catch (error) {
    console.error("Increment views error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update views",
    });
  }
};

/*
========================================================
GET TRENDING NEWS
========================================================

GET /api/news/trending
========================================================
*/

exports.getTrendingNews = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 5, 1),
      20
    );

    const news = await News.find({
      status: "published",
    })
      .sort({
        views: -1,
        publishedAt: -1,
      })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Trending news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending news",
    });
  }
};

/*
========================================================
GET FEATURED NEWS
========================================================

GET /api/news/featured
========================================================
*/

exports.getFeaturedNews = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 5, 1),
      20
    );

    const news = await News.find({
      status: "published",
      featured: true,
    })
      .sort({
        publishedAt: -1,
      })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Featured news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured news",
    });
  }
};

/*
========================================================
ADMIN - GET ALL NEWS
========================================================

Includes drafts + published.
========================================================
*/

exports.adminGetAllNews = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const { status, category, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [news, total] = await Promise.all([
      News.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      News.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,

      data: news,

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Admin get news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin news",
    });
  }
};

/*
========================================================
ADMIN - GET NEWS BY ID
========================================================
*/

exports.adminGetNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Admin get news by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

/*
========================================================
ADMIN - UPDATE NEWS
========================================================
*/

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const existingNews = await News.findById(id);

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      image,
      author,
      readTime,
      status,
      featured,
      tags,
      seoTitle,
      seoDescription,
    } = req.body;

    let slug = existingNews.slug;

    /*
      Only regenerate slug when title changes.
    */
    if (title && title !== existingNews.title) {
      slug = await generateUniqueSlug(title, id);
    }

    /*
      If changing status to published,
      set publishedAt.
    */
    let publishedAt = existingNews.publishedAt;

    if (status === "published" && existingNews.status !== "published") {
      publishedAt = new Date();
    }

    if (status === "draft") {
      publishedAt = null;
    }

    existingNews.title = title ?? existingNews.title;
    existingNews.slug = slug;
    existingNews.excerpt = excerpt ?? existingNews.excerpt;
    existingNews.content = content ?? existingNews.content;
    existingNews.category = category ?? existingNews.category;
    existingNews.image = image ?? existingNews.image;
    existingNews.author = author ?? existingNews.author;
    existingNews.readTime = readTime ?? existingNews.readTime;
    existingNews.status = status ?? existingNews.status;
    existingNews.featured =
      featured !== undefined
        ? Boolean(featured)
        : existingNews.featured;

    existingNews.tags =
      Array.isArray(tags)
        ? tags
        : existingNews.tags;

    existingNews.seoTitle =
      seoTitle ?? existingNews.seoTitle;

    existingNews.seoDescription =
      seoDescription ?? existingNews.seoDescription;

    existingNews.publishedAt = publishedAt;

    await existingNews.save();

    return res.status(200).json({
      success: true,
      message: "News updated successfully",
      news: existingNews,
    });
  } catch (error) {
    console.error("Update news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update news",
      error: error.message,
    });
  }
};

/*
========================================================
ADMIN - DELETE NEWS
========================================================
*/

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete news",
    });
  }
};

/*
========================================================
ADMIN - PUBLISH NEWS
========================================================
*/

exports.publishNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      {
        status: "published",
        publishedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News published successfully",
      news,
    });
  } catch (error) {
    console.error("Publish news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish news",
    });
  }
};

/*
========================================================
ADMIN - UNPUBLISH NEWS
========================================================
*/

exports.unpublishNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      {
        status: "draft",
        publishedAt: null,
      },
      {
        new: true,
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News moved to draft",
      news,
    });
  } catch (error) {
    console.error("Unpublish news error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish news",
    });
  }
};
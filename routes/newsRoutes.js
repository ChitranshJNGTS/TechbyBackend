const express = require("express");

const router = express.Router();

const {
  createNews,
  getAllNews,
  getNewsBySlug,
  incrementViews,
  getTrendingNews,
  getFeaturedNews,

  adminGetAllNews,
  adminGetNewsById,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews,
} = require("../controllers/newsController");

const adminAuth = require("../middleware/adminMiddleware");


/*
========================================================
PUBLIC ROUTES
========================================================
*/

/*
GET /api/news
*/
router.get("/", getAllNews);


/*
GET /api/news/trending
*/
router.get("/trending", getTrendingNews);


/*
GET /api/news/featured
*/
router.get("/featured", getFeaturedNews);


/*
PATCH /api/news/:id/view
*/
router.patch("/:id/view", incrementViews);


/*
GET /api/news/slug/:slug
*/
router.get("/:slug", getNewsBySlug);


/*
========================================================
ADMIN ROUTES
========================================================
*/

/*
GET /api/news/admin/all
*/
router.get(
  "/admin/all",
  adminAuth,
  adminGetAllNews
);


/*
GET /api/news/admin/:id
*/
router.get(
  "/admin/:id",
  adminAuth,
  adminGetNewsById
);


/*
POST /api/news/admin/create
*/
router.post(
  "/admin/create",
  adminAuth,
  createNews
);


/*
PUT /api/news/admin/:id
*/
router.put(
  "/admin/:id",
  adminAuth,
  updateNews
);


/*
DELETE /api/news/admin/:id
*/
router.delete(
  "/admin/:id",
  adminAuth,
  deleteNews
);


/*
PATCH /api/news/admin/:id/publish
*/
router.patch(
  "/admin/:id/publish",
  adminAuth,
  publishNews
);


/*
PATCH /api/news/admin/:id/unpublish
*/
router.patch(
  "/admin/:id/unpublish",
  adminAuth,
  unpublishNews
);


module.exports = router;
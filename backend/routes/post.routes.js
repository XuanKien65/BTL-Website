const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { verifyToken, isAuthor, isAdmin } = require("../middlewares/authJwt");
const upload = require("../middlewares/upload");

// ===== Public Routes =====
router.get("/", postController.getAllPosts); // Get all posts (with pagination/filter)
router.get("/search", postController.searchPosts); // Search posts
router.get("/:id", postController.getPostById); // Get post by id

// ===== Protected Routes =====
router.post(
  "/",
  [verifyToken, isAuthor, upload.single("featuredImage")],
  postController.createPost
);
router.put("/:id", verifyToken, isAdmin, postController.updatePost); // Update post
router.delete("/:id", verifyToken, isAdmin, postController.deletePost); // Delete post
router.put("/:id/approve", verifyToken, isAdmin, postController.approvePost); // Approve (publish) post
router.put("/:id/reject", verifyToken, isAdmin, postController.rejectPost); // Reject post

module.exports = router;

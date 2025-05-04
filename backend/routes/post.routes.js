const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const {
  verifyToken,
  isAuthor,
  isAdmin,
  isAuthorOrAdmin,
} = require("../middlewares/authJwt");
const upload = require("../middlewares/upload");

// ===== Public Routes =====
router.get("/", postController.getAllPosts);
router.get("/search", postController.searchPosts); // Search posts
router.get("/latest", postController.getLatestPosts);
router.get("/id/:id", postController.getPostById); // Get post by id
router.get("/:slug", postController.getPostBySlug);

// ===== Protected Routes =====
router.post(
  "/",
  [verifyToken, isAuthorOrAdmin, upload.single("featuredImage")],
  postController.createPost
);
router.put("/:id", verifyToken, isAdmin, postController.updatePost); // Update post
router.delete("/:id", verifyToken, isAdmin, postController.deletePost); // Delete post
router.put("/:id/approve", verifyToken, isAdmin, postController.approvePost); // Approve (publish) post
router.put("/:id/reject", verifyToken, isAdmin, postController.rejectPost); // Reject post
router.put(
  "/:id/unapprove",
  verifyToken,
  isAdmin,
  postController.unapprovePost
);
router.post("/:postId/view", verifyToken, postController.increaseView);
router.get("/author/:authorid", verifyToken, postController.getPostsByAuthor);
router.get("/related/:id", postController.getRelatedByParentCategory);
router.get("/by-parent/:id", postController.getByParentCategory);

module.exports = router;

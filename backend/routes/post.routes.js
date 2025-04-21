const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { verifyToken, isAuthor, isAdmin } = require("../middlewares/authJwt");

// Public routes
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);

// Protected routes
router.post("/", [verifyToken, isAuthor], postController.createPost);
router.put("/:id", [verifyToken, isAdmin], postController.updatePost);
router.delete("/:id", [verifyToken, isAdmin], postController.deletePost);
router.put("/:id/approve", [verifyToken, isAdmin], postController.approvePost);
router.put("/:id/reject", [verifyToken, isAdmin], postController.rejectPost);

module.exports = router;

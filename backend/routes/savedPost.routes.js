const express = require("express");
const router = express.Router();
const savedPostController = require("../controllers/savedPost.controller");
const { verifyToken } = require("../middlewares/authJwt"); // Middleware kiểm tra đăng nhập

// Lưu bài viết
router.post("/save/:postId", verifyToken, savedPostController.savePost);

// Lấy danh sách bài viết đã lưu
router.get("/saved", verifyToken, savedPostController.getSavedPosts);

// Gỡ lưu bài viết
router.delete("/unsave/:postId", verifyToken, savedPostController.unsavePost);

module.exports = router;

const SavedPost = require("../models/savedPost.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

// Lưu bài viết
exports.savePost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return next(new ErrorHandler(400, "Invalid post ID"));
    }

    await SavedPost.save(userId, postId);
    ApiResponse.success(res, "Post saved successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error saving post", error));
  }
};

// Lấy danh sách bài viết đã lưu
exports.getSavedPosts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const posts = await SavedPost.findByUser(userId);
    ApiResponse.success(res, "Saved posts retrieved successfully", posts);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving saved posts", error));
  }
};

// Gỡ lưu bài viết
exports.unsavePost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return next(new ErrorHandler(400, "Invalid post ID"));
    }

    await SavedPost.remove(userId, postId);
    ApiResponse.success(res, "Post unsaved successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error unsaving post", error));
  }
};

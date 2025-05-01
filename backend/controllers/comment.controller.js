const Comment = require("../models/comment.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllComments = async (req, res, next) => {
  try {
    const { postId, status } = req.query;
    const comments = await Comment.findAll(
      postId ? parseInt(postId) : null,
      status
    );
    ApiResponse.success(res, "Comments retrieved successfully", comments);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving comments", error));
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(new ErrorHandler(404, "Comment not found"));
    }
    ApiResponse.success(res, "Comment retrieved successfully", comment);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving comment", error));
  }
};

exports.getCommentsByPostId = async (req, res, next) => {
  try {
    const comments = await Comment.findByPostId(req.params.postId);
    ApiResponse.success(res, "Comments retrieved successfully", comments);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving comments", error));
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, parentId, replyingTo } = req.body;

    const newComment = await Comment.create({
      content,
      postId,
      userId: req.userId || null,
      authorIp: req.ip,
      parentId,
      replyingTo,
      status: "pending",
    });

    ApiResponse.created(res, "Comment created successfully", newComment);
  } catch (error) {
    next(new ErrorHandler(500, "Error creating comment", error));
  }
};

const updateCommentStatus = async (req, res, next, status) => {
  try {
    const updatedComment = await Comment.updateStatus(req.params.id, status);
    if (!updatedComment) {
      return next(new ErrorHandler(404, "Comment not found"));
    }
    ApiResponse.success(res, `Comment ${status} successfully`, updatedComment);
  } catch (error) {
    next(new ErrorHandler(500, `Error ${status} comment`, error));
  }
};

exports.approveComment = (req, res, next) =>
  updateCommentStatus(req, res, next, "approved");

exports.rejectComment = (req, res, next) =>
  updateCommentStatus(req, res, next, "reject");

exports.deleteComment = async (req, res, next) => {
  try {
    const deleted = await Comment.delete(req.params.id);
    if (!deleted) {
      return next(new ErrorHandler(404, "Comment not found"));
    }
    ApiResponse.success(res, "Comment deleted successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error deleting comment", error));
  }
};

exports.updateScore = async (req, res, next) => {
  try {
    const { delta } = req.body; // Lấy delta từ body (ví dụ: 1 hoặc -1)
    const commentId = parseInt(req.params.id);

    if (!delta || ![1, -1].includes(delta)) {
      return next(
        new ErrorHandler(400, "Invalid delta value (must be 1 or -1)")
      );
    }
    const updated = await Comment.updateScore(commentId, delta);
    if (!updated) {
      return next(new ErrorHandler(404, "Comment not found"));
    }

    ApiResponse.success(res, "Comment score updated successfully", updated);
  } catch (error) {
    next(new ErrorHandler(500, "Error updating comment score", error));
  }
};
exports.getCommentsByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const comments = await Comment.findByUserId(userId);
    ApiResponse.success(res, "Comments retrieved successfully", comments);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving user comments", error));
  }
};

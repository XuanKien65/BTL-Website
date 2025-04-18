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

exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, authorName, authorEmail, parentId } = req.body;
    const newComment = await Comment.create({
      content,
      postId,
      userId: req.userId || null,
      authorName,
      authorEmail,
      authorIp: req.ip,
      parentId,
    });
    ApiResponse.created(res, "Comment created successfully", newComment);
  } catch (error) {
    next(new ErrorHandler(500, "Error creating comment", error));
  }
};

exports.approveComment = async (req, res, next) => {
  try {
    const updatedComment = await Comment.updateStatus(
      req.params.id,
      "approved"
    );
    if (!updatedComment) {
      return next(new ErrorHandler(404, "Comment not found"));
    }
    ApiResponse.success(res, "Comment approved successfully", updatedComment);
  } catch (error) {
    next(new ErrorHandler(500, "Error approving comment", error));
  }
};

exports.rejectComment = async (req, res, next) => {
  try {
    const updatedComment = await Comment.updateStatus(
      req.params.id,
      "rejected"
    );
    if (!updatedComment) {
      return next(new ErrorHandler(404, "Comment not found"));
    }
    ApiResponse.success(res, "Comment rejected successfully", updatedComment);
  } catch (error) {
    next(new ErrorHandler(500, "Error rejecting comment", error));
  }
};

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

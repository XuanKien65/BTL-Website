const Post = require("../models/post.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status, categoryId, search } = req.query;

    const posts = await Post.findAll(
      parseInt(page),
      parseInt(pageSize),
      status,
      categoryId ? parseInt(categoryId) : null,
      search
    );

    const totalPosts = await Post.count(
      status,
      categoryId ? parseInt(categoryId) : null,
      search
    );

    ApiResponse.success(res, "Posts retrieved successfully", {
      posts,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    });
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving posts", error));
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler(404, "Post not found"));
    }
    ApiResponse.success(res, "Post retrieved successfully", post);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving post", error));
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, categoryId, status, excerpt } = req.body;
    const newPost = await Post.create({
      title,
      content,
      authorId: req.userId,
      categoryId,
      status: status || "draft",
      excerpt,
    });
    ApiResponse.created(res, "Post created successfully", newPost);
  } catch (error) {
    next(new ErrorHandler(500, "Error creating post", error));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, categoryId, status, excerpt } = req.body;
    const updatedPost = await Post.update(req.params.id, {
      title,
      content,
      categoryId,
      status,
      excerpt,
    });

    if (!updatedPost) {
      return next(new ErrorHandler(404, "Post not found"));
    }

    ApiResponse.success(res, "Post updated successfully", updatedPost);
  } catch (error) {
    next(new ErrorHandler(500, "Error updating post", error));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.delete(req.params.id);
    if (!deleted) {
      return next(new ErrorHandler(404, "Post not found"));
    }
    ApiResponse.success(res, "Post deleted successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error deleting post", error));
  }
};

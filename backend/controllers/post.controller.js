const Post = require("../models/post.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");
const slugify = require("../utils/slugify");

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

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findBySlug(req.params.slug);
    if (!post) {
      return next(new ErrowHandler(404, "post not found"));
    }
    ApiResponse.success(res, "post retrieved successfully", post);
  } catch (error) {
    next(new ErrorHandler(500, "error retrieving post", error));
  }
};
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, categoryIds, tags, status, excerpt, isFeatured } =
      req.body;

    const slug = slugify(title);
    const featuredImage = req.file ? `/uploads/${req.file.filename}` : null; // lấy ảnh từ multer upload
    const safeStatus = (status || "pending").toLowerCase(); // luôn là string chuẩn

    // Trong controller
    const newPost = await Post.create({
      title,
      slug,
      content,
      authorId: req.userId,
      categoryIds: Array.isArray(categoryIds) ? categoryIds : [categoryIds],
      tagNames: Array.isArray(tags) ? tags : [tags], // chú ý: TAG NAMES
      excerpt,
      featuredImage,
      isFeatured: isFeatured || false,
      status: safeStatus,
    });

    ApiResponse.created(res, "Post created successfully", newPost);
  } catch (error) {
    next(new ErrorHandler(500, "Error creating post", error));
  }
};

exports.increaseView = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return next(new ErrorHandler(400, "Invalid post ID"));
    }

    await Post.recordView(userId, postId);

    ApiResponse.success(res, "View recorded successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error recording view", error));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      categoryIds,
      tagIds,
      status,
      excerpt,
      featuredImage,
      isFeatured,
    } = req.body;
    const slug = slugify(title);

    const updatedPost = await Post.update(req.params.id, {
      title,
      slug,
      content,
      categoryIds,
      tagIds,
      excerpt,
      featuredImage,
      isFeatured: isFeatured || false,
      status,
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

exports.approvePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler(404, "Post not found"));

    const updatedPost = await Post.update(req.params.id, {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredimage,
      isFeatured: post.is_featured,
      status: "published",
      categoryIds: post.categories || [],
      tagIds: post.tags || [],
    });

    ApiResponse.success(res, "Post approved and published", updatedPost);
  } catch (error) {
    next(new ErrorHandler(500, "Error approving post", error));
  }
};

exports.rejectPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorHandler(404, "Post not found"));

    const updatedPost = await Post.update(req.params.id, {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredimage,
      isFeatured: post.is_featured,
      status: "rejected",
      categoryIds: post.categories || [],
      tagIds: post.tags || [],
    });

    ApiResponse.success(res, "Post rejected", updatedPost);
  } catch (error) {
    next(new ErrorHandler(500, "Error rejecting post", error));
  }
};

exports.searchPosts = async (req, res, next) => {
  try {
    const {
      keyword,
      tag,
      categoryName,
      status = "published",
      fromDate,
      toDate,
      sortBy = "newest",
      page = 1,
      pageSize = 12,
    } = req.query;

    const results = await Post.searchWithFilters({
      keyword,
      tag,
      categoryName,
      status,
      fromDate,
      toDate,
      sortBy,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    const totalResults = await Post.countSearchResults({
      keyword,
      tag,
      categoryName,
      status,
      fromDate,
      toDate,
    });

    ApiResponse.success(res, "Posts retrieved successfully", {
      posts: results,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: totalResults,
        totalPages: Math.ceil(totalResults / pageSize),
      },
    });
  } catch (error) {
    next(new ErrorHandler(500, "Error searching posts", error));
  }
};
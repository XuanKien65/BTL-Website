const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");
const Comment = require("../models/comment.model");

const verifyToken = (req, res, next) => {
  // Try to get token from different sources
  let token = req.headers["authorization"];

  if (!token) {
    console.warn("No token provided for route:", req.originalUrl);
    return next(new ErrorHandler(403, "Access denied. No token provided."));
  }

  // Remove 'Bearer ' prefix if present
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // cắt bỏ "Bearer "
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return next(new ErrorHandler(401, "Invalid or expired token"));
    }

    try {
      const user = await User.findById(decoded.id);
      console.error("User object from DB:", decoded.id);
      if (!user) {
        console.error("User not found for ID:", decoded.id);
        return next(new ErrorHandler(404, "User not found"));
      }

      req.userId = user.userid;
      req.userRole = user.role;
      console.log(`Authenticated user: ${user.userid} with role: ${user.role}`);
      next();
    } catch (error) {
      console.error("Error during token verification:", error);
      next(
        new ErrorHandler(500, "Internal server error during authentication")
      );
    }
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return next(new ErrorHandler(403, "Require Admin Role"));
  }
  next();
};
const isAuthor = (req, res, next) => {
  if (req.userRole !== "author") {
    return next(new ErrorHandler(403, "Require Author Role"));
  }
  next();
};
const isAuthorOrAdmin = (req, res, next) => {
  if (!["author", "admin"].includes(req.userRole)) {
    return next(new ErrorHandler(403, "Require Editor or Admin Role"));
  }
  next();
};
const isOwner = async (req, res, next) => {
  try {
    const loggedInUserId = parseInt(req.userId);
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return next(new ErrorHandler(400, "Thiếu hoặc sai comment ID trong URL"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new ErrorHandler(404, "Không tìm thấy comment"));
    }

    if (comment.userid !== loggedInUserId) {
      return next(
        new ErrorHandler(403, "Không có quyền thực hiện hành động này")
      );
    }

    next();
  } catch (error) {
    console.error("Lỗi trong isOwner:", error);
    next(new ErrorHandler(500, "Lỗi xác thực quyền sở hữu"));
  }
};
const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    if (userRole === "admin") return next();

    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      return next(new ErrorHandler(400, "ID comment không hợp lệ"));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new ErrorHandler(404, "Comment không tồn tại"));
    }

    if (comment.userid !== userId) {
      return next(new ErrorHandler(403, "Bạn không có quyền xóa comment này"));
    }

    next();
  } catch (error) {
    console.error("🔥 Lỗi trong isOwnerOrAdmin:", error);
    next(new ErrorHandler(500, "Lỗi xác thực quyền truy cập"));
  }
};
module.exports = {
  verifyToken,
  isAdmin,
  isAuthor,
  isAuthorOrAdmin,
  isOwner,
  isOwnerOrAdmin,
};

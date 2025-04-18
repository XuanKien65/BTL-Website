const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");

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

const isEditorOrAdmin = (req, res, next) => {
  if (!["editor", "admin"].includes(req.userRole)) {
    return next(new ErrorHandler(403, "Require Editor or Admin Role"));
  }
  next();
};

module.exports = { verifyToken, isAdmin, isEditorOrAdmin };

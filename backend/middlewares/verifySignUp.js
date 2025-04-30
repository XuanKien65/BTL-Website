const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check username
    const userByUsername = await User.findByUsername(req.body.username);
    if (userByUsername) {
      return next(new ErrorHandler(400, "Username is already in use"));
    }

    // Check email
    const userByEmail = await User.findByEmail(req.body.email);
    if (userByEmail) {
      return next(new ErrorHandler(400, "Email is already in use"));
    }

    next();
  } catch (error) {
    next(new ErrorHandler(500, "Error checking duplicate user", error));
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.role) {
    const validRoles = ["user", "editor", "admin"];
    if (!validRoles.includes(req.body.role)) {
      return next(
        new ErrorHandler(400, `Role ${req.body.role} does not exist`)
      );
    }
  }
  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

const User = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    ApiResponse.success(res, "Users retrieved successfully", users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    next(new ErrorHandler(500, "Error retrieving users", error));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }
    ApiResponse.success(res, "User retrieved successfully", user);
  } catch (error) {
    next(new ErrorHandler(500, "Error retrieving user", error));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    ApiResponse.created(res, "User created successfully", newUser);
  } catch (error) {
    if (error.code === "23505") {
      return next(new ErrorHandler(400, "Username or email already exists"));
    }
    next(new ErrorHandler(500, "Error creating user", error));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    if (!updatedUser) {
      return next(new ErrorHandler(404, "User not found"));
    }
    ApiResponse.success(res, "User updated successfully", updatedUser);
  } catch (error) {
    next(new ErrorHandler(500, "Error updating user", error));
  }
};

exports.updatePassword = async (req, res, next) => {
  const { newPassword } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    const updatePassword = await User.updatePassword(
      req.params.id,
      hashedPassword
    );
    if (!updatePassword) {
      return next(new ErrorHandler(404, "user not found"));
    }
    ApiResponse.success(res, "change password successfully", updatePassword);
  } catch (error) {
    next(new ErrorHandler(500, "error change password", error));
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return next(new ErrorHandler(404, "User not found"));
    }
    ApiResponse.success(res, "User deleted successfully");
  } catch (error) {
    next(new ErrorHandler(500, "Error deleting user", error));
  }
};

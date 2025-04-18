const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    ApiResponse.created(res, "User registered successfully", {
      id: user.userid, // Changed from UserID to userid (PostgreSQL naming convention)
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL duplicate key error code
      return next(new ErrorHandler(400, "Username or email already exists"));
    }
    next(new ErrorHandler(500, "Registration failed", error));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.passwordhash); // Changed from PasswordHash to passwordhash
    if (!passwordIsValid) {
      return next(new ErrorHandler(401, "Invalid password"));
    }

    // Create token
    const token = jwt.sign(
      { id: user.userid, role: user.role },
      process.env.JWT_SECRET,

      {
        // Changed from UserID to userid
        expiresIn: "1h",
      }
    );

    ApiResponse.success(res, "Login successful", {
      id: user.userid, // Changed from UserID to userid
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Login failed", error));
  }
};

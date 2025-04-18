const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize"); // Add this for OR operator
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");

class AuthService {
  static async registerUser(userData) {
    try {
      // Hash password
      const hashedPassword = bcrypt.hashSync(userData.password, 8);

      // Create user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        passwordhash: hashedPassword, // Changed from 'password' to 'passwordhash'
        role: "user",
      });

      return {
        id: user.userid, // Changed from UserID to userid
        username: user.username, // Changed from Username to username
        email: user.email, // Changed from Email to email
        role: user.role, // Changed from Role to role
      };
    } catch (error) {
      if (error.code === "23505") {
        // PostgreSQL duplicate key error code
        throw new ErrorHandler(400, "Username or email already exists");
      }
      throw new ErrorHandler(500, "Registration failed", error);
    }
  }

  static async loginUser(identifier, password) {
    try {
      // Find user by username or email
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
      });

      if (!user) {
        throw new ErrorHandler(404, "User not found");
      }

      // Check password
      const passwordIsValid = bcrypt.compareSync(password, user.passwordhash); // Changed from PasswordHash to passwordhash
      if (!passwordIsValid) {
        throw new ErrorHandler(401, "Invalid password");
      }

      // Create token
      const token = jwt.sign(
        { id: user.userid, role: user.role },
        process.env.JWT_SECRET,
        {
          // Changed from UserID to userid
          expiresIn: process.env.JWT_EXPIRE || "1h", // Added default expiration
        }
      );

      return {
        id: user.userid, // Changed from UserID to userid
        username: user.username, // Changed from Username to username
        email: user.email, // Changed from Email to email
        role: user.role, // Changed from Role to role
        accessToken: token,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;

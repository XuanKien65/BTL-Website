const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");
let refreshTokens = [];
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
      id: user.userid,
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
    const passwordIsValid = bcrypt.compareSync(password, user.passwordhash);
    if (!passwordIsValid) {
      return next(new ErrorHandler(401, "Invalid password"));
    }
    // Create token
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    ApiResponse.success(res, "Login successful", {
      id: user.userid,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Login failed", error));
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.userid,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.userid, role: user.role },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: "365d",
    }
  );
};
exports.requestRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("You're not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("refresh token is not valid");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};
exports.userLogout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  res.status(200).json("Logged out!");
};

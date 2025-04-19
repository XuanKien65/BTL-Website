require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const pool = require("./config/db.config");
const cookieParser = require("cookie-parser");
const open = require("open").default;
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5500;

// Static files: phục vụ frontend từ thư mục frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5501", // hoặc frontend port bạn đang dùng
    credentials: true,
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/comments", require("./routes/comment.routes"));

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "ERROR", database: "disconnected" });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);

  const indexPath = path.join(frontendPath, "pages", "index.html");
  if (fs.existsSync(indexPath)) {
    open(`http://localhost:${PORT}/pages/index.html`);
  } else {
    console.warn("⚠️ File index.html không tồn tại tại: ", indexPath);
  }
});

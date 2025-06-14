require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const open = require("open");

const http = require("http");
const setupWebSocket = require("./realtime/socketServer");

const app = express();
const PORT = process.env.PORT || 5500;

// Static files: phục vụ frontend từ thư mục frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5501",
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
app.use("/api/noti", require("./routes/notifications.routes"));
app.use("/api", require("./routes/authorRegister.routes"));
app.use("/api", require("./routes/savedPost.routes"));
app.use("/api", require("./routes/upload.routes"));
app.use("/api/viewed-posts", require("./routes/viewedPost.routes"));
app.use("/api/user-settings", require("./routes/userSettings.routes"));
app.use("/api/homepage-settings", require("./routes/homepageSettings.routes"));

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
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

const server = http.createServer(app);
setupWebSocket(server); // Kích hoạt socket

server.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);

  const indexPath = path.join(frontendPath, "pages", "index.html");
  if (fs.existsSync(indexPath)) {
    open(`http://localhost:${PORT}/pages/index.html`);
  } else {
    console.warn(" File index.html không tồn tại tại: ", indexPath);
  }
});

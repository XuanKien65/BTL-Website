require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool } = require("./config/db"); // Thay đổi cách import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh
const staticDir = path.join(__dirname, "../frontend");
app.use(express.static(staticDir));

// Route API đơn giản
app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Route test database (đã sửa cho PostgreSQL)
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1 AS test"); // Thay đổi cách query
    res.json({ status: "success", data: result.rows }); // PostgreSQL dùng .rows thay vì .recordset
  } catch (err) {
    console.error("❌ Lỗi kết nối database:", err);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      details: err.message, // Thêm thông tin lỗi chi tiết
    });
  }
});

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Khởi động server
const PORT = process.env.PORT || 5501;
app.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  Frontend served from: ${staticDir}
  Time: ${new Date().toLocaleTimeString()}
  `);
});

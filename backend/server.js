require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const { poolConnect } = require("./config/db");

// Kiểm tra kết nối database
poolConnect
  .then(() => console.log("Connected to SQL Server"))
  .catch((err) => console.error("Database connection failed:", err));
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
app.get("/api/test-db", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT 1 AS test");
    res.json({ status: "success", data: result.recordset });
  } catch (err) {
    console.error("❌ Lỗi kết nối database:", err);
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

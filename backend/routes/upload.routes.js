const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // dùng bộ nhớ tạm thời (buffer)

const { uploadImage } = require("../controllers/upload.controller");

router.post("/uploads", upload.single("upload"), uploadImage);

module.exports = router;

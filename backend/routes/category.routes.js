const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  verifyToken,
  isAdmin,
  isOwner,
  isOwnerOrAdmin,
} = require("../middlewares/authJwt");

// Tạo danh mục mới
router.post("/", [verifyToken, isAdmin], categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

// Lấy thông tin một danh mục
router.get("/:id", categoryController.getCategory);

// Cập nhật danh mục
router.put("/:id", [verifyToken, isAdmin], categoryController.updateCategory);

// Xóa danh mục
router.delete(
  "/:id",
  [verifyToken, isAdmin],
  categoryController.deleteCategory
);

module.exports = router;

const express = require("express");
const router = express.Router();
const authorRegisterController = require("../controllers/authorRegister.controller");
const upload = require("../middlewares/upload");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

// Đăng ký tác giả
router.post(
  "/register-author",
  verifyToken,
  upload.fields([
    { name: "frontIdCard", maxCount: 1 },
    { name: "backIdCard", maxCount: 1 },
  ]),
  authorRegisterController.registerAuthor
);

// Lấy tất cả đơn đăng ký (admin)
router.get(
  "/author-registrations",
  verifyToken,
  isAdmin,
  authorRegisterController.findAllAuthors
);

// Lấy đơn đăng ký theo userId (cá nhân user xem)
router.get(
  "/author-registrations/user/:userId",
  verifyToken,
  authorRegisterController.findAuthorByUserId
);

// Cập nhật trạng thái đơn đăng ký
router.put(
  "/author-registrations/:id/status",
  verifyToken,
  isAdmin,
  authorRegisterController.updateAuthorStatus
);

// Xóa đơn đăng ký
router.delete(
  "/author-registrations/:id",
  verifyToken,
  isAdmin,
  authorRegisterController.deleteAuthorRegistration
);

module.exports = router;

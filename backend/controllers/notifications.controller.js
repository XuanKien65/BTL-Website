const { Notification, userExists } = require("../models/notifications.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

// Gửi thông báo
exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, toUserId } = req.body;

    if (!title || !message || !toUserId) {
      return next(new ErrorHandler(400, "Thiếu thông tin bắt buộc"));
    }

    const exists = await userExists(toUserId);
    if (!exists) {
      return next(new ErrorHandler(404, "Người dùng không tồn tại"));
    }

    const notification = await Notification.createNotification(
      toUserId,
      title,
      message
    );

    ApiResponse.success(res, "Gửi thông báo thành công", notification);
  } catch (error) {
    next(new ErrorHandler(500, "Lỗi khi gửi thông báo", error));
  }
};

exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let notiList = [];

    if (status === "read") {
      notiList = await Notification.getByStatus(userId, true);
    } else if (status === "unread") {
      notiList = await Notification.getByStatus(userId, false);
    } else {
      notiList = await Notification.getNotificationsByUserId(userId);
    }

    ApiResponse.success(res, "Lấy thông báo thành công", notiList);
  } catch (err) {
    next(new ErrorHandler(500, "Lỗi khi lấy thông báo", err));
  }
};

// Đếm số thông báo chưa đọc
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.userId;
    const unread = await Notification.countUnread(userId);
    ApiResponse.success(res, "Lấy số thông báo chưa đọc thành công", {
      unread,
    });
  } catch (err) {
    next(new ErrorHandler(500, "Lỗi khi đếm thông báo chưa đọc", err));
  }
};

// Đánh dấu 1 thông báo là đã đọc
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return next(new ErrorHandler(400, "ID không hợp lệ"));
    }

    const updated = await Notification.markOneAsRead(id, userId);
    if (!updated) {
      return next(new ErrorHandler(404, "Thông báo không tồn tại"));
    }

    ApiResponse.success(res, "Đã đánh dấu đã đọc", updated);
  } catch (err) {
    next(new ErrorHandler(500, "Lỗi khi đánh dấu đã đọc", err));
  }
};

// Đánh dấu tất cả là đã đọc
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.userId;
    const updated = await Notification.markAllAsRead(userId);

    if (updated.length === 0) {
      return next(
        new ErrorHandler(404, "Không có thông báo chưa đọc nào để đánh dấu")
      );
    }

    ApiResponse.success(res, "Đã đánh dấu tất cả là đã đọc", updated);
  } catch (err) {
    next(new ErrorHandler(500, "Lỗi khi đánh dấu tất cả là đã đọc", err));
  }
};

// Xoá 1 thông báo
exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return next(new ErrorHandler(400, "ID không hợp lệ"));
    }

    const deleted = await Notification.deleteNotification(id, userId);
    if (!deleted) {
      return next(new ErrorHandler(404, "Thông báo không tồn tại"));
    }

    ApiResponse.success(res, "Đã xóa thông báo", deleted);
  } catch (err) {
    next(new ErrorHandler(500, "Lỗi khi xóa thông báo", err));
  }
};

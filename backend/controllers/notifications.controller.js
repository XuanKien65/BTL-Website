const { Notification, userExists } = require("../models/notifications.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, toUserId } = req.body;
    const exists = await userExists(toUserId);
    if (!exists) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const receiverId = toUserId;

    const notification = await Notification.createNotification(
      receiverId,
      title,
      message
    );

    ApiResponse.success(res, "Gửi thông báo thành công", notification);
  } catch (error) {
    next(new ErrorHandler(500, "Lỗi khi gửi thông báo", error));
  }
};

exports.getMyNotificationsWithPagination = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const total = await Notification.getTotalNotifications(userId);
    const totalPages = Math.ceil(total / limit);
    const data = await Notification.getNotificationsByPage(
      userId,
      limit,
      offset
    );

    res.status(200).json({ data, page, total, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await Notification.getNotificationsByUserId(userId);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const unread = await Notification.countUnread(userId);
    res.status(200).json({ unread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updated = await Notification.markOneAsRead(id, userId);
    if (!updated) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }
    res
      .status(200)
      .json({ message: "Đã đánh dấu đã đọc", notification: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const updated = await Notification.markAllAsRead(userId);

    if (updated.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có thông báo chưa đọc nào để đánh dấu" });
    }

    res.status(200).json({ message: "Đã đánh dấu tất cả là đã đọc", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const deleted = await Notification.deleteNotification(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Thông báo không tồn tại" });
    }
    res
      .status(200)
      .json({ message: "Đã xóa thông báo", notification: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

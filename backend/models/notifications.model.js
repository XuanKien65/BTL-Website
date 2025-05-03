const pool = require("../config/db.config");

userExists = async (userId) => {
  const result = await pool.query(
    "SELECT userid FROM users WHERE userid = $1",
    [userId]
  );
  return result.rowCount > 0;
};

const Notification = {
  // Gửi thông báo mới
  createNotification: async (userId, title, message) => {
    const result = await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, message]
    );
    return result.rows[0];
  },

  // Lấy tổng số thông báo của user
  getTotalNotifications: async (userId) => {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1",
      [userId]
    );
    return parseInt(result.rows[0].count);
  },
  // Hàm lấy tất cả thông báo chi tiết của một người dùng
  getNotificationsByUserId: async (userId) => {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  },

  // Đếm số thông báo chưa đọc
  countUnread: async (userId) => {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE",
      [userId]
    );
    return parseInt(result.rows[0].count);
  },

  // Đánh dấu một thông báo là đã đọc
  markOneAsRead: async (id, userId) => {
    const result = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return result.rows[0];
  },

  // Đánh dấu tất cả là đã đọc
  markAllAsRead: async (userId) => {
    const result = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE RETURNING *",
      [userId]
    );
    return result.rows;
  },

  deleteNotification: async (id, userId) => {
    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return result.rows[0];
  },
  getByStatus: async (userId, isRead) => {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 AND is_read = $2 ORDER BY created_at DESC",
      [userId, isRead]
    );
    return result.rows;
  },
};

module.exports = {
  Notification,
  userExists,
};

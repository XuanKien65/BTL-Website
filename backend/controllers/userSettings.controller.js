const UserSettings = require("../models/userSettings.model");

exports.getSettings = async (req, res) => {
  const userId = parseInt(req.params.userid);
  try {
    const settings = await UserSettings.getUserSettings(userId);
    if (!settings) return res.status(404).json({ error: "Không tìm thấy cài đặt" });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

exports.updateSettings = async (req, res) => {
  const userId = parseInt(req.params.userid);
  try {
    await UserSettings.updateUserSettings(userId, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

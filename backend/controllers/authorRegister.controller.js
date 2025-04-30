const AuthorRegistration = require("../models/authorRegister.model");
const cloudinary = require("../config/cloudinary.config");
const { Readable } = require("stream");

// Upload file buffer lên Cloudinary
const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(fileBuffer).pipe(upload_stream);
  });
};

// Đăng ký tác giả mới
const registerAuthor = async (req, res) => {
  try {
    const {
      userId,
      fullname,
      email,
      phone,
      experience,
      portfolio,
      frontIdCardUrl,
      backIdCardUrl,
    } = req.body;

    const topics = Array.isArray(req.body.topics)
      ? req.body.topics
      : [req.body.topics];

    // ✅ Kiểm tra các trường bắt buộc (dựa vào URL thay vì file)
    if (!userId || !fullname || !email || !frontIdCardUrl || !backIdCardUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // ✅ Lưu dữ liệu vào database (ảnh đã được upload sẵn)
    const authorId = await AuthorRegistration.create({
      userId,
      fullname,
      email,
      phone,
      experience,
      portfolio,
      frontIdCardUrl,
      backIdCardUrl,
    });

    await AuthorRegistration.insertTopics(authorId, topics);

    res.status(201).json({ success: true, message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Register Author Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy tất cả đơn đăng ký tác giả
const findAllAuthors = async (req, res) => {
  try {
    const authors = await AuthorRegistration.findAll();
    res.json({ success: true, data: authors });
  } catch (error) {
    console.error("Find All Authors Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy đơn đăng ký tác giả theo userId
const findAuthorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const author = await AuthorRegistration.findByUserId(userId);
    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đăng ký" });
    }

    res.json({ success: true, data: author });
  } catch (error) {
    console.error("Find Author By UserId Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
const updateAuthorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu trạng thái mới" });
    }

    const updatedAuthor = await AuthorRegistration.updateStatus(id, status);
    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: updatedAuthor,
    });
  } catch (error) {
    console.error("Update Author Status Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Xóa đơn đăng ký
const deleteAuthorRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await AuthorRegistration.delete(id);
    if (!success) {
      return res
        .status(404)
        .json({ success: false, message: "Đơn đăng ký không tồn tại" });
    }

    res.json({ success: true, message: "Xóa đơn đăng ký thành công" });
  } catch (error) {
    console.error("Delete Author Registration Error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
  registerAuthor,
  findAllAuthors,
  findAuthorByUserId,
  updateAuthorStatus,
  deleteAuthorRegistration,
};

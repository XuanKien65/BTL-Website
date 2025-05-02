const ViewedPost = require("../models/viewedPost.model");
const ApiResponse = require("../utils/apiResponse");
const ErrorHandler = require("../utils/errorHandler");

exports.getViewedPostsByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      return next(new ErrorHandler(400, "Thiếu userId"));
    }

    const posts = await ViewedPost.findByUserId(userId);
    ApiResponse.success(res, "Lấy danh sách bài viết đã đọc thành công", posts);
  } catch (error) {
    next(new ErrorHandler(500, "Lỗi khi lấy bài viết đã đọc", error));
  }
};

const cloudinary = require("../config/cloudinary.config");
const { Readable } = require("stream");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Cho phép client truyền folder (mặc định là 'uploads')
    const folder = req.query.folder || "uploads";

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res
            .status(500)
            .json({ success: false, message: "Upload failed" });
        }
        return res.status(200).json({ success: true, url: result.secure_url });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Upload server error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

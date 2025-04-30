const cloudinary = require("../config/cloudinary.config"); // nếu dùng Cloudinary
const { Readable } = require("stream");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ckeditor_uploads" },
      (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Upload failed" });
        }
        return res.status(200).json({ url: result.secure_url });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

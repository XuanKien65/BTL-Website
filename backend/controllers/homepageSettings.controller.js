const HomepageSettings = require("../models/homepageSettings.model");
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

exports.updateSettings = async (req, res) => {
  try {
    const settingsData = {
      slogan: req.body.slogan,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      logo_path: null,
      banner_path: null,
    };

    // Upload logo nếu có
    if (req.files.logo?.[0]) {
      const logoUpload = await cloudinary.uploader.upload(
        req.files.logo[0].path,
        {
          folder: "homepage",
        }
      );
      settingsData.logo_path = logoUpload.secure_url;

      // Xóa file tạm nếu muốn
      fs.unlinkSync(req.files.logo[0].path);
    }

    // Upload banner nếu có
    if (req.files.banner?.[0]) {
      const bannerUpload = await cloudinary.uploader.upload(
        req.files.banner[0].path,
        {
          folder: "homepage",
        }
      );
      settingsData.banner_path = bannerUpload.secure_url;

      fs.unlinkSync(req.files.banner[0].path);
    }

    const result = await HomepageSettings.createOrUpdate(settingsData);

    res.status(200).json({
      success: true,
      data: {
        ...result,
        contact_info:
          typeof result.contact_info === "string"
            ? JSON.parse(result.contact_info)
            : result.contact_info,
      },
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await HomepageSettings.get();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    const contactInfo =
      typeof settings.contact_info === "string"
        ? JSON.parse(settings.contact_info)
        : settings.contact_info;

    res.json({
      success: true,
      data: {
        slogan: settings.slogan,
        contact_info: contactInfo,
        logo_url: settings.logo_path || null,
        banner_url: settings.banner_path || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

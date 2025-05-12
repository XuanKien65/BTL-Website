
const HomepageSettings = require('../models/homepageSettings.model');
const upload = require('../middlewares/upload');


exports.updateSettings = async (req, res) => {
  try {
    const settingsData = {
      slogan: req.body.slogan,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      logo_path: req.files.logo?.[0]?.path || null,
      banner_path: req.files.banner?.[0]?.path || null
    };


    const result = await HomepageSettings.createOrUpdate(settingsData);
    
    res.status(200).json({
      success: true,
      data: {
        ...result,
        contact_info: typeof result.contact_info === 'string'
          ? JSON.parse(result.contact_info)
          : result.contact_info // tránh lỗi nếu đã là object
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await HomepageSettings.get();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    const contactInfo = typeof settings.contact_info === 'string'
      ? JSON.parse(settings.contact_info)
      : settings.contact_info;

    // Đường dẫn public (ví dụ: /uploads/homepage/logo-xxx.png)
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const normalizePath = (p) =>
      p?.replace(/\\/g, "/").replace(/^backend\//, "").replace(/^uploads\//, "");

    res.json({
      success: true,
      data: {
        slogan: settings.slogan,
        contact_info: contactInfo,
        logo_url: settings.logo_path
          ? `${baseUrl}/uploads/${normalizePath(settings.logo_path)}`
          : null,
        banner_url: settings.banner_path
          ? `${baseUrl}/uploads/${normalizePath(settings.banner_path)}`
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message

    });
  }
};

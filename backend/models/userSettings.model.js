const pool = require("../config/db.config");

exports.getUserSettings = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM user_settings WHERE userid = $1",
    [userId]
  );
  return result.rows[0];
};

exports.updateUserSettings = async (userId, settings) => {
  const { theme, dark_mode, font_size, language } = settings;

  await pool.query(
    `INSERT INTO user_settings (userid, dark_mode, font_size, language, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (userid) DO UPDATE SET
        dark_mode = EXCLUDED.dark_mode,
        font_size = EXCLUDED.font_size,
        language = EXCLUDED.language,
        updated_at = NOW()`,
    [userId, theme, dark_mode, font_size, language]
  );
};

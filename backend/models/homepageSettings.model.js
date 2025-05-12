const db = require('../config/db.config');

class HomepageSettings {
  static async createOrUpdate(settings) {
    const existing = await this.get();

    const {
      slogan,
      address,
      email,
      phone,
      logo_path,
      banner_path
    } = settings;

    const contactInfo = {
      address: address ?? existing?.contact_info?.address ?? '',
      email: email ?? existing?.contact_info?.email ?? '',
      phone: phone ?? existing?.contact_info?.phone ?? ''
    };

    const query = `
      INSERT INTO homepage_settings 
        (id, slogan, contact_info, logo_path, banner_path)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        slogan = EXCLUDED.slogan,
        contact_info = EXCLUDED.contact_info,
        logo_path = COALESCE(EXCLUDED.logo_path, homepage_settings.logo_path),
        banner_path = COALESCE(EXCLUDED.banner_path, homepage_settings.banner_path),
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      slogan ?? existing?.slogan ?? '',
      JSON.stringify(contactInfo),
      logo_path || null,
      banner_path || null
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }


  static async get() {
    const query = 'SELECT * FROM homepage_settings LIMIT 1';
    const result = await db.query(query);
    return result.rows[0] || null;
  }
}

module.exports = HomepageSettings;
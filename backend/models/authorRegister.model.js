const pool = require("../config/db.config");

const AuthorRegistration = {
  create: async (data) => {
    const {
      userId,
      fullname,
      email,
      phone,
      experience,
      portfolio,
      frontIdCardUrl,
      backIdCardUrl,
    } = data;

    try {
      const result = await pool.query(
        `
        INSERT INTO author_registrations (
          userid, fullname, email, phone, experience, 
          portfolio, front_id_card_url, back_id_card_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `,
        [
          userId,
          fullname,
          email,
          phone,
          experience,
          portfolio,
          frontIdCardUrl,
          backIdCardUrl,
        ]
      );

      const authorRegistrationId = result.rows[0]?.id;
      if (!authorRegistrationId) {
        throw new Error("Insert failed: No id returned");
      }

      return authorRegistrationId;
    } catch (error) {
      console.error("Error creating author registration:", error);
      throw error;
    }
  },

  insertTopics: async (authorRegistrationId, topicsIds) => {
    if (!topicsIds || topicsIds.length === 0) return;

    try {
      const values = topicsIds
        .map((topicId, idx) => `($1, $${idx + 2})`)
        .join(", ");
      const params = [authorRegistrationId, ...topicsIds];

      const query = `
        INSERT INTO author_registration_topics (author_registration_id, category_id)
        VALUES ${values}
      `;

      await pool.query(query, params);
    } catch (error) {
      console.error("Error inserting author topics:", error);
      throw error;
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
      const allowedStatuses = ["pending", "approved", "rejected"];
      if (!allowedStatuses.includes(newStatus)) {
        throw new Error("Invalid status");
      }

      const result = await pool.query(
        `
        UPDATE author_registrations
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [newStatus, id]
      );

      if (result.rowCount === 0) {
        throw new Error("Author registration not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating author registration status:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        `
        DELETE FROM author_registrations
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      if (result.rowCount === 0) {
        throw new Error("Author registration not found or already deleted");
      }

      return true;
    } catch (error) {
      console.error("Error deleting author registration:", error);
      throw error;
    }
  },

  findAll: async () => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM author_registrations
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error("Error finding all author registrations:", error);
      throw error;
    }
  },

  findByUserId: async (userId) => {
    try {
      const result = await pool.query(
        `
        SELECT *
        FROM author_registrations
        WHERE userid = $1
        ORDER BY created_at DESC
      `,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error("Error finding author registration by userId:", error);
      throw error;
    }
  },
};

module.exports = AuthorRegistration;

const pool = require("../config/db.config");

const SavedPost = {
  save: async (userId, postId) => {
    await pool.query(
      "INSERT INTO saved_posts (userid, postid) VALUES ($1, $2) ON CONFLICT (userid, postid) DO NOTHING",
      [userId, postId]
    );
  },

  findByUser: async (userId) => {
    const result = await pool.query(
      `
      SELECT p.*
      FROM saved_posts sp
      JOIN posts p ON sp.postid = p.postid
      WHERE sp.userid = $1
      ORDER BY sp.saved_at DESC
      `,
      [userId]
    );
    return result.rows;
  },

  remove: async (userId, postId) => {
    await pool.query(
      "DELETE FROM saved_posts WHERE userid = $1 AND postid = $2",
      [userId, postId]
    );
  },
};

module.exports = SavedPost;

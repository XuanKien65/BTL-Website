const pool = require("../config/db.config");

const ViewedPost = {
  findByUserId: async (userId) => {
    const result = await pool.query(
      `
        SELECT 
        vp.viewed_at, 
        p.postid, p.title, p.slug, p.featuredimage, p.createdat
        FROM viewed_posts vp
        JOIN posts p ON vp.postid = p.postid
        WHERE vp.userid = $1
        ORDER BY vp.viewed_at DESC;
      `,
      [userId]
    );

    return result.rows;
  },
};

module.exports = ViewedPost;

const pool = require("../config/db.config");

const Comment = {
  findAll: async (postId = null, status = null) => {
    let query = `
      SELECT 
        c.cmtid, c.content, c.status, c.createdat,
        c.parentid, c.replyingto, c.score,
        p.postid, p.title AS posttitle,
        u.userid, u.username, u.avatarurl
      FROM comments c
      LEFT JOIN posts p ON c.postid = p.postid
      LEFT JOIN users u ON c.userid = u.userid
      WHERE 1=1
    `;

    const params = [];

    if (postId) {
      query += ` AND c.postid = $${params.length + 1}`;
      params.push(postId);
    }

    if (status) {
      query += ` AND c.status = $${params.length + 1}`;
      params.push(status);
    }

    query += " ORDER BY c.createdat DESC";

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        p.title AS posttitle,
        u.username, u.avatarurl, u.email
      FROM comments c
      LEFT JOIN posts p ON c.postid = p.postid
      LEFT JOIN users u ON c.userid = u.userid
      WHERE c.cmtid = $1
      `,
      [id]
    );
    return result.rows[0];
  },

  findByPostId: async (postId) => {
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        u.username, u.avatarurl
      FROM comments c
      LEFT JOIN users u ON c.userid = u.userid
      WHERE c.postid = $1
      ORDER BY c.createdat ASC
      `,
      [postId]
    );
    return result.rows;
  },
  findByUserId: async (userId) => {
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        p.title AS posttitle,
        p.slug,
        p.featuredimage,
        u.username,
        u.avatarurl
      FROM comments c
      LEFT JOIN posts p ON c.postid = p.postid
      LEFT JOIN users u ON c.userid = u.userid
      WHERE c.userid = $1
      ORDER BY c.createdat DESC
      `,
      [userId]
    );
    return result.rows;
  },

  create: async (comment) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO comments (
          content, postid, userid, authorip, parentid, replyingto, score, status
        ) VALUES ($1, $2, $3, $4, $5, $6, 0, 'pending')
        RETURNING cmtid
        `,
        [
          comment.content,
          comment.postId,
          comment.userId,
          comment.authorIp,
          comment.parentId || null,
          comment.replyingTo || null,
        ]
      );

      const commentId = result.rows[0]?.cmtid;
      if (!commentId) throw new Error("Insert failed: No cmtid returned");

      return await Comment.findById(commentId);
    } catch (error) {
      console.error("❌ Error creating comment:", error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    await pool.query("UPDATE comments SET status = $1 WHERE cmtid = $2", [
      status,
      id,
    ]);
    return Comment.findById(id);
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM comments WHERE cmtid = $1", [
      id,
    ]);
    return result.rowCount > 0;
  },
  updateScore: async (id, delta) => {
    // delta: số nguyên +1 hoặc -1
    const result = await pool.query(
      `
      UPDATE comments 
      SET score = GREATEST(score + $1, 0) 
      WHERE cmtid = $2 
      RETURNING *
      `,
      [delta, id]
    );
    return result.rows[0];
  },
};

module.exports = Comment;

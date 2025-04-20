const pool = require("../config/db.config");

const Comment = {
  findAll: async (postId = null, status = null) => {
    let query = `
      SELECT 
        c.cmtID, c.content, c.status, c.createdat,
        p.postid, p.title AS posttitle,
        u.userid, u.username, u.avatarurl
      FROM comments_clone c
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
      FROM comments_clone c
      LEFT JOIN posts p ON c.postid = p.postid
      LEFT JOIN users u ON c.userid = u.userid
      WHERE c.cmtID = $1
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
        p.title AS posttitle,
        u.username, u.avatarurl, u.email
      FROM comments_clone c
      LEFT JOIN posts p ON c.postid = p.postid
      LEFT JOIN users u ON c.userid = u.userid
      WHERE c.postid = $1
      `,
      [postId]
    );

    return result.rows;
  },

  create: async (comment) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO comments_clone (
          content, postid, userid, authorip, parentid, status
        ) VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING cmtID
        `,
        [
          comment.content,
          comment.postId,
          comment.userId,
          comment.authorIp,
          comment.parentId || null,
        ]
      );
      console.log("Insert result:", result.rows[0]); // ← luôn nên có
      const commentId = result.rows[0]?.cmtid;
      if (!commentId) throw new Error("Insert failed: No cmtID returned");

      return await Comment.findById(commentId);
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    await pool.query("UPDATE comments_clone SET status = $1 WHERE cmtID = $2", [
      status,
      id,
    ]);
    return Comment.findById(id);
  },

  delete: async (id) => {
    const result = await pool.query(
      "DELETE FROM comments_clone WHERE cmtID = $1",
      [id]
    );
    return result.rowCount > 0;
  },
};

module.exports = Comment;

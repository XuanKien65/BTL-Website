const pool = require("../config/db.config");

const Comment = {
  findAll: async (postId = null, status = null) => {
    let query = `
      SELECT 
        c.CommentID, c.Content, c.Status, c.CreatedAt,
        c.AuthorName, c.AuthorEmail,
        p.PostID, p.Title AS PostTitle,
        u.UserID, u.Username, u.AvatarURL
      FROM Comments c
      LEFT JOIN Posts p ON c.PostID = p.PostID
      LEFT JOIN Users u ON c.UserID = u.UserID
      WHERE 1=1
    `;

    const params = [];

    if (postId) {
      query += " AND c.PostID = ?";
      params.push(postId);
    }

    if (status) {
      query += " AND c.Status = ?";
      params.push(status);
    }

    query += " ORDER BY c.CreatedAt DESC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `
      SELECT 
        c.*, 
        p.Title AS PostTitle,
        u.Username, u.AvatarURL
      FROM Comments c
      LEFT JOIN Posts p ON c.PostID = p.PostID
      LEFT JOIN Users u ON c.UserID = u.UserID
      WHERE c.CommentID = ?
    `,
      [id]
    );
    return rows[0];
  },

  create: async (comment) => {
    const [result] = await pool.query(
      `INSERT INTO Comments (
        Content, PostID, UserID, AuthorName, AuthorEmail, 
        AuthorIP, ParentID, Status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        comment.content,
        comment.postId,
        comment.userId || null,
        comment.authorName,
        comment.authorEmail || null,
        comment.authorIp || null,
        comment.parentId || null,
      ]
    );
    return Comment.findById(result.insertId);
  },

  updateStatus: async (id, status) => {
    await pool.query("UPDATE Comments SET Status = ? WHERE CommentID = ?", [
      status,
      id,
    ]);
    return Comment.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM Comments WHERE CommentID = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Comment;

const pool = require("../config/db.config");

const Post = {
  findAll: async (
    page = 1,
    pageSize = 10,
    status = null,
    categoryId = null,
    searchTerm = null
  ) => {
    const offset = (page - 1) * pageSize;
    let query = `
      SELECT 
        p.PostID, p.Title, p.Slug, p.Excerpt, p.FeaturedImage, 
        p.Status, p.Views, p.CreatedAt, p.PublishedAt,
        u.UserID AS AuthorID, u.Username AS AuthorName, u.AvatarURL AS AuthorAvatar,
        c.CategoryID, c.Name AS CategoryName
      FROM Posts p
      INNER JOIN Users u ON p.AuthorID = u.UserID
      LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += " AND p.Status = ?";
      params.push(status);
    }

    if (categoryId) {
      query += " AND p.CategoryID = ?";
      params.push(categoryId);
    }

    if (searchTerm) {
      query += " AND (p.Title LIKE ? OR p.Content LIKE ?)";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += " ORDER BY p.CreatedAt DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `
      SELECT 
        p.*, 
        u.Username AS AuthorName, u.AvatarURL AS AuthorAvatar,
        c.Name AS CategoryName
      FROM Posts p
      INNER JOIN Users u ON p.AuthorID = u.UserID
      LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE p.PostID = ?
    `,
      [id]
    );
    return rows[0];
  },

  create: async (post) => {
    const [result] = await pool.query(
      `INSERT INTO Posts (
        Title, Content, AuthorID, CategoryID, Status, 
        FeaturedImage, Excerpt, PublishedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 
        CASE WHEN ? = 'published' THEN NOW() ELSE NULL END
      )`,
      [
        post.title,
        post.content,
        post.authorId,
        post.categoryId || null,
        post.status || "draft",
        post.featuredImage || null,
        post.excerpt || null,
        post.status || "draft",
      ]
    );
    return Post.findById(result.insertId);
  },

  update: async (id, post) => {
    await pool.query(
      `UPDATE Posts SET
        Title = ?,
        Content = ?,
        CategoryID = ?,
        Status = ?,
        FeaturedImage = ?,
        Excerpt = ?,
        UpdatedAt = NOW(),
        PublishedAt = CASE 
          WHEN ? = 'published' AND PublishedAt IS NULL THEN NOW()
          WHEN ? != 'published' THEN NULL
          ELSE PublishedAt
        END
      WHERE PostID = ?`,
      [
        post.title,
        post.content,
        post.categoryId || null,
        post.status,
        post.featuredImage || null,
        post.excerpt || null,
        post.status,
        post.status,
        id,
      ]
    );
    return Post.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM Posts WHERE PostID = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },

  count: async (status = null, categoryId = null, searchTerm = null) => {
    let query = "SELECT COUNT(*) AS Total FROM Posts WHERE 1=1";
    const params = [];

    if (status) {
      query += " AND Status = ?";
      params.push(status);
    }

    if (categoryId) {
      query += " AND CategoryID = ?";
      params.push(categoryId);
    }

    if (searchTerm) {
      query += " AND (Title LIKE ? OR Content LIKE ?)";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].Total;
  },
};

// Thêm hàm testConnection
Post.testConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Database connection test:", rows);
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

// Gọi hàm test connection khi khởi động
Post.testConnection();

module.exports = Post;

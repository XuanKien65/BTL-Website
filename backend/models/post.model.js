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
        p.postid, p.title, p.slug, p.excerpt, p.featuredimage, 
        p.status, p.views, p.createdat, p.publishedat,
        u.userid AS authorid, u.username AS authorname, u.avatarurl AS authoravatar,
        ARRAY_AGG(c.name) AS categories
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += " AND p.status = $" + (params.length + 1);
      params.push(status);
    }

    if (categoryId) {
      query += " AND pc.categoryid = $" + (params.length + 1);
      params.push(categoryId);
    }

    if (searchTerm) {
      query +=
        " AND (p.title ILIKE $" +
        (params.length + 1) +
        " OR p.content ILIKE $" +
        (params.length + 2) +
        ")";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += `
      GROUP BY p.postid, u.userid
      ORDER BY p.createdat DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(pageSize, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.username AS authorname, u.avatarurl AS authoravatar,
        ARRAY_AGG(c.name) AS categories
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      WHERE p.postid = $1
      GROUP BY p.postid, u.userid
    `,
      [id]
    );
    return result.rows[0];
  },

  create: async (post) => {
    const result = await pool.query(
      `INSERT INTO posts (
        title, slug, content, authorid, status, 
        featuredimage, excerpt, publishedat
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
        CASE WHEN $8 = 'published' THEN NOW() ELSE NULL END
      ) RETURNING postid`,
      [
        post.title,
        post.slug,
        post.content,
        post.authorId,
        post.status || "draft",
        post.featuredImage || null,
        post.excerpt || null,
        post.status || "draft",
      ]
    );

    const postId = result.rows[0].postid;

    // Gắn category (PostgreSQL way)
    if (post.categoryIds && post.categoryIds.length > 0) {
      const valueStrings = post.categoryIds
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      const values = [postId, ...post.categoryIds];

      await pool.query(
        `INSERT INTO post_categories (postid, categoryid) VALUES ${valueStrings}`,
        values
      );
    }

    return Post.findById(postId);
  },

  update: async (id, post) => {
    await pool.query(
      `UPDATE posts SET
        title = $1,
        slug = $2,
        content = $3,
        status = $4,
        featuredimage = $5,
        excerpt = $6,
        updatedat = NOW(),
        publishedat = CASE 
          WHEN $7 = 'published' AND publishedat IS NULL THEN NOW()
          WHEN $8 != 'published' THEN NULL
          ELSE publishedat
        END
      WHERE postid = $9`,
      [
        post.title,
        post.slug,
        post.content,
        post.status,
        post.featuredImage || null,
        post.excerpt || null,
        post.status,
        post.status,
        id,
      ]
    );

    // Cập nhật category
    await pool.query("DELETE FROM post_categories WHERE postid = $1", [id]);

    if (post.categoryIds && post.categoryIds.length > 0) {
      const valueStrings = post.categoryIds
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      const values = [id, ...post.categoryIds];

      await pool.query(
        `INSERT INTO post_categories (postid, categoryid) VALUES ${valueStrings}`,
        values
      );
    }

    return Post.findById(id);
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM posts WHERE postid = $1", [
      id,
    ]);
    return result.rowCount > 0;
  },

  count: async (status = null, categoryId = null, searchTerm = null) => {
    let query = `
      SELECT COUNT(DISTINCT p.postid) AS Total
      FROM posts p
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND p.status = $" + (params.length + 1);
      params.push(status);
    }

    if (categoryId) {
      query += " AND pc.categoryid = $" + (params.length + 1);
      params.push(categoryId);
    }

    if (searchTerm) {
      query +=
        " AND (p.title ILIKE $" +
        (params.length + 1) +
        " OR p.content ILIKE $" +
        (params.length + 2) +
        ")";
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    const result = await pool.query(query, params);
    return result.rows[0].total;
  },

  testConnection: async () => {
    try {
      const result = await pool.query("SELECT 1 + 1 AS result");
      console.log("Database connection test:", result.rows);
      return true;
    } catch (error) {
      console.error("Database connection error:", error);
      return false;
    }
  },
};

Post.testConnection();
module.exports = Post;

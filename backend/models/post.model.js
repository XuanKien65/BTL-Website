const pool = require("../config/db.config");
const slugify = require("../utils/slugify");

const Post = {
  findAll: async (status = null, categoryId = null, searchTerm = null) => {
    let query = `
      SELECT 
        p.postid, p.title, p.slug, p.excerpt,p.content, p.featuredimage, 
        p.status, p.views, p.createdat, p.publishedat, p.is_featured,
        u.userid AS authorid, u.username AS authorname, u.avatarurl AS authoravatar,
        ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS categories
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }

    if (categoryId) {
      query += ` AND pc.categoryid = $${params.length + 1}`;
      params.push(categoryId);
    }

    if (searchTerm) {
      query += ` AND (p.title ILIKE $${params.length + 1} OR p.content ILIKE $${
        params.length + 2
      })`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    query += `
      GROUP BY p.postid, u.userid
      ORDER BY p.createdat DESC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error("Invalid post ID");
    }

    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.username AS authorname, u.avatarurl AS authoravatar,
        ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS categories,
        ARRAY_AGG(DISTINCT h.name) FILTER (WHERE h.name IS NOT NULL) AS tags
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      LEFT JOIN post_hashtags ph ON p.postid = ph.postid
      LEFT JOIN hashtags h ON ph.tagid = h.tagid
      WHERE p.postid = $1
      GROUP BY p.postid, u.userid
      `,
      [parseInt(id)]
    );
    return result.rows[0];
  },

  findByAuthor: async (id, status = null) => {
    if (!id || isNaN(id)) {
      throw new Error("invalid author id");
    }

    let query = `
      SELECT p.*, u.username 
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      WHERE u.userid = $1
    `;
    const params = [parseInt(id)];

    if (status) {
      query += ` AND p.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY p.createdat DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  findBySlug: async (slug) => {
    if (!slug || typeof slug !== "string") {
      throw new Error("Invalid post slug");
    }
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.username AS authorname, 
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'parent_id', c.parent_id
        )) FILTER (WHERE c.id IS NOT NULL) AS categories,
        ARRAY_AGG(DISTINCT h.name) FILTER (WHERE h.name IS NOT NULL) AS tags
      FROM posts p
      INNER JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      LEFT JOIN post_hashtags ph ON p.postid = ph.postid
      LEFT JOIN hashtags h ON ph.tagid = h.tagid
      WHERE p.slug = $1 and p.status='published'
      GROUP BY p.postid, u.userid;
      `,
      [slug]
    );
    return result.rows[0];
  },

  create: async (post) => {
    const publishedAt = post.status === "published" ? new Date() : null;

    const result = await pool.query(
      `INSERT INTO posts (
        title, slug, content, authorid, status, 
        featuredimage, excerpt, is_featured, publishedat
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING postid`,
      [
        post.title,
        post.slug,
        post.content,
        post.authorId,
        post.status,
        post.featuredImage || null,
        post.excerpt || null,
        post.isFeatured || false,
        publishedAt,
      ]
    );

    const postId = result.rows[0].postid;

    // Gắn categories
    if (post.categoryIds && post.categoryIds.length > 0) {
      const categorySet = new Set();

      for (const categoryId of post.categoryIds) {
        categorySet.add(categoryId);

        const parentResult = await pool.query(
          `SELECT parent_id FROM categories WHERE id = $1`,
          [categoryId]
        );

        const parentId = parentResult.rows[0]?.parent_id;
        if (parentId) {
          categorySet.add(parentId);
        }
      }

      const finalCategoryIds = Array.from(categorySet);

      const valueStrings = finalCategoryIds
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      const values = [postId, ...finalCategoryIds];

      await pool.query(
        `INSERT INTO post_categories (postid, categoryid) VALUES ${valueStrings}`,
        values
      );
    }

    // Gắn hashtags
    if (post.tagNames && post.tagNames.length > 0) {
      for (const tagName of post.tagNames) {
        let tagResult = await pool.query(
          `SELECT tagid FROM hashtags WHERE name = $1`,
          [tagName]
        );

        let tagId;
        if (tagResult.rows.length === 0) {
          // Nếu hashtag chưa tồn tại -> Insert mới
          const insertResult = await pool.query(
            `INSERT INTO hashtags (name) VALUES ($1) RETURNING tagid`,
            [tagName]
          );
          tagId = insertResult.rows[0].tagid;
        } else {
          tagId = tagResult.rows[0].tagid;
        }

        // Insert vào post_hashtags
        await pool.query(
          `INSERT INTO post_hashtags (postid, tagid) VALUES ($1, $2)`,
          [postId, tagId]
        );
      }
    }

    return Post.findById(postId);
  },

  updatePost: async (id, { title, slug, content }) => {
    const result = await pool.query(
      `UPDATE posts SET
        title = $1,
        slug = $2,
        content = $3,
        updatedat = NOW()
       WHERE postid = $4
       RETURNING *`,
      [title, slug, content, id]
    );

    if (result.rowCount === 0) {
      throw new Error("Post not found");
    }

    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM posts WHERE postid = $1", [
      id,
    ]);
    return result.rowCount > 0;
  },

  count: async (status = null, categoryId = null, searchTerm = null) => {
    let query = `
      SELECT COUNT(DISTINCT p.postid) AS total
      FROM posts p
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }

    if (categoryId) {
      query += ` AND pc.categoryid = $${params.length + 1}`;
      params.push(categoryId);
    }

    if (searchTerm) {
      query += ` AND (p.title ILIKE $${params.length + 1} OR p.content ILIKE $${
        params.length + 2
      })`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].total);
  },

  countSearchResults: async ({
    keyword = null,
    tag = null,
    categoryName,
    status = "published",
    fromDate = null,
    toDate = null,
  }) => {
    const params = [];
    let query = `
      SELECT COUNT(DISTINCT p.postid) AS total
      FROM posts p
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN post_hashtags ph ON p.postid = ph.postid
      LEFT JOIN hashtags h ON ph.tagid = h.tagid
      WHERE 1=1
    `;

    if (keyword) {
      const slugKeyword = slugify(keyword, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      params.push(`%${keyword}%`, `%${keyword}%`, `%${slugKeyword}%`);
      query += ` AND (p.title ILIKE $${params.length - 2} OR p.content ILIKE $${
        params.length - 1
      } OR p.slug ILIKE $${params.length})`;
    }

    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }

    if (categoryName) {
      const categoryRes = await pool.query(
        `SELECT id FROM categories WHERE name ILIKE $1`,
        [categoryName]
      );
      const parentId = categoryRes.rows[0]?.id;

      if (parentId) {
        const childCats = await pool.query(
          `SELECT id FROM categories WHERE id = $1 OR parent_id = $1`,
          [parentId]
        );
        const catIds = childCats.rows.map((row) => row.id);
        params.push(catIds);
        query += ` AND pc.categoryid = ANY($${params.length})`;
      }
    }

    if (tag) {
      params.push(tag);
      query += ` AND h.name ILIKE $${params.length}`;
    }

    if (fromDate) {
      params.push(fromDate);
      query += ` AND p.publishedat >= $${params.length}`;
    }

    if (toDate) {
      params.push(toDate);
      query += ` AND p.publishedat <= $${params.length}`;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].total);
  },

  searchWithFilters: async ({
    page = 1,
    pageSize = 10,
    keyword = null,
    tag = null,
    categoryName = null,
    status = "published",
    fromDate = null,
    toDate = null,
    sortBy = "newest",
  }) => {
    const offset = (page - 1) * pageSize;
    const params = [];

    let query = `
      SELECT 
        p.postid, p.title, p.slug, p.excerpt, p.featuredimage,
        p.status, p.views, p.createdat, p.publishedat,
        u.userid AS authorid, u.username AS authorname,
        c.id AS categoryid, c.name AS categoryname, c.slug AS categoryslug,
        cp.id AS parentid, cp.name AS parentname, cp.slug AS parentslug,
        h.name AS tagname
      FROM posts p
      JOIN users u ON p.authorid = u.userid
      LEFT JOIN post_categories pc ON p.postid = pc.postid
      LEFT JOIN categories c ON pc.categoryid = c.id
      LEFT JOIN categories cp ON c.parent_id = cp.id
      LEFT JOIN post_hashtags ph ON p.postid = ph.postid
      LEFT JOIN hashtags h ON ph.tagid = h.tagid
      WHERE p.status = $1
    `;
    params.push(status);

    if (keyword) {
      const slugKeyword = slugify(keyword, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      params.push(
        `%${keyword}%`,
        `%${keyword}%`,
        `%${slugKeyword}%`,
        `%${keyword}%`
      );
      query += ` AND (
         p.title ILIKE $${params.length - 3} OR
         p.content ILIKE $${params.length - 2} OR
         p.slug ILIKE $${params.length - 1} OR
         h.name ILIKE $${params.length}
      )`;
    }

    if (categoryName) {
      const categoryRes = await pool.query(
        `SELECT id FROM categories WHERE name ILIKE $1`,
        [categoryName]
      );
      const parentId = categoryRes.rows[0]?.id;

      if (parentId) {
        const childCats = await pool.query(
          `SELECT id FROM categories WHERE id = $1 OR parent_id = $1`,
          [parentId]
        );
        const catIds = childCats.rows.map((row) => row.id);
        params.push(catIds);
        query += ` AND c.id = ANY($${params.length})`;
      }
    }

    if (tag) {
      params.push(tag);
      query += ` AND h.name ILIKE $${params.length}`;
    }

    if (fromDate) {
      params.push(fromDate);
      query += ` AND p.publishedat >= $${params.length}`;
    }
    if (toDate) {
      params.push(toDate);
      query += ` AND p.publishedat <= $${params.length}`;
    }

    const sortMap = {
      newest: "p.publishedat DESC NULLS LAST",
      oldest: "p.publishedat ASC",
      popular: "p.views DESC",
    };
    const sortClause = sortMap[sortBy] || sortMap.newest;

    query += `
      ORDER BY ${sortClause}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(pageSize, offset);

    const result = await pool.query(query, params);
    const rows = result.rows;

    const postsMap = new Map();
    rows.forEach((row) => {
      const {
        postid,
        title,
        slug,
        excerpt,
        featuredimage,
        status,
        views,
        createdat,
        publishedat,
        authorid,
        authorname,
        categoryid,
        categoryname,
        categoryslug,
        parentid,
        parentname,
        parentslug,
        tagname,
      } = row;

      if (!postsMap.has(postid)) {
        postsMap.set(postid, {
          postid,
          title,
          slug,
          excerpt,
          featuredimage,
          status,
          views,
          createdat,
          publishedat,
          authorid,
          authorname,
          categories: [],
          tags: [],
        });
      }

      const post = postsMap.get(postid);

      if (categoryid && !post.categories.find((c) => c.id === categoryid)) {
        post.categories.push({
          id: categoryid,
          name: categoryname,
          slug: categoryslug,
          parent: parentid
            ? {
                id: parentid,
                name: parentname,
                slug: parentslug,
              }
            : null,
        });
      }

      if (tagname && !post.tags.includes(tagname)) {
        post.tags.push(tagname);
      }
    });

    return Array.from(postsMap.values());
  },

  recordView: async (userId, postId) => {
    // Kiểm tra xem user đã xem post chưa
    const result = await pool.query(
      `SELECT 1 FROM viewed_posts WHERE userid = $1 AND postid = $2`,
      [userId, postId]
    );

    const hasViewed = result.rowCount > 0;

    if (!hasViewed) {
      // Chỉ tăng views nếu user chưa xem
      await pool.query(`UPDATE posts SET views = views + 1 WHERE postid = $1`, [
        postId,
      ]);
    }

    // Lưu hoặc cập nhật thời gian xem
    await pool.query(
      `INSERT INTO viewed_posts (userid, postid)
       VALUES ($1, $2)
       ON CONFLICT (userid, postid)
       DO UPDATE SET viewed_at = CURRENT_TIMESTAMP`,
      [userId, postId]
    );
  },
  getParentCategoryIdByPost: async (postId) => {
    const result = await pool.query(
      `
    SELECT DISTINCT 
      CASE 
        WHEN c.parent_id IS NULL THEN c.id 
        ELSE c.parent_id 
      END AS parent_id
      FROM posts p
      JOIN post_categories pc ON p.postid = pc.postid
      JOIN categories c ON pc.categoryid = c.id
      LEFT JOIN categories cp ON c.parent_id = cp.id
      WHERE p.postid = $1
    `,
      [postId]
    );

    return result.rows[0]?.parent_id || null;
  },
  getPostsByParentCategory: async (
    parentId,
    excludePostId = null,
    limit = 10
  ) => {
    let query = `
      SELECT DISTINCT p.*
      FROM posts p
      JOIN post_categories pc ON p.postid = pc.postid
      JOIN categories c ON pc.categoryid = c.id
      WHERE (c.parent_id = $1 OR c.id = $1)
        AND p.status = 'published'
    `;

    const params = [parentId];

    if (excludePostId) {
      query += ` AND p.postid != $2`;
      query += ` ORDER BY p.views DESC LIMIT $3`;
      params.push(excludePostId, limit);
    } else {
      query += ` ORDER BY p.views DESC LIMIT $2`;
      params.push(limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },
  getLatestPosts: async (limit = 10) => {
    const result = await pool.query(
      `SELECT postid, title, slug, featuredimage, createdat 
       FROM posts 
       WHERE status = 'published'
       ORDER BY publishedat DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },
  updateStatus: async (id, status) => {
    const result = await pool.query(
      `UPDATE posts SET 
        status = CAST($1 AS VARCHAR),
        updatedat = NOW(),
        publishedat = CASE 
          WHEN CAST($1 AS VARCHAR) = 'published' AND publishedat IS NULL THEN NOW()
          WHEN CAST($1 AS VARCHAR) != 'published' THEN NULL
          ELSE publishedat
        END
      WHERE postid = $2
      RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      throw new Error("Post not found");
    }

    return result.rows[0];
  },
};

module.exports = Post;

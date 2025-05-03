const db = require("../config/db.config");

const Category = {
  // Tạo danh mục mới
  create: async (name, slug, description, parentId) => {
    const query = `
      INSERT INTO categories (name, slug, description, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, slug, description, parentId];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Lấy tất cả danh mục (có thể lọc theo parent_id)
  findAll: async (parentId = null) => {
    let query = "SELECT * FROM categories";
    let values = [];

    if (parentId !== null) {
      query += " WHERE parent_id = $1";
      values.push(parentId);
    } else {
      query += " WHERE parent_id IS NULL";
    }

    query += " ORDER BY name ASC";
    const { rows } = await db.query(query, values);
    return rows;
  },

  // Lấy danh mục theo ID
  findById: async (id) => {
    const query = "SELECT * FROM categories WHERE id = $1";
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  // Lấy danh mục theo slug
  findBySlug: async (slug) => {
    const query = "SELECT * FROM categories WHERE slug = $1";
    const { rows } = await db.query(query, [slug]);
    return rows[0];
  },

  // Cập nhật danh mục
  update: async (id, name, slug, description, parentId) => {
    const query = `
      UPDATE categories
      SET name = $1, slug = $2, description = $3, parent_id = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const values = [name, slug, description, parentId, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Xóa danh mục
  delete: async (id) => {
    const query = `
      WITH RECURSIVE subcategories AS (
        SELECT id FROM categories WHERE id = $1
        UNION ALL
        SELECT c.id FROM categories c
        INNER JOIN subcategories s ON c.parent_id = s.id
      )
      DELETE FROM categories WHERE id IN (SELECT id FROM subcategories)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id]);
    // Trả về danh mục gốc đã xóa
    return rows.find((row) => row.id === parseInt(id)) || null;
  },

  // Kiểm tra slug đã tồn tại chưa (trừ trường hợp đang cập nhật)
  isSlugExists: async (slug, excludeId = null) => {
    let query = "SELECT id FROM categories WHERE slug = $1";
    const values = [slug];

    if (excludeId) {
      query += " AND id != $2";
      values.push(excludeId);
    }

    const { rows } = await db.query(query, values);
    return rows.length > 0;
  },

  // Lấy tất cả danh mục con của một danh mục
  findChildren: async (parentId) => {
    const query =
      "SELECT * FROM categories WHERE parent_id = $1 ORDER BY name ASC";
    const { rows } = await db.query(query, [parentId]);
    return rows;
  },

  // Lấy cây danh mục (bao gồm cả danh mục con)
  getCategoryTree: async () => {
    // Lấy tất cả danh mục
    const query =
      "SELECT * FROM categories ORDER BY parent_id NULLS FIRST, name ASC";
    const { rows } = await db.query(query);

    // Xây dựng cây danh mục
    const categoryMap = {};
    const roots = [];

    // Tạo map id -> category
    rows.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // Xây dựng cây
    rows.forEach((category) => {
      if (category.parent_id) {
        if (categoryMap[category.parent_id]) {
          categoryMap[category.parent_id].children.push(
            categoryMap[category.id]
          );
        }
      } else {
        roots.push(categoryMap[category.id]);
      }
    });

    return roots;
  },
};

module.exports = Category;

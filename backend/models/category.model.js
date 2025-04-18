const pool = require('../config/db.config');

const Category = {
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        p.Name AS ParentName,
        (SELECT COUNT(*) FROM Posts p WHERE p.CategoryID = c.CategoryID) AS PostCount
      FROM Categories c
      LEFT JOIN Categories p ON c.ParentID = p.CategoryID
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        p.Name AS ParentName,
        (SELECT COUNT(*) FROM Posts p WHERE p.CategoryID = c.CategoryID) AS PostCount
      FROM Categories c
      LEFT JOIN Categories p ON c.ParentID = p.CategoryID
      WHERE c.CategoryID = ?
    `, [id]);
    return rows[0];
  },

  create: async (category) => {
    const [result] = await pool.query(
      `INSERT INTO Categories (Name, Slug, Description, ParentID)
       VALUES (?, ?, ?, ?)`,
      [
        category.name,
        category.slug,
        category.description || null,
        category.parentId || null
      ]
    );
    return Category.findById(result.insertId);
  },

  update: async (id, category) => {
    await pool.query(
      `UPDATE Categories SET
        Name = ?,
        Slug = ?,
        Description = ?,
        ParentID = ?
      WHERE CategoryID = ?`,
      [
        category.name,
        category.slug,
        category.description || null,
        category.parentId || null,
        id
      ]
    );
    return Category.findById(id);
  },

  delete: async (id) => {
    // Check if category has posts
    const [postCount] = await pool.query(
      'SELECT COUNT(*) AS PostCount FROM Posts WHERE CategoryID = ?',
      [id]
    );
    
    if (postCount[0].PostCount > 0) {
      throw new Error('Cannot delete category with posts');
    }
    
    // Check if category has children
    const [childCount] = await pool.query(
      'SELECT COUNT(*) AS ChildCount FROM Categories WHERE ParentID = ?',
      [id]
    );
    
    if (childCount[0].ChildCount > 0) {
      throw new Error('Cannot delete category with subcategories');
    }
    
    const [result] = await pool.query(
      'DELETE FROM Categories WHERE CategoryID = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Category;
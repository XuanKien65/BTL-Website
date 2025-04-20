const Category = require("../models/category.model");

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent_id } = req.body;

    // Validate input
    if (!name || !slug) {
      return res.status(400).json({ error: "Tên và slug là bắt buộc" });
    }

    // Kiểm tra slug đã tồn tại chưa
    const slugExists = await Category.isSlugExists(slug);
    if (slugExists) {
      return res.status(400).json({ error: "Slug đã tồn tại" });
    }

    // Kiểm tra parent_id có hợp lệ không
    if (parent_id) {
      const parent = await Category.findById(parent_id);
      if (!parent) {
        return res.status(400).json({ error: "Danh mục cha không tồn tại" });
      }
    }

    // Tạo danh mục
    const newCategory = await Category.create(
      name,
      slug,
      description,
      parent_id || null
    );

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy tất cả danh mục (có thể lọc theo parent_id)
exports.getAllCategories = async (req, res) => {
  try {
    const { parent_id } = req.query;

    let categories;
    if (parent_id === undefined) {
      // Lấy toàn bộ cây danh mục
      categories = await Category.getCategoryTree();
    } else if (parent_id === "null") {
      // Chỉ lấy danh mục cha (parent_id = null)
      categories = await Category.findAll();
    } else {
      // Lấy danh mục con của parent_id cụ thể
      categories = await Category.findAll(parseInt(parent_id));
    }

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy thông tin một danh mục
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }

    // Lấy danh mục con (nếu có)
    const children = await Category.findChildren(id);

    res.json({
      success: true,
      data: {
        ...category,
        children,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, parent_id } = req.body;

    // Validate input
    if (!name || !slug) {
      return res.status(400).json({ error: "Tên và slug là bắt buộc" });
    }

    // Kiểm tra danh mục có tồn tại không
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }

    // Kiểm tra slug đã tồn tại chưa (trừ chính nó)
    const slugExists = await Category.isSlugExists(slug, id);
    if (slugExists) {
      return res.status(400).json({ error: "Slug đã tồn tại" });
    }

    // Kiểm tra parent_id có hợp lệ không
    if (parent_id) {
      if (parent_id == id) {
        return res
          .status(400)
          .json({ error: "Danh mục không thể là cha của chính nó" });
      }

      const parent = await Category.findById(parent_id);
      if (!parent) {
        return res.status(400).json({ error: "Danh mục cha không tồn tại" });
      }
    }

    // Cập nhật danh mục
    const updatedCategory = await Category.update(
      id,
      name,
      slug,
      description,
      parent_id || null
    );

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra danh mục có tồn tại không
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }

    // Kiểm tra danh mục có danh mục con không
    const children = await Category.findChildren(id);
    if (children.length > 0) {
      return res.status(400).json({
        error:
          "Không thể xóa danh mục vì có danh mục con. Hãy xóa hoặc di chuyển các danh mục con trước.",
      });
    }

    // Xóa danh mục
    const deletedCategory = await Category.delete(id);

    res.json({
      success: true,
      data: deletedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

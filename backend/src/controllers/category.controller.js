const prisma = require("../config/db");

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * GET /api/admin/categories
 * Returns all categories with product counts formatted for the frontend table.
 */
async function getCategories(req, res, next) {
  try {
    const list = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { id: "asc" },
    });

    const formatted = list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      status: c.status.toLowerCase(),
      products: c._count.products,
      createdAt: c.createdAt,
    }));

    return res.json({
      success: true,
      message: "Categories retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/categories/:id
 */
async function getCategoryById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    return res.json({
      success: true,
      message: "Category retrieved successfully.",
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        status: category.status.toLowerCase(),
        products: category._count.products,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/categories
 */
async function createCategory(req, res, next) {
  try {
    let { name, slug, description, image, status } = req.body;
    if (!slug) {
      slug = generateSlug(name);
    } else {
      slug = generateSlug(slug);
    }

    // Check uniqueness
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A category with this name or slug already exists.",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        status: status || "ACTIVE",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: {
        ...category,
        status: category.status.toLowerCase(),
        products: 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/categories/:id
 */
async function updateCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    let { name, slug, description, image, status } = req.body;
    if (slug) slug = generateSlug(slug);

    // Collision check
    if (name || slug) {
      const existing = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(name ? [{ name }] : []),
            ...(slug ? [{ slug }] : []),
          ],
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another category already exists with this name or slug.",
        });
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(status && { status }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return res.json({
      success: true,
      message: "Category updated successfully.",
      data: {
        ...updated,
        status: updated.status.toLowerCase(),
        products: updated._count.products,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id
 * Safe deletion: blocks deletion if category contains products.
 */
async function deleteCategory(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete '${category.name}' because it contains ${category._count.products} product(s). Please move or remove the products first.`,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};


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

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatProduct(p) {
  const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    category: p.category?.name || "",
    categoryId: p.categoryId,
    regularPrice: Number(p.regularPrice),
    salePrice: p.salePrice !== null ? Number(p.salePrice) : null,
    costPrice: p.costPrice !== null ? Number(p.costPrice) : null,
    stock: p.stock,
    stockStatus: p.stock > 0 ? "in_stock" : "out_of_stock",
    status: p.status.toLowerCase(),
    featured: p.featured,
    newArrival: p.newArrival,
    added: formatDate(p.createdAt),
    createdAt: p.createdAt,
    shortDescription: p.shortDescription || "",
    description: p.description || "",
    material: p.material || "",
    jewelleryType: p.jewelleryType || "",
    weight: p.weight || "",
    size: p.size || "",
    colour: p.colour || "",
    occasion: p.occasion || "",
    collection: p.collection || "",
    tags: p.tags || "",
    primaryImage: primaryImg?.imageUrl || null,
    images: (p.images || []).map((img) => ({
      id: img.id,
      url: img.imageUrl,
      isPrimary: img.isPrimary,
      displayOrder: img.displayOrder,
    })),
  };
}

/**
 * GET /api/admin/products
 * Server-side search, filtering, sorting, pagination.
 */
async function getProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { query, category, status, stock, sort } = req.query;

    const where = {};

    // Search by name or SKU
    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      where.category = {
        name: category,
      };
    }

    // Status filter
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Stock filter
    if (stock && stock !== "all") {
      if (stock === "out") {
        where.stock = { lte: 0 };
      } else if (stock === "low") {
        where.stock = { gt: 0, lte: 5 };
      } else if (stock === "in") {
        where.stock = { gt: 5 };
      }
    }

    // Sorting
    let orderBy = { id: "desc" };
    if (sort === "price-asc") {
      orderBy = { regularPrice: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { regularPrice: "desc" };
    } else if (sort === "name") {
      orderBy = { name: "asc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      success: true,
      message: "Products retrieved successfully.",
      data: products.map(formatProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products/:id
 */
async function getProductById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.json({
      success: true,
      message: "Product retrieved successfully.",
      data: formatProduct(product),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products
 */
async function createProduct(req, res, next) {
  try {
    const data = req.body;
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    // Resolve categoryId
    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const foundCategory = await prisma.category.findFirst({
        where: {
          OR: [{ name: data.category }, { slug: generateSlug(data.category) }],
        },
      });
      if (foundCategory) {
        categoryId = foundCategory.id;
      }
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category for the product.",
      });
    }

    // Check SKU & Slug uniqueness
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ sku: data.sku }, { slug }],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A product with ${existing.sku === data.sku ? "SKU '" + data.sku + "'" : "slug '" + slug + "'"} already exists.`,
      });
    }

    // Multi-table creation using transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku: data.sku,
          categoryId,
          regularPrice: data.regularPrice,
          salePrice: data.salePrice || null,
          costPrice: data.costPrice || null,
          stock: data.stock || 0,
          status: data.status || "ACTIVE",
          featured: Boolean(data.featured),
          newArrival: Boolean(data.newArrival),
          shortDescription: data.shortDescription || null,
          description: data.description || null,
          material: data.material || null,
          jewelleryType: data.jewelleryType || null,
          weight: data.weight || null,
          size: data.size || null,
          colour: data.colour || null,
          occasion: data.occasion || null,
          collection: data.collection || null,
          tags: data.tags || null,
        },
      });

      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, i) => ({
            productId: prod.id,
            imageUrl: img.url,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
            displayOrder: img.displayOrder || i,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: prod.id },
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: formatProduct(newProduct),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 */
async function updateProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const data = req.body;
    let slug = data.slug ? generateSlug(data.slug) : data.name ? generateSlug(data.name) : undefined;

    // Check collision for SKU or slug
    if (data.sku || slug) {
      const existing = await prisma.product.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(data.sku ? [{ sku: data.sku }] : []),
            ...(slug ? [{ slug }] : []),
          ],
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Another product already uses this ${existing.sku === data.sku ? "SKU" : "slug"}.`,
        });
      }
    }

    // Resolve categoryId if category name passed
    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const foundCategory = await prisma.category.findFirst({
        where: {
          OR: [{ name: data.category }, { slug: generateSlug(data.category) }],
        },
      });
      if (foundCategory) {
        categoryId = foundCategory.id;
      }
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const updateData = {
        ...(data.name && { name: data.name }),
        ...(slug && { slug }),
        ...(data.sku && { sku: data.sku }),
        ...(categoryId && { categoryId }),
        ...(data.regularPrice !== undefined && { regularPrice: data.regularPrice }),
        ...(data.salePrice !== undefined && { salePrice: data.salePrice }),
        ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.status && { status: data.status }),
        ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
        ...(data.newArrival !== undefined && { newArrival: Boolean(data.newArrival) }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.material !== undefined && { material: data.material }),
        ...(data.jewelleryType !== undefined && { jewelleryType: data.jewelleryType }),
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.size !== undefined && { size: data.size }),
        ...(data.colour !== undefined && { colour: data.colour }),
        ...(data.occasion !== undefined && { occasion: data.occasion }),
        ...(data.collection !== undefined && { collection: data.collection }),
        ...(data.tags !== undefined && { tags: data.tags }),
      };

      await tx.product.update({
        where: { id },
        data: updateData,
      });

      // Update images if provided
      if (data.images && Array.isArray(data.images)) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img, i) => ({
              productId: id,
              imageUrl: img.url,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
              displayOrder: img.displayOrder || i,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          },
        },
      });
    });

    return res.json({
      success: true,
      message: "Product updated successfully.",
      data: formatProduct(updatedProduct),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 */
async function deleteProduct(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: `Product '${product.name}' deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};


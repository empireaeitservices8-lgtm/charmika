import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { products as mockProducts } from "@/lib/mockData";

export const dynamic = "force-dynamic";

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function formatDate(date: any) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatProduct(p: any) {
  const primaryImg = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    category: p.category?.name || "",
    categoryId: p.categoryId,
    regularPrice: Number(p.regularPrice),
    salePrice: p.salePrice !== null && p.salePrice !== undefined ? Number(p.salePrice) : null,
    costPrice: p.costPrice !== null && p.costPrice !== undefined ? Number(p.costPrice) : null,
    stock: p.stock,
    stockStatus: p.stock > 0 ? "in_stock" : "out_of_stock",
    status: (p.status || "ACTIVE").toLowerCase(),
    featured: Boolean(p.featured),
    newArrival: Boolean(p.newArrival),
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
    images: (p.images || []).map((img: any) => ({
      id: img.id,
      url: img.imageUrl,
      isPrimary: Boolean(img.isPrimary),
      displayOrder: img.displayOrder || 0,
    })),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const stock = searchParams.get("stock");
    const sort = searchParams.get("sort");

    const where: any = {};

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    if (category && category !== "all") {
      where.category = {
        name: category,
      };
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (stock && stock !== "all") {
      if (stock === "out") {
        where.stock = { lte: 0 };
      } else if (stock === "low") {
        where.stock = { gt: 0, lte: 5 };
      } else if (stock === "in") {
        where.stock = { gt: 5 };
      }
    }

    let orderBy: any = { id: "desc" };
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

    return NextResponse.json({
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
  } catch (err: any) {
    console.warn("Failed to retrieve products from database, falling back to mockData:", err);
    const formatted = mockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category: p.category,
      categoryId: 1,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      costPrice: p.costPrice || null,
      stock: p.stock,
      stockStatus: p.stock > 0 ? "in_stock" : "out_of_stock",
      status: p.status,
      featured: p.featured,
      newArrival: p.newArrival,
      added: p.added,
      createdAt: new Date().toISOString(),
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
      primaryImage:
        p.category === "Chokers"
          ? "/images/chokers.png"
          : p.category === "Haarams"
          ? "/images/long-haarams.png"
          : "/images/temple-jewellery.png",
      images: [
        {
          id: 1,
          url:
            p.category === "Chokers"
              ? "/images/chokers.png"
              : p.category === "Haarams"
              ? "/images/long-haarams.png"
              : "/images/temple-jewellery.png",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
    }));

    return NextResponse.json({
      success: true,
      message: "Products retrieved from catalog.",
      data: formatted,
      pagination: {
        page: 1,
        limit: 10,
        total: formatted.length,
        totalPages: 1,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name || `product-${Date.now()}`);

    // Resolve categoryId
    let categoryId = data.categoryId ? Number(data.categoryId) : undefined;
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

    // Default to first category if not specified
    if (!categoryId) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) {
        categoryId = firstCat.id;
      } else {
        const createdCat = await prisma.category.create({
          data: { name: "Jewellery", slug: "jewellery", status: "ACTIVE" },
        });
        categoryId = createdCat.id;
      }
    }

    const sku = data.sku || `CH-${Date.now()}`;

    // Check SKU & Slug uniqueness
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ sku }, { slug }],
      },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku,
          categoryId: categoryId!,
          regularPrice: Number(data.regularPrice || 0),
          salePrice: data.salePrice !== undefined && data.salePrice !== null && data.salePrice !== "" ? Number(data.salePrice) : null,
          costPrice: data.costPrice !== undefined && data.costPrice !== null && data.costPrice !== "" ? Number(data.costPrice) : null,
          stock: data.stock !== undefined ? Number(data.stock) : 0,
          status: (data.status || "ACTIVE").toUpperCase() as any,
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

      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img: any, i: number) => ({
            productId: prod.id,
            imageUrl: typeof img === "string" ? img : img.url,
            isPrimary: img.isPrimary !== undefined ? Boolean(img.isPrimary) : i === 0,
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

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: formatProduct(newProduct),
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create product." },
      { status: 500 }
    );
  }
}

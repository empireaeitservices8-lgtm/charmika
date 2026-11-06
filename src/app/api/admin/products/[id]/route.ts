import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID." }, { status: 400 });
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
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product retrieved successfully.",
      data: formatProduct(product),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve product." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID." }, { status: 400 });
    }

    const data = await req.json();
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
        if (slug) slug = `${slug}-${Date.now()}`;
      }
    }

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

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        ...(data.name && { name: data.name }),
        ...(slug && { slug }),
        ...(data.sku && { sku: data.sku }),
        ...(categoryId && { categoryId }),
        ...(data.regularPrice !== undefined && { regularPrice: Number(data.regularPrice) }),
        ...(data.salePrice !== undefined && {
          salePrice: data.salePrice !== null && data.salePrice !== "" ? Number(data.salePrice) : null,
        }),
        ...(data.costPrice !== undefined && {
          costPrice: data.costPrice !== null && data.costPrice !== "" ? Number(data.costPrice) : null,
        }),
        ...(data.stock !== undefined && { stock: Number(data.stock) }),
        ...(data.status && { status: data.status.toUpperCase() }),
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

      if (data.images && Array.isArray(data.images)) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img: any, i: number) => ({
              productId: id,
              imageUrl: typeof img === "string" ? img : img.url,
              isPrimary: img.isPrimary !== undefined ? Boolean(img.isPrimary) : i === 0,
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

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      data: formatProduct(updatedProduct),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: `Product '${product.name}' deleted successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

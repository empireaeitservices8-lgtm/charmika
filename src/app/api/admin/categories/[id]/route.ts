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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid category ID." }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve category." },
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
      return NextResponse.json({ success: false, message: "Invalid category ID." }, { status: 400 });
    }

    let { name, slug, description, image, status } = await req.json();
    if (slug) slug = generateSlug(slug);

    if (name || slug) {
      const existing = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [...(name ? [{ name }] : []), ...(slug ? [{ slug }] : [])],
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, message: "Another category already exists with this name or slug." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(status && { status: status.toUpperCase() }),
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
      data: {
        ...updated,
        status: updated.status.toLowerCase(),
        products: updated._count.products,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update category." },
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
      return NextResponse.json({ success: false, message: "Invalid category ID." }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete '${category.name}' because it contains ${category._count.products} product(s). Please move or remove the products first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete category." },
      { status: 500 }
    );
  }
}

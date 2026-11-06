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

export async function GET() {
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
      status: (c.status || "ACTIVE").toLowerCase(),
      products: c._count.products,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      success: true,
      message: "Categories retrieved successfully.",
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve categories." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let { name, slug, description, image, status } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    if (!slug) {
      slug = generateSlug(name);
    } else {
      slug = generateSlug(slug);
    }

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A category with this name or slug already exists." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        status: (status || "ACTIVE").toUpperCase() as any,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        data: {
          ...category,
          status: category.status.toLowerCase(),
          products: 0,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create category." },
      { status: 500 }
    );
  }
}

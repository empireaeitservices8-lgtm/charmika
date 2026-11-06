import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth-helper";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession(req);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { name, email } = await req.json();
    const cleanEmail = email?.toLowerCase().trim();

    if (!name || !cleanEmail) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: 400 }
      );
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: { name, email: cleanEmail },
      select: { id: true, name: true, email: true, role: true, updatedAt: true },
    });

    return NextResponse.json({
      success: true,
      message: "Profile details updated successfully.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}

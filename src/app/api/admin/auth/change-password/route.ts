import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth-helper";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  const sessionAdmin = await verifyAdminSession(req);
  if (!sessionAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current and new password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: sessionAdmin.id },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "The current password you provided is incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password has been updated successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to change password." },
      { status: 500 }
    );
  }
}

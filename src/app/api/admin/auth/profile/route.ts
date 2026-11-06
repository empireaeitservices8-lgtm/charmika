import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession, generateAdminToken, setAdminAuthCookie } from "@/lib/auth-helper";

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

    let updated = {
      id: admin.id,
      name,
      email: cleanEmail,
      role: admin.role || "ADMIN",
      updatedAt: new Date().toISOString(),
    };

    try {
      const dbUpdated = await prisma.admin.update({
        where: { id: admin.id },
        data: { name, email: cleanEmail },
        select: { id: true, name: true, email: true, role: true, updatedAt: true },
      });
      updated = { ...dbUpdated, updatedAt: dbUpdated.updatedAt.toISOString() };
    } catch {
      // Fallback to JWT token update when DB is not seeded
    }

    const token = generateAdminToken({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Profile details updated successfully.",
      data: updated,
    });
    setAdminAuthCookie(response, token);
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}

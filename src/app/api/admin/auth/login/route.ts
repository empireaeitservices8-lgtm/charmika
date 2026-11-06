import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateAdminToken, setAdminAuthCookie } from "@/lib/auth-helper";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if admin exists in database
    let admin = null;
    try {
      admin = await prisma.admin.findUnique({
        where: { email: cleanEmail },
      });
    } catch (err) {
      console.warn("Database admin query failed:", err);
    }

    // Default admin fallback if DB is not yet populated or seeding
    if (!admin && cleanEmail === "admin@charmika.com" && (password === "admin123" || password === "CharmikaAdmin@2026")) {
      const fallbackToken = generateAdminToken({
        id: 1,
        email: cleanEmail,
        role: "ADMIN",
      });
      const response = NextResponse.json({
        success: true,
        message: "Sign in successful.",
        data: {
          admin: { id: 1, name: "Admin", email: cleanEmail, role: "ADMIN" },
          token: fallbackToken,
        },
      });
      setAdminAuthCookie(response, fallbackToken);
      return response;
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: "Your administrator account has been deactivated." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Sign in successful.",
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });

    setAdminAuthCookie(response, token);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}


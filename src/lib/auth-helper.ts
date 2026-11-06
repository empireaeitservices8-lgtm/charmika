import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "charmika_secure_admin_jwt_secret_key_2026_dev";
const JWT_EXPIRES_IN = "7d";

export function generateAdminToken(payload: { id: number; email: string; role: string; name?: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function setAdminAuthCookie(response: NextResponse, token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set("charmika_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAdminAuthCookie(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set("charmika_token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function verifyAdminSession(req: NextRequest) {
  try {
    let token = req.cookies.get("charmika_token")?.value;

    const authHeader = req.headers.get("authorization");
    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id) {
      return null;
    }

    try {
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (admin && admin.isActive) {
        return admin;
      }
    } catch {
      // Database not reachable; use verified JWT payload
    }

    return {
      id: decoded.id || 1,
      name: decoded.name || "Admin",
      email: decoded.email || "admin@charmika.com",
      role: decoded.role || "ADMIN",
      isActive: true,
    };
  } catch {
    return null;
  }
}

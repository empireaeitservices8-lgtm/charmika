import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-helper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await verifyAdminSession(req);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Current profile retrieved.",
    data: admin,
  });
}

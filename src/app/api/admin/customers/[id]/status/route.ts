import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid customer ID." }, { status: 400 });
    }

    const { status } = await req.json();
    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Status must be 'active' or 'inactive'." },
        { status: 400 }
      );
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: { status: status.toLowerCase() },
    });

    return NextResponse.json({
      success: true,
      message: `Customer account has been ${status.toLowerCase() === "active" ? "activated" : "deactivated"}.`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update status." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID." }, { status: 400 });
    }

    const { orderStatus, paymentStatus, comment } = await req.json();

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (orderStatus && orderStatus !== existingOrder.orderStatus) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            prevStatus: existingOrder.orderStatus,
            newStatus: orderStatus,
            comment: comment || null,
            updatedBy: "Admin",
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: {
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
        },
        include: {
          customer: true,
          items: true,
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: any) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCustomer(c: any) {
  const totalOrders = c.orders ? c.orders.length : 0;
  const totalSpending = c.orders
    ? c.orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0)
    : 0;

  const mostRecentOrder =
    c.orders && c.orders.length > 0
      ? {
          id: c.orders[0].id,
          orderNumber: c.orders[0].orderNumber,
          date: formatDate(c.orders[0].createdAt),
          amount: Number(c.orders[0].totalAmount),
          status: c.orders[0].orderStatus,
        }
      : null;

  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || "—",
    status: c.status || "active",
    address: c.address || "",
    city: c.city || "",
    state: c.state || "",
    postalCode: c.postalCode || "",
    registrationDate: formatDate(c.createdAt),
    createdAt: c.createdAt,
    updatedAt: formatDate(c.updatedAt),
    totalOrders,
    totalSpending,
    mostRecentOrder,
    addresses: (c.addresses || []).map((a: any) => ({
      id: a.id,
      fullName: a.fullName || c.name,
      phone: a.phone || c.phone,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 || "",
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      country: a.country || "India",
      isDefault: a.isDefault,
    })),
    orders: (c.orders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: formatDate(o.createdAt),
      totalAmount: Number(o.totalAmount),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      productNames: (o.items || []).map((i: any) => i.productName || i.product?.name).filter(Boolean).join(", "),
      itemsCount: o.items ? o.items.reduce((acc: number, i: any) => acc + i.quantity, 0) : 0,
    })),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid customer ID." }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              select: { productName: true, quantity: true },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Customer details retrieved successfully.",
      data: formatCustomer(customer),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve customer." },
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
      return NextResponse.json({ success: false, message: "Invalid customer ID." }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: { select: { id: true } } },
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const orderIds = (customer.orders || []).map((o) => o.id);
      if (orderIds.length > 0) {
        await tx.orderStatusHistory.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        await tx.orderItem.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        await tx.order.deleteMany({
          where: { id: { in: orderIds } },
        });
      }
      await tx.customerAddress.deleteMany({
        where: { customerId: id },
      });
      await tx.customer.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Customer '${customer.name}' has been deleted successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete customer." },
      { status: 500 }
    );
  }
}

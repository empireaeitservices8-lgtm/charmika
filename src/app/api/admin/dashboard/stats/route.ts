import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getUnifiedAdminProducts,
  getUnifiedAdminCategories,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [products, categories] = await Promise.all([
    getUnifiedAdminProducts(),
    getUnifiedAdminCategories(),
  ]);

  let totalOrders = 0;
  let totalCustomers = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];

  try {
    const [ordersCount, customersCount, orders] = await Promise.all([
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        include: { customer: true, items: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    totalOrders = ordersCount;
    totalCustomers = customersCount;

    const allValidOrders = await prisma.order.findMany({
      where: { orderStatus: { notIn: ['CANCELLED', 'REFUNDED'] } },
      select: { totalAmount: true },
    });
    totalRevenue = allValidOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    recentOrders = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customer?.name || 'Guest',
      email: o.customer?.email || '',
      phone: o.customer?.phone || '',
      items: o.items.length,
      total: Number(o.totalAmount),
      payment: o.paymentStatus.toLowerCase(),
      status: o.orderStatus.toLowerCase(),
      date: new Date(o.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));
  } catch {
    // Database not yet reachable for orders/customers
  }

  const lowStockProducts = products
    .filter((p) => p.stock <= 5)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      category: p.category,
    }));

  const recentProducts = products.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    regularPrice: p.regularPrice,
    salePrice: p.salePrice,
    stock: p.stock,
    status: p.status,
    added: p.added,
  }));

  return NextResponse.json({
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: {
      totalProducts: products.length,
      totalOrders,
      totalCustomers,
      totalCategories: categories.length,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      recentProducts,
    },
  });
}

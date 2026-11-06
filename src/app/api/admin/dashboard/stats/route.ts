import { NextResponse } from 'next/server';
import {
  getUnifiedAdminProducts,
  getUnifiedAdminCategories,
  getUnifiedOrders,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [products, categories, orders] = await Promise.all([
    getUnifiedAdminProducts(),
    getUnifiedAdminCategories(),
    getUnifiedOrders(),
  ]);

  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail).filter(Boolean));
  const totalCustomers = uniqueCustomers.size;
  const totalRevenue = orders
    .filter((o) => o.orderStatus.toLowerCase() !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const recentOrders = orders.slice(0, 10).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.customerName,
    email: o.customerEmail,
    phone: o.customerPhone,
    items: o.itemsCount,
    total: o.totalAmount,
    payment: o.paymentStatus.toLowerCase(),
    status: o.orderStatus.toLowerCase(),
    date: o.formattedDate,
  }));

  const activePublic = products.filter((p) => p.status === 'active').length;
  const inactive = products.filter((p) => p.status !== 'active').length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;

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
      activePublic,
      inactive,
      outOfStock,
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

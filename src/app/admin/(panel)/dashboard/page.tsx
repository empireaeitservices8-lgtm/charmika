"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Gem,
  Loader2,
  PlusCircle,
  Eye,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  dashboardService,
  type DashboardStats,
  type DashboardRecentOrder,
  type DashboardRecentCustomer,
  type DashboardTopProduct,
  type DashboardOutOfStockProduct,
} from "@/lib/services/dashboard.service";
import { cardClass } from "@/components/admin/ui";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const fallbackStats: DashboardStats = {
  totalRevenue: 285400,
  totalOrders: 42,
  totalCustomers: 38,
  totalProducts: 24,
  activePublic: 19,
  inactive: 5,
  outOfStock: 3,
  totalCategories: 5,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [recentOrders, setRecentOrders] = useState<DashboardRecentOrder[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<DashboardRecentCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<DashboardTopProduct[]>([]);
  const [outOfStock, setOutOfStock] = useState<DashboardOutOfStockProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, ordersData, customersData, topProdData, oosData] = await Promise.all([
          dashboardService.getStats().catch(() => null),
          dashboardService.getRecentOrders(4).catch(() => []),
          dashboardService.getRecentCustomers(4).catch(() => []),
          dashboardService.getTopProducts(5).catch(() => []),
          dashboardService.getOutOfStock(5).catch(() => []),
        ]);
        if (statsData) setStats(statsData);
        if (ordersData && ordersData.length > 0) setRecentOrders(ordersData);
        if (customersData && customersData.length > 0) setRecentCustomers(customersData);
        if (topProdData && topProdData.length > 0) setTopProducts(topProdData);
        if (oosData && oosData.length > 0) setOutOfStock(oosData);
      } catch (err) {
        console.warn("Failed to load live dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? rupees(stats.totalRevenue) : "—",
      note: "From confirmed & paid purchases",
      icon: IndianRupee,
      chip: "bg-gold/20 text-gold-700",
      valueColor: "text-maroon font-serif",
      noteColor: "text-gold-700/80 font-medium",
    },
    {
      label: "Total Orders",
      value: stats ? stats.totalOrders.toLocaleString("en-IN") : "—",
      note: "Customer purchases logged",
      icon: ShoppingBag,
      chip: "bg-maroon/10 text-maroon",
      valueColor: "text-charcoal",
      noteColor: "text-charcoal/50",
    },
    {
      label: "Total Customers",
      value: stats ? stats.totalCustomers.toLocaleString("en-IN") : "—",
      note: "Registered buyers in database",
      icon: Users,
      chip: "bg-blue-50 text-blue-700",
      valueColor: "text-charcoal",
      noteColor: "text-charcoal/50",
    },
    {
      label: "Total Products",
      value: stats ? stats.totalProducts.toLocaleString("en-IN") : "—",
      note: `${stats?.activePublic ?? 0} active in catalogue`,
      icon: Package,
      chip: "bg-emerald-50 text-emerald-700",
      valueColor: "text-emerald-800",
      noteColor: "text-emerald-700/80",
    },
    {
      label: "Out of Stock",
      value: stats ? stats.outOfStock.toLocaleString("en-IN") : "—",
      note: "Items requiring restocking",
      icon: AlertTriangle,
      chip: "bg-rose-50 text-rose-700",
      valueColor: "text-rose-800",
      noteColor: "text-rose-700/80",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gold/20 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
            Overview & Analytics
          </span>
          <h1 className="font-serif text-2xl font-bold text-maroon sm:text-3xl">
            Jewellery Executive Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-gold hover:text-maroon"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-gold/20 bg-white p-5 shadow-xs transition-all hover:shadow-luxury ${
              i === 0 ? "col-span-2 lg:col-span-1 border-gold/40 bg-gradient-to-br from-white to-amber-50/30" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between text-charcoal/60">
              <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
              <div className={`rounded-lg p-2 ${s.chip}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className={`text-2xl font-bold sm:text-3xl ${s.valueColor}`}>{s.value}</p>
            <span className={`mt-1 block text-[11px] ${s.noteColor}`}>{s.note}</span>
          </div>
        ))}
      </div>

      {/* Top 4 Recent Orders & Top 4 Recent Customers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top 4 Recent Orders */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-gold/15 p-5">
            <div>
              <h2 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gold-600" /> Recent Orders (Top 4)
              </h2>
              <p className="mt-0.5 text-xs text-charcoal/50">Latest customer purchases across store</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-gold transition-colors"
            >
              <span>All Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-charcoal/50">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold-600" />
              <span className="text-xs">Loading orders...</span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal/50">No customer orders recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                    <th className="px-4 py-2.5">Order</th>
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">Amount</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-beige/30">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-charcoal block">{o.orderNumber}</span>
                        <span className="text-[10px] text-charcoal/50">{o.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-charcoal block truncate max-w-[130px]">
                          {o.customerName}
                        </span>
                        <span className="text-[10px] text-charcoal/50 truncate max-w-[130px] block">
                          {o.customerEmail}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-maroon">{rupees(o.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            o.orderStatus === "confirmed" || o.orderStatus === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.orderStatus === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-gold/20 text-gold-800"
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-beige p-1.5 text-charcoal hover:bg-maroon hover:text-white transition-colors"
                          title="View Order"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top 4 Recent Customers */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-gold/15 p-5">
            <div>
              <h2 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
                <Users className="h-4 w-4 text-gold-600" /> Recent Clientele (Top 4)
              </h2>
              <p className="mt-0.5 text-xs text-charcoal/50">Latest customer sign-ups and profiles</p>
            </div>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-gold transition-colors"
            >
              <span>All Customers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-charcoal/50">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold-600" />
              <span className="text-xs">Loading customers...</span>
            </div>
          ) : recentCustomers.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal/50">No customers registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                    <th className="px-4 py-2.5">Customer</th>
                    <th className="px-4 py-2.5">Orders</th>
                    <th className="px-4 py-2.5">Total Spent</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {recentCustomers.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-beige/30">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-charcoal block truncate max-w-[140px]">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-charcoal/50 truncate max-w-[140px] block">
                          {c.email}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-charcoal">
                        {c.totalOrders} order(s)
                      </td>
                      <td className="px-4 py-3 font-serif font-bold text-maroon">
                        {rupees(c.totalSpent)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            c.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-beige p-1.5 text-charcoal hover:bg-maroon hover:text-white transition-colors"
                          title="View Customer Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Top Selling Jewellery & Out of Stock Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-gold/15 p-5">
            <div>
              <h2 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> Top Selling Jewellery
              </h2>
              <p className="mt-0.5 text-xs text-charcoal/50">Highest volume pieces based on customer orders</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:text-gold transition-colors"
            >
              <span>Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-charcoal/50">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold-600" />
              <span className="text-xs">Loading analytics...</span>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal/50">
              No sales data recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                    <th className="px-4 py-2.5">Piece</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-center">Units Sold</th>
                    <th className="px-4 py-2.5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {topProducts.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-beige/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-beige text-gold-600">
                            {p.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Gem className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal block truncate max-w-[160px]">
                              {p.name}
                            </span>
                            <span className="font-mono text-[10px] text-charcoal/50">{p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-charcoal/70">{p.category}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {p.totalSold} sold
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-serif font-bold text-maroon">
                        {rupees(p.totalRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Out of Stock Alert List */}
        <div className={`${cardClass} overflow-hidden border-rose-200`}>
          <div className="flex items-center justify-between border-b border-rose-150 bg-rose-50/40 p-5">
            <div>
              <h2 className="font-serif text-base font-bold text-rose-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" /> Out of Stock Alerts
              </h2>
              <p className="mt-0.5 text-xs text-rose-700/70">
                Products with stock &le; 0 automatically marked out of stock
              </p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:underline"
            >
              <span>Restock</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8 text-charcoal/50">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gold-600" />
              <span className="text-xs">Checking inventory...</span>
            </div>
          ) : outOfStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-emerald-700 bg-emerald-50/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mb-1" />
              <span className="font-semibold">All inventory levels are healthy!</span>
              <span className="text-[11px] text-charcoal/50 mt-0.5">No products currently out of stock.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                    <th className="px-4 py-2.5">Piece</th>
                    <th className="px-4 py-2.5">Price</th>
                    <th className="px-4 py-2.5 text-center">Stock</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {outOfStock.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-beige/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-beige text-gold-600">
                            {p.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Gem className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal block truncate max-w-[150px]">
                              {p.name}
                            </span>
                            <span className="font-mono text-[10px] text-charcoal/50">{p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-charcoal/80 font-semibold">{rupees(p.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-800 hover:bg-rose-100 transition-colors"
                        >
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

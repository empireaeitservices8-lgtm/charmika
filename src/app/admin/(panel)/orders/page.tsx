"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Eye, ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, cardClass } from "@/components/admin/ui";
import { orderService, type Order } from "@/lib/services/order.service";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll({
        page,
        limit: 10,
        query,
        orderStatus,
        paymentStatus,
      });
      setOrders(res.orders);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, query, orderStatus, paymentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function clearFilters() {
    setQuery("");
    setOrderStatus("all");
    setPaymentStatus("all");
    setPage(1);
  }

  const hasActiveFilters = Boolean(
    query.trim() || orderStatus !== "all" || paymentStatus !== "all"
  );

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Sales & Dispatch" title="Order Management" />

      {/* Search and Filters */}
      <div className={`${cardClass} flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by order ID or customer name..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={orderStatus}
            onChange={(e) => {
              setOrderStatus(e.target.value);
              setPage(1);
            }}
            className={`${inputClass} lg:w-48`}
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className={`${inputClass} lg:w-48`}
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gold/30 bg-beige/60 px-4 py-2.5 text-xs font-semibold text-maroon hover:bg-beige transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center p-20 text-charcoal/50">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
            <span className="text-sm">Loading customer orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-charcoal/60">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-gold-400" />
            <p className="text-base font-serif font-bold text-maroon">No orders match your filters</p>
            <p className="mt-1 text-charcoal/60">Try searching for a different order ID or change your status filters.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-gold hover:text-maroon transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters & Display All
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Items</th>
                  <th className="px-5 py-4">Total Amount</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Payment Status</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-beige/30">
                    <td className="px-5 py-4 font-mono font-semibold text-charcoal">
                      {o.orderNumber}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/customers/${o.customerId}`}
                        className="font-semibold text-maroon hover:underline"
                      >
                        {o.customerName}
                      </Link>
                      <span className="block text-[10px] text-charcoal/50">{o.customerEmail}</span>
                    </td>
                    <td className="px-5 py-4 text-charcoal/70">{o.formattedDate}</td>
                    <td className="px-5 py-4 text-center font-bold text-charcoal">
                      {o.itemsCount}
                    </td>
                    <td className="px-5 py-4 font-semibold text-maroon">
                      {rupees(o.totalAmount)}
                    </td>
                    <td className="px-5 py-4 uppercase tracking-wider text-charcoal/70 font-mono text-[11px]">
                      {o.paymentMethod}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          o.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        title="View & Manage Order"
                        className="inline-flex items-center gap-1 rounded-lg bg-beige px-3 py-1.5 text-[11px] font-semibold text-charcoal transition-colors hover:bg-maroon hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gold/15 px-4 py-3 text-xs text-charcoal/60">
          <span>
            Showing {orders.length} of {pagination.total} orders
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gold/20 p-1.5 transition-colors hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-maroon px-2.5 py-1 font-bold text-white">{page}</span>
            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gold/20 p-1.5 transition-colors hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


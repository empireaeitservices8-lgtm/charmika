"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Gem,
  Loader2,
  Save,
  User,
  ShieldCheck,
  RotateCcw,
  Clock,
  History,
  Tag,
  Receipt,
  FileText,
  MapPin,
  ExternalLink,
  Gift,
  ChevronRight,
  Package,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { cardClass, inputClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { orderService, type Order } from "@/lib/services/order.service";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Next possible status transitions
const NEXT_STATUS_MAP: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing in Workshop",
  shipped: "Shipped for Delivery",
  delivered: "Delivered to Customer",
  cancelled: "Cancelled",
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-purple-100 text-purple-800 border-purple-300",
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
        styles[status.toLowerCase()] || "bg-gold/20 text-gold-800 border-gold/40"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    refunded: "bg-zinc-100 text-zinc-700 border-zinc-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
        styles[status.toLowerCase()] || "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {status}
    </span>
  );
}

function OrderDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : null;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Status modification state
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [comment, setComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  async function loadOrder() {
    if (!id || isNaN(id)) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const data = await orderService.getById(id);
      setOrder(data);
      setOrderStatus(data.orderStatus);
      setPaymentStatus(data.paymentStatus);
    } catch (err) {
      console.error("Failed to load order:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function executeStatusChange(targetStatus: string, customComment?: string) {
    if (!id || !order) return;
    setUpdating(true);
    setFeedback(null);

    try {
      const updated = await orderService.updateStatus(id, {
        orderStatus: targetStatus,
        paymentStatus: targetStatus === "delivered" ? "paid" : paymentStatus,
        comment: customComment || `Admin transitioned order status to ${STATUS_LABELS[targetStatus] || targetStatus}`,
      });
      setOrder(updated);
      setOrderStatus(updated.orderStatus);
      setPaymentStatus(updated.paymentStatus);
      setFeedback({
        type: "success",
        message: `Order status successfully transitioned to '${targetStatus}'. Live inventory synchronized automatically in database.`,
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setFeedback({
        type: "error",
        message: err?.message || "Failed to update order status.",
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleManualFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);
    setFeedback(null);

    try {
      const updated = await orderService.updateStatus(id, {
        orderStatus,
        paymentStatus,
        comment: comment.trim() || undefined,
      });
      setOrder(updated);
      setComment("");
      setFeedback({
        type: "success",
        message: `Order status successfully updated to '${orderStatus}'. Inventory automatically synchronized.`,
      });
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      setFeedback({
        type: "error",
        message: err?.message || "Failed to update order status.",
      });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
        <span className="text-xs text-charcoal/60">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-xs text-rose-800">
        <p className="font-semibold">Order record not found</p>
        <p className="mt-1">This order does not exist or may have been deleted.</p>
        <button
          onClick={() => router.push("/admin/orders")}
          className="mt-4 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const nextStatuses = NEXT_STATUS_MAP[order.orderStatus.toLowerCase()] || [];

  // Parse notes for gift wrapping or special delivery packing instructions
  const rawNotes = order.customerNotes || "";
  const noteLines = rawNotes.split("\n").map((s) => s.trim()).filter(Boolean);
  const giftLines = noteLines
    .filter((l) => (l.startsWith("[Gift Wrap:") || l.startsWith("[Gift Card Note:") || l.toLowerCase().includes("gift")) && l.endsWith("]"))
    .map((l) => (l.startsWith("[") && l.endsWith("]") ? l.slice(1, -1) : l));
  const standardNotes = noteLines
    .filter((l) => !((l.startsWith("[Gift Wrap:") || l.startsWith("[Gift Card Note:") || l.toLowerCase().includes("gift")) && l.endsWith("]")))
    .join("\n");

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Metadata Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 transition-colors hover:text-maroon"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all orders
        </Link>
        <span className="text-[11px] text-charcoal/50">
          Last updated: {order.formattedUpdatedAt || order.formattedDate}
        </span>
      </div>

      {/* Main Order Header Banner */}
      <div className={`${cardClass} p-6 border-l-4 border-l-maroon`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-bold text-maroon sm:text-3xl">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.orderStatus} />
              <PaymentBadge status={order.paymentStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-charcoal/60">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-charcoal/80">Database Order ID:</span>
                <code className="rounded bg-beige px-2 py-0.5 font-mono text-[11px] font-bold text-maroon">
                  #{order.id}
                </code>
              </div>
              <span className="hidden sm:inline text-gold">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-maroon" />
                Placed on {order.formattedDate}
              </span>
              <span className="hidden sm:inline text-gold">•</span>
              <div>
                {order.stockDeducted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Stock Deducted from Warehouse
                  </span>
                ) : order.orderStatus === "cancelled" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Stock Restored
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                    Pending Confirmation
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Final Order Total Box */}
          <div className="rounded-xl border border-gold/30 bg-beige/40 p-4 text-left lg:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
              Final Order Total
            </p>
            <p className="font-serif text-2xl font-bold text-maroon sm:text-3xl">
              {rupees(order.totalAmount)}
            </p>
            <span className="text-[10px] text-charcoal/50">
              {order.itemsCount} total piece(s)
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Alerts */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs shadow-xs ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Quick Status Management Actions Bar */}
      <div className={`${cardClass} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-600" /> Quick Status Actions
            </h3>
            <p className="text-xs text-charcoal/50 mt-0.5">
              Instant one-click transitions with automatic warehouse stock sync.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {order.orderStatus === "cancelled" ? (
              <button
                onClick={() => executeStatusChange("pending", "Admin restored previously cancelled order to Pending")}
                disabled={updating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-gold hover:text-maroon disabled:opacity-50"
              >
                {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                Restore Cancelled Order
              </button>
            ) : nextStatuses.length === 0 ? (
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                ✓ Order is {order.orderStatus}. No further transition needed.
              </span>
            ) : (
              nextStatuses.map((s) => {
                const isCancel = s === "cancelled";
                return (
                  <button
                    key={s}
                    onClick={() => executeStatusChange(s)}
                    disabled={updating}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-50 ${
                      isCancel
                        ? "border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-400"
                        : "bg-maroon text-white hover:bg-gold hover:text-maroon shadow-xs"
                    }`}
                  >
                    {updating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isCancel ? "Cancel Order" : `Mark as ${STATUS_LABELS[s] || s}`}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Section 1 (Order Information) & Section 2 (Customer Details) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SECTION 1: ORDER INFORMATION */}
        <section className={`${cardClass} p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-gold/15 pb-3">
            <h2 className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gold-600" /> Order Information
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-charcoal/50">Core Details</span>
          </div>

          <div className="divide-y divide-gold/10 text-xs">
            <div className="flex flex-col justify-between py-2.5 sm:flex-row">
              <span className="text-charcoal/60">Order Number</span>
              <span className="font-semibold text-charcoal">{order.orderNumber}</span>
            </div>

            <div className="flex flex-col justify-between py-2.5 sm:flex-row">
              <span className="text-charcoal/60">Database Order ID</span>
              <code className="font-mono text-charcoal font-semibold">#{order.id}</code>
            </div>

            <div className="flex flex-col justify-between py-2.5 sm:flex-row">
              <span className="text-charcoal/60">Order Placed Date</span>
              <span className="text-charcoal/90">{order.formattedDate}</span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-charcoal/60">Order Status</span>
              <div>
                <StatusBadge status={order.orderStatus} />
              </div>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-charcoal/60">Payment Status</span>
              <div>
                <PaymentBadge status={order.paymentStatus} />
              </div>
            </div>

            <div className="flex flex-col justify-between py-2.5 sm:flex-row">
              <span className="text-charcoal/60">Payment Method</span>
              <span className="font-medium text-charcoal uppercase">
                {order.paymentMethod === "cod" ? "Cash on Delivery (COD)" : `${order.paymentMethod} (Online)`}
              </span>
            </div>

            <div className="flex flex-col justify-between py-2.5 sm:flex-row">
              <span className="text-charcoal/60">Transaction / Razorpay ID</span>
              <span className="font-mono text-charcoal/80">
                {order.transactionId || (order.paymentMethod === "cod" ? "COD (Pay on Delivery)" : "—")}
              </span>
            </div>

            <div className="flex justify-between py-2.5">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="font-semibold text-charcoal">{rupees(order.subtotal)}</span>
            </div>

            <div className="flex justify-between py-2.5">
              <span className="text-charcoal/60">Delivery / Shipping Fee</span>
              <span className="text-charcoal/90">
                {order.deliveryCharge === 0 ? "Free (₹0)" : rupees(order.deliveryCharge)}
              </span>
            </div>

            {order.tax > 0 && (
              <div className="flex justify-between py-2.5">
                <span className="text-charcoal/60">Applicable Tax</span>
                <span className="text-charcoal/90">{rupees(order.tax)}</span>
              </div>
            )}

            <div className="flex justify-between py-2.5">
              <span className="text-charcoal/60">Coupon Code / Discount</span>
              <span className="text-emerald-700 font-semibold">
                {order.discount > 0 ? `-${rupees(order.discount)} (${order.couponCode || "Discount"})` : "None (₹0)"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 text-sm">
              <span className="font-serif font-bold text-maroon">Final Total Amount</span>
              <span className="font-serif text-lg font-bold text-maroon">
                {rupees(order.totalAmount)}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: CUSTOMER DETAILS */}
        <section className={`${cardClass} p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-gold/15 pb-3">
            <h2 className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <User className="h-4 w-4 text-gold-600" /> Customer Details
            </h2>
            <Link
              href={`/admin/customers/${order.customerId}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-maroon hover:underline"
            >
              <span>View full customer account</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Account Profile Details */}
          <div className="rounded-xl border border-gold/15 bg-beige/30 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                Registered Profile
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 uppercase">
                {order.customerStatus || "Active Registered User"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="block text-[10px] text-charcoal/50 uppercase">Full Name</span>
                <span className="font-semibold text-charcoal">{order.customerName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-charcoal/50 uppercase">Phone Number</span>
                <span className="font-mono text-charcoal/90">{order.customerPhone || "Not available"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-[10px] text-charcoal/50 uppercase">Email Address</span>
                <span className="text-charcoal/90">{order.customerEmail || "Not available"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gold/15 bg-beige/20 p-4 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 flex items-center gap-1 mb-1">
              <Truck className="h-3 w-3 text-maroon" /> Shipping Address
            </span>
            {order.shippingAddress ? (
              <p className="text-charcoal/80 leading-relaxed font-normal">
                {order.shippingAddress}
              </p>
            ) : (
              <p className="text-charcoal/40 italic">Not available on order.</p>
            )}
            <span className="block text-[10px] font-semibold text-charcoal/50 pt-1">Country: India</span>
          </div>

          {/* Billing Address */}
          <div className="rounded-xl border border-gold/15 bg-beige/20 p-4 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 flex items-center gap-1 mb-1">
              <Receipt className="h-3 w-3 text-maroon" /> Billing Address
            </span>
            {order.billingAddress && order.billingAddress !== order.shippingAddress ? (
              <p className="text-charcoal/80 leading-relaxed font-normal">
                {order.billingAddress}
              </p>
            ) : (
              <p className="text-charcoal/50 italic">
                Same as shipping address (no separate billing address on file)
              </p>
            )}
          </div>

          {/* Customer Note & Gift Packaging Alert */}
          {giftLines.length > 0 && (
            <div className="rounded-xl border-2 border-gold bg-amber-50/60 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900 text-[11px]">
                <Gift className="h-4 w-4 text-amber-700" />
                <span>Gift Wrapping & Special Packing Instructions</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-charcoal/90 font-medium">
                {giftLines.map((gl, idx) => (
                  <li key={idx}>{gl}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">
              Customer Note
            </span>
            {standardNotes ? (
              <p className="rounded-lg border border-gold/15 bg-beige/30 p-3 text-charcoal/80 italic leading-relaxed">
                &ldquo;{standardNotes}&rdquo;
              </p>
            ) : (
              <p className="text-charcoal/40 italic">None provided by customer.</p>
            )}
          </div>
        </section>
      </div>

      {/* SECTION 3: ORDERED ITEMS (Each item is clickable to navigate to product edit page) */}
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 p-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Package className="h-5 w-5 text-gold-600" /> Ordered Items ({order.items.length})
            </h2>
            <p className="text-xs text-charcoal/50 mt-0.5">
              Click any item row to view complete product details and live warehouse stock.
            </p>
          </div>
          <span className="text-xs font-semibold text-charcoal/60">
            {order.itemsCount} total {order.itemsCount === 1 ? "unit" : "units"} included
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                <th className="px-4 py-3.5">Product Piece</th>
                <th className="px-4 py-3.5">SKU & Specs</th>
                <th className="px-4 py-3.5 text-center">Qty</th>
                <th className="px-4 py-3.5">Unit Price</th>
                <th className="px-4 py-3.5">Live Stock</th>
                <th className="px-4 py-3.5 text-right">Line Total</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/products/edit/${item.productId}`)}
                  className="cursor-pointer transition-colors hover:bg-gold/10 group"
                  title="Click to view and edit this product"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-beige text-gold-600 overflow-hidden shadow-xs">
                        {item.productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <Gem className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-semibold text-charcoal group-hover:text-maroon transition-colors">
                          {item.productName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.jewelleryType && (
                            <span className="inline-block rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold text-maroon">
                              {item.jewelleryType}
                            </span>
                          )}
                          <span className="text-[10px] text-maroon font-medium group-hover:underline flex items-center gap-0.5">
                            View piece details <ExternalLink className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-charcoal/70">
                    <span className="block">{item.sku || "—"}</span>
                    {item.variant && <span className="text-[10px] text-charcoal/50 block font-sans">{item.variant}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-charcoal">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3.5 text-charcoal/80">
                    {rupees(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3.5">
                    {item.currentStock !== null && item.currentStock !== undefined ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          item.currentStock > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.currentStock > 0 ? `${item.currentStock} in stock` : "0 (Out of stock)"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right font-serif font-bold text-maroon text-sm">
                    {rupees(item.subtotal)}
                  </td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/admin/products/edit/${item.productId}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-beige px-2.5 py-1 text-[11px] font-bold text-maroon hover:bg-maroon hover:text-white transition-colors"
                    >
                      Edit Product →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: ORDER FINANCIAL SUMMARY */}
      <section className={`${cardClass} p-6`}>
        <h2 className="font-serif text-lg font-bold text-maroon mb-4">
          Order Financial Summary
        </h2>

        <div className="max-w-md divide-y divide-gold/15 text-xs space-y-2">
          <div className="flex justify-between py-1.5 text-charcoal/70">
            <span>Subtotal</span>
            <span className="font-semibold text-charcoal">{rupees(order.subtotal)}</span>
          </div>

          <div className="flex justify-between py-1.5 text-charcoal/70">
            <span>Shipping / Delivery Charges</span>
            <span className="text-charcoal">
              {order.deliveryCharge === 0 ? "Free Delivery (₹0)" : rupees(order.deliveryCharge)}
            </span>
          </div>

          {order.tax > 0 && (
            <div className="flex justify-between py-1.5 text-charcoal/70">
              <span>Taxes</span>
              <span className="text-charcoal">{rupees(order.tax)}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5 text-charcoal/70">
            <span>Discount Applied</span>
            <span className={order.discount > 0 ? "text-emerald-700 font-semibold" : "text-charcoal"}>
              {order.discount > 0 ? `-${rupees(order.discount)}` : "₹0"}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-4 border-t-2 border-gold/30 text-sm">
            <span className="font-serif font-bold text-maroon uppercase tracking-wider text-xs">
              Final Total Amount
            </span>
            <span className="font-serif text-2xl font-bold text-maroon">
              {rupees(order.totalAmount)}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 5: AUDIT LOG & STATUS HISTORY TIMELINE */}
      <section className={`${cardClass} p-6`}>
        <div className="border-b border-gold/15 pb-4 mb-4 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
            <History className="h-4 w-4 text-gold-600" /> Chronological Order Status History
          </h3>
          <span className="text-xs text-charcoal/50">
            {order.statusHistory?.length || 0} event(s) recorded
          </span>
        </div>

        {order.statusHistory && order.statusHistory.length > 0 ? (
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold/20">
            {order.statusHistory.map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-gold-600 bg-white group-hover:bg-gold-600 transition-colors" />

                <div className="rounded-xl border border-gold/15 bg-beige/30 p-3.5 text-xs transition-colors hover:bg-beige/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize text-charcoal/70">
                        {item.prevStatus}
                      </span>
                      <span className="text-gold-600">→</span>
                      <span className="rounded-full bg-maroon/10 px-2.5 py-0.5 font-bold uppercase tracking-wide text-maroon text-[10px]">
                        {item.newStatus}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-charcoal/50">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  {item.comment && (
                    <p className="mt-2 text-xs text-charcoal/80 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-gold/10">
                      {item.comment}
                    </p>
                  )}

                  <div className="mt-2 text-[10px] text-charcoal/50">
                    Updated by: <span className="font-semibold text-charcoal">{item.updatedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gold/30 bg-beige/20 p-6 text-center text-xs text-charcoal/60">
            No status history events have been logged yet for this order.
          </div>
        )}
      </section>

      {/* Manual Full Status Update Drawer (Optional Fine-grained Control) */}
      <section className={`${cardClass} p-6 border-t-2 border-gold/30`}>
        <h3 className="font-serif text-sm font-bold text-maroon mb-1">
          Detailed Status Management & Custom Comment
        </h3>
        <p className="text-xs text-charcoal/50 mb-4">
          Manually specify status, payment state, or add custom dispatch tracking notes.
        </p>

        <form onSubmit={handleManualFormSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Order Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className={inputClass}
            >
              <option value="pending">Pending (Awaiting Confirmation)</option>
              <option value="confirmed">Confirmed (Deducts Stock)</option>
              <option value="processing">Processing in Workshop</option>
              <option value="shipped">Shipped for Delivery</option>
              <option value="delivered">Delivered to Customer</option>
              <option value="cancelled">Cancelled (Restores Stock)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className={inputClass}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid (Confirmed Payment)</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Custom Status Note / Tracking
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Courier tracking #BLR-9821"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className={`${primaryBtn} py-2.5 px-6 disabled:opacity-60`}
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Back to Orders Button */}
      <div className="pt-2">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-maroon transition-all hover:bg-beige hover:border-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
          <span className="text-xs text-charcoal/60">Loading order details...</span>
        </div>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Clock,
  Home,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { cardClass, secondaryBtn } from "@/components/admin/ui";
import { customerService, type Customer } from "@/lib/services/customer.service";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function CustomerDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : null;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError(true);
      setLoading(false);
      return;
    }

    customerService
      .getById(id)
      .then(setCustomer)
      .catch((err) => {
        console.error("Failed to load customer details:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggleStatus() {
    if (!customer || !id) return;
    const newStatus = customer.status === "active" ? "inactive" : "active";
    setUpdatingStatus(true);
    setFeedback(null);

    try {
      const updated = await customerService.updateStatus(id, newStatus);
      setCustomer(updated);
      setFeedback({
        type: "success",
        message: `Customer account is now ${newStatus.toUpperCase()}. ${
          newStatus === "inactive"
            ? "Customer cannot sign in or place new orders."
            : "Customer has full access to login and order."
        }`,
      });
    } catch (err: any) {
      console.error("Failed to toggle status:", err);
      setFeedback({
        type: "error",
        message: err?.message || "Failed to update customer account status.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDeleteCustomer() {
    if (!id) return;
    setDeleting(true);
    try {
      await customerService.delete(id);
      router.push("/admin/customers");
    } catch (err: any) {
      console.error("Failed to delete customer:", err);
      setFeedback({
        type: "error",
        message: err?.message || "Failed to delete customer account.",
      });
      setShowDeleteModal(false);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
        <span className="text-xs text-charcoal/60">Loading customer profile...</span>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-xs text-rose-800">
        <p className="font-semibold">Customer record not found</p>
        <p className="mt-1">This customer profile could not be found or has been removed.</p>
        <button
          onClick={() => router.push("/admin/customers")}
          className="mt-4 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const isActive = customer.status === "active";

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Clientele Details" title={customer.name}>
        <div className="flex items-center gap-3">
          <Link href="/admin/customers" className={secondaryBtn}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Customers
          </Link>
          <button
            onClick={handleToggleStatus}
            disabled={updatingStatus}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-xs disabled:opacity-60 ${
              isActive
                ? "bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {updatingStatus ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isActive ? (
              <UserX className="h-3.5 w-3.5" />
            ) : (
              <UserCheck className="h-3.5 w-3.5" />
            )}
            {isActive ? "Deactivate Customer" : "Activate Customer"}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 shadow-xs transition-colors hover:bg-rose-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Customer
          </button>
        </div>
      </PageHeader>

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

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className={`${cardClass} p-6 lg:col-span-2`}>
          <div className="flex flex-col gap-4 border-b border-gold/15 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon font-serif text-2xl font-bold text-gold shadow-md">
                {customer.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-maroon">{customer.name}</h2>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isActive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {customer.status}
                  </span>
                </div>
                <span className="text-xs text-charcoal/50">
                  Customer ID: #{String(customer.id).padStart(4, "0")}
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-charcoal/50">
              <span className="block">Registered on {customer.registrationDate}</span>
              {customer.updatedAt && (
                <span className="block mt-0.5">Last updated: {customer.updatedAt}</span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="flex items-center gap-3 rounded-xl border border-gold/15 bg-beige/40 p-3">
              <Mail className="h-4 w-4 text-maroon shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-charcoal/50">
                  Email Address
                </span>
                <span className="font-semibold text-charcoal">{customer.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/15 bg-beige/40 p-3">
              <Phone className="h-4 w-4 text-maroon shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-charcoal/50">
                  Phone Number
                </span>
                <span className="font-semibold text-charcoal">{customer.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/15 bg-beige/40 p-3">
              <Calendar className="h-4 w-4 text-maroon shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-charcoal/50">
                  Account Created
                </span>
                <span className="font-semibold text-charcoal">{customer.registrationDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gold/15 bg-beige/40 p-3">
              <MapPin className="h-4 w-4 text-maroon shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-charcoal/50">
                  Primary Location
                </span>
                <span className="font-semibold text-charcoal">
                  {customer.city ? `${customer.city}, ${customer.state || "India"}` : "India"}
                </span>
              </div>
            </div>
          </div>

          {/* Saved Addresses Section */}
          <div className="mt-6 border-t border-gold/15 pt-5">
            <h4 className="font-serif text-sm font-bold text-maroon flex items-center gap-2 mb-3">
              <Home className="h-4 w-4 text-gold-600" /> Saved Customer Addresses
            </h4>

            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-xl border border-gold/15 bg-beige/30 p-3.5 space-y-1 relative"
                  >
                    {addr.isDefault && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-maroon">
                        Default
                      </span>
                    )}
                    <span className="font-semibold text-charcoal block">
                      {addr.fullName || customer.name}
                    </span>
                    <p className="text-charcoal/70 leading-relaxed text-[11px]">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                      <br />
                      {addr.city}, {addr.state} - {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                    {addr.phone && (
                      <span className="text-[10px] text-charcoal/50 block font-mono">
                        Phone: {addr.phone}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : customer.address ? (
              <div className="rounded-xl border border-gold/15 bg-beige/30 p-3.5 text-xs">
                <span className="font-semibold text-charcoal block mb-1">Registered Address</span>
                <p className="text-charcoal/70 leading-relaxed">
                  {customer.address}
                  {customer.city && `, ${customer.city}`}
                  {customer.state && `, ${customer.state}`}
                  {customer.postalCode && ` - ${customer.postalCode}`}
                </p>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-gold/30 bg-beige/20 p-4 text-center text-xs text-charcoal/50">
                No delivery addresses on file for this customer.
              </p>
            )}
          </div>
        </div>

        {/* Lifetime Value / Stats */}
        <div className="space-y-4">
          <div className={`${cardClass} p-6 border-l-4 border-l-maroon`}>
            <div className="flex items-center justify-between text-charcoal/60">
              <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Orders</span>
              <div className="rounded-lg bg-maroon/10 p-2 text-maroon">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-maroon">{customer.totalOrders}</p>
            <span className="mt-1 block text-xs text-charcoal/50">Successful purchases placed</span>
          </div>

          <div className={`${cardClass} p-6 border-l-4 border-l-gold`}>
            <div className="flex items-center justify-between text-charcoal/60">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Amount Spent</span>
              <div className="rounded-lg bg-gold/20 p-2 text-gold-700">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-charcoal">
              {rupees(customer.totalSpending)}
            </p>
            <span className="mt-1 block text-xs text-charcoal/50">Cumulative jewellery value</span>
          </div>

          {customer.mostRecentOrder && (
            <div className={`${cardClass} p-5 bg-beige/40`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gold-600" /> Most Recent Order
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-800">
                  {customer.mostRecentOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-charcoal block">
                    {customer.mostRecentOrder.orderNumber}
                  </span>
                  <span className="text-[10px] text-charcoal/50">{customer.mostRecentOrder.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-sm font-bold text-maroon block">
                    {rupees(customer.mostRecentOrder.amount)}
                  </span>
                  <Link
                    href={`/admin/orders/${customer.mostRecentOrder.id}`}
                    className="text-[10px] font-semibold text-maroon hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order History Table */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-gold/15 p-6">
          <h3 className="font-serif text-lg font-bold text-maroon">Purchase & Order History</h3>
          <p className="text-xs text-charcoal/50">All orders placed by this customer</p>
        </div>

        {!customer.orders || customer.orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal/50">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Items Purchased</th>
                  <th className="px-4 py-3">Order Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {customer.orders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-beige/30">
                    <td className="px-4 py-3.5 font-mono font-semibold text-charcoal">{o.orderNumber}</td>
                    <td className="px-4 py-3.5 text-charcoal/70">{o.date}</td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-charcoal/80">
                      {o.productNames || `${o.itemsCount} item(s)`}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-maroon">{rupees(o.totalAmount)}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          o.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-beige px-2.5 py-1.5 text-[11px] font-semibold text-charcoal transition-colors hover:bg-maroon hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gold/20 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-full bg-rose-100 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Delete Customer Profile</h3>
                <p className="text-xs text-charcoal/50">Permanent action</p>
              </div>
            </div>

            <p className="text-xs text-charcoal/70 leading-relaxed">
              Are you sure you want to delete <strong className="text-charcoal">{customer.name}</strong> ({customer.email})? 
              This will permanently delete this customer&apos;s account, addresses, and order history.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className={secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCustomer}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Yes, Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
          <span className="text-xs text-charcoal/60">Loading customer profile...</span>
        </div>
      }
    >
      <CustomerDetailsContent />
    </Suspense>
  );
}

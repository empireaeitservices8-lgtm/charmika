"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  UserX,
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, cardClass, secondaryBtn } from "@/components/admin/ui";
import { customerService, type Customer } from "@/lib/services/customer.service";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Status toggle & Delete state
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getAll({
        page,
        limit: 10,
        query,
      });
      let list = res.customers;
      if (statusFilter !== "all") {
        list = list.filter((c) => c.status.toLowerCase() === statusFilter);
      }
      setCustomers(list);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  }, [page, query, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPage(1);
  }

  const hasActiveFilters = Boolean(query.trim() || statusFilter !== "all");

  async function handleToggleStatus(c: Customer) {
    const nextStatus = c.status === "active" ? "inactive" : "active";
    setUpdatingId(c.id);
    setToastMessage(null);
    try {
      await customerService.updateStatus(c.id, nextStatus);
      setCustomers((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, status: nextStatus } : item))
      );
      setToastMessage({
        type: "success",
        text: `Customer '${c.name}' has been ${nextStatus === "active" ? "activated" : "deactivated"}.`,
      });
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setToastMessage({
        type: "error",
        text: err?.message || "Failed to update customer status.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingCustomer) return;
    setDeleting(true);
    setToastMessage(null);
    try {
      await customerService.delete(deletingCustomer.id);
      setToastMessage({
        type: "success",
        text: `Customer '${deletingCustomer.name}' was permanently removed.`,
      });
      setDeletingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      console.error("Failed to delete customer:", err);
      setToastMessage({
        type: "error",
        text: err?.message || "Failed to delete customer.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Clientele Directory" title="Customer Management" />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs shadow-xs ${
            toastMessage.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <span className="font-semibold">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-current opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar with Clear Button */}
      <div className={`${cardClass} flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by customer name, email, or phone number..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={`${inputClass} sm:w-44`}
          >
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gold/30 bg-beige/60 px-4 py-2.5 text-xs font-semibold text-maroon transition-all hover:bg-beige"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center p-20 text-charcoal/50">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
            <span className="text-sm">Loading customer records...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-xs text-charcoal/60">
            <Users className="mx-auto mb-3 h-12 w-12 text-gold-400" />
            <p className="text-base font-serif font-bold text-maroon">No customer records found</p>
            <p className="mt-1 text-charcoal/60">
              {hasActiveFilters
                ? "No registered customers match your current filter criteria."
                : "No customer records currently exist in the database."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-gold hover:text-maroon transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters & View All
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                  <th className="px-5 py-4">Customer ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Joined Date</th>
                  <th className="px-5 py-4 text-center">Orders</th>
                  <th className="px-5 py-4">Total Spent</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {customers.map((c) => {
                  const isActive = c.status === "active";
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-beige/30">
                      <td className="px-5 py-4 font-mono text-[11px] text-charcoal/60">
                        #{String(c.id).padStart(4, "0")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon/10 font-serif text-sm font-bold text-maroon">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <span className="font-semibold text-charcoal block">{c.name}</span>
                            <span className="text-[10px] text-charcoal/50 block">{c.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-charcoal/70">{c.phone}</td>
                      <td className="px-5 py-4 text-charcoal/60">{c.registrationDate}</td>
                      <td className="px-5 py-4 text-center font-bold text-maroon">
                        {c.totalOrders}
                      </td>
                      <td className="px-5 py-4 font-serif font-bold text-charcoal">
                        {rupees(c.totalSpending)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active / Deactivate */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            disabled={updatingId === c.id}
                            title={isActive ? "Deactivate Customer Account" : "Activate Customer Account"}
                            className={`rounded-lg p-2 text-xs font-semibold transition-colors ${
                              isActive
                                ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {updatingId === c.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isActive ? (
                              <UserX className="h-3.5 w-3.5" />
                            ) : (
                              <UserCheck className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* View Profile */}
                          <Link
                            href={`/admin/customers/${c.id}`}
                            title="View Customer Profile"
                            className="rounded-lg bg-beige p-2 text-charcoal transition-colors hover:bg-maroon hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete Customer */}
                          <button
                            type="button"
                            onClick={() => setDeletingCustomer(c)}
                            title="Delete Customer Account"
                            className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gold/15 px-6 py-4 text-xs text-charcoal/60">
          <span>
            Showing {customers.length} of {pagination.total} registered customers
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gold/20 p-2 transition-colors hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-maroon px-3 py-1 font-bold text-white">{page}</span>
            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gold/20 p-2 transition-colors hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gold/20 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-full bg-rose-100 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Delete Customer</h3>
                <p className="text-xs text-charcoal/50">Permanent action</p>
              </div>
            </div>

            <p className="text-xs text-charcoal/70 leading-relaxed">
              Are you sure you want to permanently delete customer{" "}
              <strong className="text-charcoal">{deletingCustomer.name}</strong> (
              {deletingCustomer.email})? All associated customer profile data and records will be removed.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                disabled={deleting}
                className={secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
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

"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  Gem,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  PackageOpen,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories, products as initialMockProducts, type Product } from "@/lib/mockData";
import { inputClass, cardClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialMockProducts);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("newest");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductList(data);
          }
        }
      } catch (e) {
        console.error("Failed to load products from API:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function handleDeleteProduct() {
    if (!toDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/products/${toDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setProductList((prev) => prev.filter((p) => p.id !== toDelete.id));
      }
    } catch (e) {
      console.error("Failed to delete product:", e);
    } finally {
      setIsDeleting(false);
      setToDelete(null);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...productList].filter((p) => {
      const matchesText = !q || (p.name && p.name.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q));
      const matchesCategory = category === "all" || p.category === category;
      const matchesStatus = status === "all" || p.status === status;
      const matchesStock =
        stock === "all" ||
        (stock === "out" && (p.stock || 0) <= 0) ||
        (stock === "low" && (p.stock || 0) > 0 && (p.stock || 0) <= 5) ||
        (stock === "in" && (p.stock || 0) > 5);
      return matchesText && matchesCategory && matchesStatus && matchesStock;
    });
    const price = (p: Product) => p.salePrice ?? p.regularPrice ?? 0;
    if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
    else if (sort === "price-desc") list.sort((a, b) => price(b) - price(a));
    else if (sort === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else list.sort((a, b) => Number(b.id) - Number(a.id));
    return list;
  }, [productList, query, category, status, stock, sort]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Inventory Controls" title="All Products">
        <Link href="/admin/products/add" className={primaryBtn}>
          <PlusCircle className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className={`${cardClass} flex flex-col gap-3 p-4 lg:flex-row lg:items-center`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className={`${inputClass} pl-9`}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} lg:w-40`}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} lg:w-36`}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={stock} onChange={(e) => setStock(e.target.value)} className={`${inputClass} lg:w-36`}>
          <option value="all">All stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputClass} lg:w-44`}>
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div className={`${cardClass} overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center p-12 text-center text-xs text-charcoal/60">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-maroon" />
            <span>Loading products catalogue...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal/60">
            <PackageOpen className="mx-auto mb-2 h-10 w-10 text-gold-400" />
            <p className="text-sm font-semibold text-charcoal">No products match your filters</p>
            <p className="mt-1">Try a different search or clear a filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-beige/30">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-beige text-gold-600">
                          <Gem className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="block max-w-[200px] truncate font-semibold text-charcoal">{p.name}</span>
                          <div className="mt-0.5 flex gap-1">
                            {p.featured && (
                              <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-700">
                                Featured
                              </span>
                            )}
                            {p.newArrival && (
                              <span className="rounded bg-maroon/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-maroon">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-charcoal/70">{p.sku || "—"}</td>
                    <td className="px-4 py-3.5 text-charcoal/80">{p.category}</td>
                    <td className="px-4 py-3.5 font-semibold">
                      {p.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-maroon">{rupees(p.salePrice)}</span>
                          <span className="text-[10px] text-charcoal/40 line-through">{rupees(p.regularPrice)}</span>
                        </div>
                      ) : (
                        <span className="text-maroon">{rupees(p.regularPrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {(p.stock || 0) <= 0 ? (
                        <span className="inline-flex items-center rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          Out of Stock
                        </span>
                      ) : (p.stock || 0) <= 5 ? (
                        <span className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {p.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {p.stock} units
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          p.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status || "active"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          title="View on store"
                          className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-beige hover:text-maroon"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          title="Edit"
                          className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-beige hover:text-maroon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setToDelete(p)}
                          className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
            Showing {filtered.length} of {productList.length} products
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="rounded-lg border border-gold/20 p-1.5 opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-maroon px-2.5 py-1 font-bold text-white">1</span>
            <button type="button" disabled className="rounded-lg border border-gold/20 p-1.5 opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gold/20 bg-white p-6 shadow-luxury">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-maroon">Delete this product?</h3>
            <p className="mt-1 text-xs text-charcoal/60">
              <span className="font-semibold text-charcoal">{toDelete.name}</span> will be removed from your
              catalogue and the website.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setToDelete(null)}
                className={secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProduct}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-800 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

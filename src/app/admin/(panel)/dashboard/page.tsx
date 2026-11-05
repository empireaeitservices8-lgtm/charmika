import Link from "next/link";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  PlusCircle,
  ArrowRight,
  Layers,
  Clock,
  Gem,
} from "lucide-react";

// MOCK DATA: replaced with real MySQL data when the backend is ready
const stats = [
  { label: "Total Products", value: 24, note: "In catalogue", icon: Package, chip: "bg-maroon/10 text-maroon", valueColor: "text-maroon", noteColor: "text-charcoal/50" },
  { label: "Active Public", value: 19, note: "Live on website", icon: CheckCircle2, chip: "bg-emerald-50 text-emerald-700", valueColor: "text-emerald-800", noteColor: "text-emerald-600/80" },
  { label: "Inactive", value: 5, note: "Hidden from store", icon: Clock, chip: "bg-amber-50 text-amber-700", valueColor: "text-amber-800", noteColor: "text-charcoal/50" },
  { label: "Out of Stock", value: 3, note: "Requires restocking", icon: AlertTriangle, chip: "bg-rose-50 text-rose-700", valueColor: "text-rose-800", noteColor: "text-rose-600/80" },
  { label: "Categories", value: 4, note: "Active collections", icon: FolderTree, chip: "bg-gold/20 text-gold-700", valueColor: "text-maroon", noteColor: "text-charcoal/50" },
];

const recentProducts = [
  { id: 1, name: "Antique Gold Haaram", sku: "CH-HAR-001", category: "Haarams", regular: 12500, sale: 10900, stock: 8, status: "active", added: "03 Nov 2026" },
  { id: 2, name: "Kemp Stone Choker", sku: "CH-CHK-014", category: "Chokers", regular: 7800, sale: null, stock: 0, status: "active", added: "02 Nov 2026" },
  { id: 3, name: "Nakshi Temple Necklace", sku: "CH-NAK-007", category: "Nakshi", regular: 15200, sale: 13500, stock: 4, status: "inactive", added: "30 Oct 2026" },
  { id: 4, name: "Bridal Rental Set", sku: "CH-RNT-003", category: "Rentals", regular: 4500, sale: null, stock: 12, status: "active", added: "28 Oct 2026" },
];

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex flex-col justify-between gap-4 border-b border-gold/20 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
            Overview & Analytics
          </span>
          <h1 className="font-serif text-2xl font-bold text-maroon sm:text-3xl">
            Jewellery Catalogue Dashboard
          </h1>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-gold hover:text-maroon"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-gold/20 bg-white p-5 shadow-xs transition-all hover:shadow-luxury ${
              i === stats.length - 1 ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between text-charcoal/60">
              <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
              <div className={`rounded-lg p-2 ${s.chip}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className={`font-serif text-2xl font-bold sm:text-3xl ${s.valueColor}`}>{s.value}</p>
            <span className={`mt-1 block text-[11px] ${s.noteColor}`}>{s.note}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/admin/products/add"
          className="group flex items-center justify-between rounded-2xl border border-gold/30 bg-gradient-to-r from-maroon-800 to-maroon-900 p-6 text-white shadow-luxury transition-all hover:from-maroon-900 hover:to-maroon-950"
        >
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gold-300">
              Catalogue Expansion
            </span>
            <h3 className="font-serif text-lg font-bold">Add New Jewellery</h3>
            <p className="mt-1 text-xs text-white/70">Upload images, set pricing, inventory & specifications</p>
          </div>
          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold transition-transform group-hover:scale-110">
            <PlusCircle className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="group flex items-center justify-between rounded-2xl border border-gold/20 bg-white p-6 shadow-xs transition-all hover:shadow-luxury"
        >
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gold-600">
              Inventory Controls
            </span>
            <h3 className="font-serif text-lg font-bold text-maroon">Manage All Products</h3>
            <p className="mt-1 text-xs text-charcoal/60">Search, filter, update pricing, edit stock & visibility</p>
          </div>
          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige text-maroon transition-all group-hover:bg-maroon group-hover:text-white">
            <Layers className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="group flex items-center justify-between rounded-2xl border border-gold/20 bg-white p-6 shadow-xs transition-all hover:shadow-luxury"
        >
          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gold-600">
              Curated Collections
            </span>
            <h3 className="font-serif text-lg font-bold text-maroon">Manage Categories</h3>
            <p className="mt-1 text-xs text-charcoal/60">Create and configure Chokers, Haarams, Nakshi, Rentals</p>
          </div>
          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige text-maroon transition-all group-hover:bg-maroon group-hover:text-white">
            <FolderTree className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* Recent products */}
      <div className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-gold/15 p-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-maroon">Recently Added Products</h2>
            <p className="mt-0.5 text-xs text-charcoal/60">Latest items in your catalogue</p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon transition-colors hover:text-gold"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

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
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {recentProducts.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-beige/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-beige text-gold-600">
                        <Gem className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block max-w-[200px] truncate font-semibold text-charcoal">{p.name}</span>
                        <span className="text-[10px] text-charcoal/50">Added {p.added}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-charcoal/70">{p.sku}</td>
                  <td className="px-4 py-3.5 text-charcoal/80">{p.category}</td>
                  <td className="px-4 py-3.5 font-semibold">
                    {p.sale ? (
                      <div className="flex flex-col">
                        <span className="text-maroon">{rupees(p.sale)}</span>
                        <span className="text-[10px] text-charcoal/40 line-through">{rupees(p.regular)}</span>
                      </div>
                    ) : (
                      <span className="text-maroon">{rupees(p.regular)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {p.stock <= 0 ? (
                      <span className="inline-flex items-center rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        0 (Out of Stock)
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
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/products/edit/${p.id}`}
                      className="rounded-lg bg-beige px-2.5 py-1.5 text-[11px] font-semibold text-charcoal transition-colors hover:bg-maroon hover:text-white"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
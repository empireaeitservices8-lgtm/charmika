import { Pencil, Trash2, UploadCloud, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories } from "@/lib/mockData";
import { inputClass, labelClass, cardClass, primaryBtn } from "@/components/admin/ui";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Curated Collections" title="Categories" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List */}
        <div className={`${cardClass} overflow-hidden lg:col-span-2`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-beige/60 font-semibold uppercase tracking-wider text-charcoal/70">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {categories.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-beige/30">
                    <td className="px-4 py-3.5">
                      <span className="block font-semibold text-charcoal">{c.name}</span>
                      <span className="font-mono text-[10px] text-charcoal/50">/{c.slug}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-maroon">{c.products}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          c.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="Edit"
                          className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-beige hover:text-maroon"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={c.products > 0}
                          title={c.products > 0 ? "Has products. Move or remove them first." : "Delete"}
                          className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal/60"
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
        </div>

        {/* Add form */}
        <section className={`${cardClass} h-fit p-6`}>
          <div className="mb-5 border-b border-gold/15 pb-3">
            <h3 className="font-serif text-base font-bold text-maroon">Add Category</h3>
            <p className="mt-0.5 text-xs text-charcoal/50">Create a new collection.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input placeholder="e.g. Earrings" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input placeholder="earrings" className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea rows={3} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold/40 bg-beige/50 px-4 py-5 text-center hover:bg-beige">
                <UploadCloud className="mb-1 h-6 w-6 text-gold-600" />
                <span className="text-xs font-semibold text-maroon">Upload image</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <button type="button" className={`${primaryBtn} w-full py-3`}>
              <Save className="h-3.5 w-3.5" />
              Save Category
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
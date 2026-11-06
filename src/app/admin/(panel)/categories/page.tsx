"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, UploadCloud, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, labelClass, cardClass, primaryBtn } from "@/components/admin/ui";
import { categoryService, type Category } from "@/lib/services/category.service";
import { uploadService } from "@/lib/services/upload.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Status message
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleEditClick(c: Category) {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setStatus(c.status);
    setImagePreview(c.image || null);
    setImageFile(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setStatus("active");
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      let imageUrl = imagePreview || undefined;
      if (imageFile) {
        imageUrl = await uploadService.uploadFile(imageFile);
      }

      if (editingId) {
        await categoryService.update(editingId, {
          name,
          slug: slug.trim() || undefined,
          description: description || undefined,
          image: imageUrl,
          status,
        });
        setMessage({ type: "success", text: `Category '${name}' updated successfully!` });
      } else {
        await categoryService.create({
          name,
          slug: slug.trim() || undefined,
          description: description || undefined,
          image: imageUrl,
          status,
        });
        setMessage({ type: "success", text: `Category '${name}' created successfully!` });
      }

      handleCancelEdit();
      loadCategories();
    } catch (err: any) {
      console.error("Save category error:", err);
      setMessage({ type: "error", text: err?.message || "Failed to save category." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Category) {
    if (c.products > 0) return;
    if (!confirm(`Are you sure you want to delete category '${c.name}'?`)) return;

    setDeletingId(c.id);
    setMessage(null);

    try {
      await categoryService.delete(c.id);
      setMessage({ type: "success", text: `Category '${c.name}' deleted.` });
      loadCategories();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to delete category." });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Curated Collections" title="Categories" />

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List */}
        <div className={`${cardClass} overflow-hidden lg:col-span-2`}>
          {loading ? (
            <div className="flex items-center justify-center p-16 text-charcoal/50">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
              <span className="text-xs">Loading categories...</span>
            </div>
          ) : (
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
                            onClick={() => handleEditClick(c)}
                            className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-beige hover:text-maroon"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            disabled={c.products > 0 || deletingId === c.id}
                            title={c.products > 0 ? "Has products. Move or remove them first." : "Delete"}
                            className="rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal/60"
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-700" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add / Edit form */}
        <section className={`${cardClass} h-fit p-6`}>
          <div className="mb-5 border-b border-gold/15 pb-3">
            <h3 className="font-serif text-base font-bold text-maroon">
              {editingId ? "Edit Category" : "Add Category"}
            </h3>
            <p className="mt-0.5 text-xs text-charcoal/50">
              {editingId ? "Update collection details." : "Create a new collection."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Earrings"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="earrings"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Image</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold/40 bg-beige/50 px-4 py-5 text-center hover:bg-beige">
                <UploadCloud className="mb-1 h-6 w-6 text-gold-600" />
                <span className="text-xs font-semibold text-maroon">
                  {imagePreview ? "Change image" : "Upload image"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <div className="mt-2 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="mx-auto h-20 w-20 rounded-lg object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={`${primaryBtn} flex-1 py-3 disabled:opacity-60`}>
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    {editingId ? "Update Category" : "Save Category"}
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-gold/30 bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:bg-beige"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

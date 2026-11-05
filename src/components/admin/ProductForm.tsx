"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Star, Save, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories, type Product } from "@/lib/mockData";
import { inputClass, labelClass, cardClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={`${cardClass} p-6`}>
      <div className="mb-5 border-b border-gold/15 pb-3">
        <h3 className="font-serif text-base font-bold text-maroon">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-charcoal/50">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-gold/20 px-3 py-2.5 text-left hover:bg-beige/50"
    >
      <span>
        <span className="block text-sm font-medium text-charcoal">{label}</span>
        <span className="block text-[11px] text-charcoal/50">{note}</span>
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-maroon" : "bg-charcoal/20"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function ProductForm({ mode, initial }: { mode: "add" | "edit"; initial?: Product }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  // Form Fields
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [sku, setSku] = useState(initial?.sku || "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [regularPrice, setRegularPrice] = useState(initial?.regularPrice ? String(initial.regularPrice) : "");
  const [salePrice, setSalePrice] = useState(initial?.salePrice ? String(initial.salePrice) : "");
  const [costPrice, setCostPrice] = useState(initial?.costPrice ? String(initial.costPrice) : "");
  const [material, setMaterial] = useState(initial?.material || "");
  const [jewelleryType, setJewelleryType] = useState(initial?.jewelleryType || "");
  const [weight, setWeight] = useState(initial?.weight || "");
  const [size, setSize] = useState(initial?.size || "");
  const [colour, setColour] = useState(initial?.colour || "");
  const [occasion, setOccasion] = useState(initial?.occasion || "");
  const [collection, setCollection] = useState(initial?.collection || "");
  const [tags, setTags] = useState(initial?.tags || "");
  const [selectedCategory, setSelectedCategory] = useState(initial?.category || categories[0]?.name || "");
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : "10");
  const [stockStatus, setStockStatus] = useState(initial && initial.stock <= 0 ? "out" : "in");

  // Images & Visibility
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [primary, setPrimary] = useState(0);
  const [active, setActive] = useState(initial ? initial.status === "active" : true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [newArrival, setNewArrival] = useState(initial?.newArrival ?? false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
    e.target.value = "";
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPrimary((p) => (i === p ? 0 : i < p ? p - 1 : p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: "error", text: "Product name is required." });
      return;
    }
    if (!regularPrice || isNaN(Number(regularPrice))) {
      setMessage({ type: "error", text: "A valid regular price is required." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: sku.trim(),
      regularPrice: Number(regularPrice),
      salePrice: salePrice ? Number(salePrice) : null,
      costPrice: costPrice ? Number(costPrice) : null,
      shortDescription,
      description,
      stock: Number(stock) || 0,
      featured,
      newArrival,
      active,
      material,
      jewelleryType,
      weight,
      size,
      colour,
      occasion,
      collection,
      tags,
      categories: selectedCategory ? [{ name: selectedCategory }] : [],
    };

    try {
      const url = isEdit ? `/api/products/${initial?.id}` : `/api/products`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "Failed to save product");
      }

      setMessage({
        type: "success",
        text: isEdit ? "Product updated successfully!" : "Product saved successfully!",
      });

      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PageHeader
        eyebrow={isEdit ? "Update Catalogue" : "Catalogue Expansion"}
        title={isEdit ? "Edit Product" : "Add New Product"}
      >
        <Link href="/admin/products" className={secondaryBtn}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </PageHeader>

      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border border-rose-300 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Product Name *" className="sm:col-span-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Antique Gold Haaram"
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="antique-gold-haaram"
                  className={inputClass}
                />
              </Field>
              <Field label="SKU">
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="CH-HAR-001"
                  className={`${inputClass} font-mono`}
                />
              </Field>
              <Field label="Short Description" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Full Description" className="sm:col-span-2">
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Regular Price *">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-charcoal/50">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </Field>
              <Field label="Sale Price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-charcoal/50">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </Field>
              <Field label="Cost Price (optional)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-charcoal/50">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Jewellery Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Material">
                <input
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Antique gold plated"
                  className={inputClass}
                />
              </Field>
              <Field label="Jewellery Type">
                <select
                  value={jewelleryType}
                  onChange={(e) => setJewelleryType(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select type</option>
                  {["Haaram", "Choker", "Necklace", "Earrings", "Bangles", "Full Set"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Weight">
                <input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 85 g"
                  className={inputClass}
                />
              </Field>
              <Field label="Size">
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. Free size"
                  className={inputClass}
                />
              </Field>
              <Field label="Colour">
                <input
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="e.g. Gold"
                  className={inputClass}
                />
              </Field>
              <Field label="Occasion">
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select occasion</option>
                  {["Wedding", "Festive", "Party", "Daily wear"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Gender / Collection">
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select collection</option>
                  {["Women", "Bridal", "Kids", "Festive"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags">
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="comma, separated, tags"
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          <Section title="Product Images" hint="The primary image is shown on product cards.">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold/40 bg-beige/50 px-4 py-8 text-center transition-colors hover:bg-beige">
              <UploadCloud className="mb-2 h-8 w-8 text-gold-600" />
              <span className="text-sm font-semibold text-maroon">Click to upload images</span>
              <span className="mt-0.5 text-xs text-charcoal/50">PNG, JPG or WEBP. You can select several.</span>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div key={img.url} className="group relative overflow-hidden rounded-xl border border-gold/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="aspect-square w-full object-cover" />
                    {i === primary && (
                      <span className="absolute left-2 top-2 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        Primary
                      </span>
                    )}
                    <div className="absolute right-2 top-2 flex gap-1">
                      {i !== primary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(i)}
                          title="Make primary"
                          className="rounded-full bg-white/90 p-1.5 text-gold-700 shadow hover:bg-white"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        title="Remove"
                        className="rounded-full bg-white/90 p-1.5 text-rose-700 shadow hover:bg-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Section title="Category" hint="Select main category.">
            <div className="space-y-2">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gold/20 px-3 py-2 text-sm hover:bg-beige/50"
                >
                  <input
                    type="radio"
                    name="category"
                    value={c.name}
                    checked={selectedCategory === c.name}
                    onChange={() => setSelectedCategory(c.name)}
                    className="h-4 w-4 accent-maroon"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </Section>

          <Section title="Inventory">
            <div className="space-y-4">
              <Field label="Stock Quantity">
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Stock Status">
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="in">In stock</option>
                  <option value="out">Out of stock</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Visibility">
            <div className="space-y-2">
              <Toggle label="Active" note="Visible on the website" checked={active} onChange={setActive} />
              <Toggle label="Featured Product" note="Show in featured sections" checked={featured} onChange={setFeatured} />
              <Toggle label="New Arrival" note="Show in New Arrivals" checked={newArrival} onChange={setNewArrival} />
            </div>
          </Section>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtn} flex-1 py-3 disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Product
                </>
              )}
            </button>
            <Link href="/admin/products" className={`${secondaryBtn} py-3`}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

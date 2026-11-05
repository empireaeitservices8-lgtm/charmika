"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, X, Star, Save, ArrowLeft } from "lucide-react";
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

function Price({ defaultValue }: { defaultValue?: number | null }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-charcoal/50">₹</span>
      <input
        type="number"
        min="0"
        step="0.01"
        defaultValue={defaultValue ?? ""}
        placeholder="0.00"
        className={`${inputClass} pl-7`}
      />
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
  const isEdit = mode === "edit";
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [primary, setPrimary] = useState(0);
  const [active, setActive] = useState(initial ? initial.status === "active" : true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [newArrival, setNewArrival] = useState(initial?.newArrival ?? false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
    e.target.value = "";
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPrimary((p) => (i === p ? 0 : i < p ? p - 1 : p));
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
      <PageHeader
        eyebrow={isEdit ? "Update Catalogue" : "Catalogue Expansion"}
        title={isEdit ? "Edit Product" : "Add New Product"}
      >
        <Link href="/admin/products" className={secondaryBtn}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Product Name" className="sm:col-span-2">
                <input defaultValue={initial?.name} placeholder="e.g. Antique Gold Haaram" className={inputClass} />
              </Field>
              <Field label="Slug">
                <input defaultValue={initial?.slug} placeholder="antique-gold-haaram" className={inputClass} />
              </Field>
              <Field label="SKU">
                <input defaultValue={initial?.sku} placeholder="CH-HAR-001" className={`${inputClass} font-mono`} />
              </Field>
              <Field label="Short Description" className="sm:col-span-2">
                <textarea rows={2} defaultValue={initial?.shortDescription} className={inputClass} />
              </Field>
              <Field label="Full Description" className="sm:col-span-2">
                <textarea rows={6} defaultValue={initial?.description} className={inputClass} />
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Regular Price">
                <Price defaultValue={initial?.regularPrice} />
              </Field>
              <Field label="Sale Price">
                <Price defaultValue={initial?.salePrice} />
              </Field>
              <Field label="Cost Price (optional)">
                <Price defaultValue={initial?.costPrice} />
              </Field>
            </div>
          </Section>

          <Section title="Jewellery Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Material">
                <input defaultValue={initial?.material} placeholder="e.g. Antique gold plated" className={inputClass} />
              </Field>
              <Field label="Jewellery Type">
                <select defaultValue={initial?.jewelleryType ?? ""} className={inputClass}>
                  <option value="">Select type</option>
                  {["Haaram", "Choker", "Necklace", "Earrings", "Bangles", "Full Set"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Weight">
                <input defaultValue={initial?.weight} placeholder="e.g. 85 g" className={inputClass} />
              </Field>
              <Field label="Size">
                <input defaultValue={initial?.size} placeholder="e.g. Free size" className={inputClass} />
              </Field>
              <Field label="Colour">
                <input defaultValue={initial?.colour} placeholder="e.g. Gold" className={inputClass} />
              </Field>
              <Field label="Occasion">
                <select defaultValue={initial?.occasion ?? ""} className={inputClass}>
                  <option value="">Select occasion</option>
                  {["Wedding", "Festive", "Party", "Daily wear"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Gender / Collection">
                <select defaultValue={initial?.collection ?? ""} className={inputClass}>
                  <option value="">Select collection</option>
                  {["Women", "Bridal", "Kids", "Festive"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags">
                <input defaultValue={initial?.tags} placeholder="comma, separated, tags" className={inputClass} />
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
          <Section title="Category" hint="Select one or more.">
            <div className="space-y-2">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gold/20 px-3 py-2 text-sm hover:bg-beige/50"
                >
                  <input
                    type="checkbox"
                    defaultChecked={initial?.category === c.name}
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
                <input type="number" min="0" defaultValue={initial?.stock ?? 0} className={inputClass} />
              </Field>
              <Field label="Stock Status">
                <select defaultValue={initial && initial.stock <= 0 ? "out" : "in"} className={inputClass}>
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
            <button type="submit" className={`${primaryBtn} flex-1 py-3`}>
              <Save className="h-3.5 w-3.5" />
              Save Product
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
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  X,
  Star,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, labelClass, cardClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { productService, type Product } from "@/lib/services/product.service";
import { categoryService, type Category } from "@/lib/services/category.service";
import { uploadService } from "@/lib/services/upload.service";

function Section({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${cardClass} p-6 sm:p-8 transition-shadow hover:shadow-luxury`}>
      <div className="mb-6 flex items-start gap-3 border-b border-gold/15 pb-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-bold text-maroon">
          {number}
        </span>
        <div>
          <h3 className="font-serif text-lg font-bold text-maroon">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-charcoal/50">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export default function ProductForm({ mode, initial }: { mode: "add" | "edit"; initial?: Product }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  // Section 1: Basic Information
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initial?.slug));
  const [sku, setSku] = useState(initial?.sku || "");
  const [description, setDescription] = useState(initial?.description || initial?.shortDescription || "");

  // Section 2: Pricing
  const [regularPrice, setRegularPrice] = useState<string>(
    initial?.regularPrice ? String(initial.regularPrice) : ""
  );
  const [salePrice, setSalePrice] = useState<string>(
    initial?.salePrice ? String(initial.salePrice) : ""
  );

  // Section 3: Essential Jewellery Information
  const [material, setMaterial] = useState(initial?.material || "");
  const [jewelleryType, setJewelleryType] = useState(initial?.jewelleryType || "");
  const [occasion, setOccasion] = useState(initial?.occasion || "");

  // Section 4: Product Images
  const initialImages = (initial?.images || []).map((img) => ({
    url: img.url,
    name: "Product Image",
  }));
  const [images, setImages] = useState<{ url: string; name: string }[]>(
    initialImages.length > 0
      ? initialImages
      : initial?.primaryImage
      ? [{ url: initial.primaryImage, name: "Primary Image" }]
      : []
  );
  const [primary, setPrimary] = useState(0);
  const [imageUrlInput, setImageUrlInput] = useState("");

  function handleAddImageUrl() {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, { url: imageUrlInput.trim(), name: "Image from URL" }]);
    setImageUrlInput("");
  }

  // Section 5: Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">(
    initial?.categoryId || ""
  );

  // Section 6: Inventory
  const [stockQuantity, setStockQuantity] = useState<number>(initial?.stock ?? 1);

  // Section 7: Store Visibility
  const [active, setActive] = useState(initial ? initial.status === "active" : true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load database categories
  useEffect(() => {
    categoryService
      .getAll()
      .then((cats) => {
        setCategories(cats);
        if (!selectedCategoryId && cats.length > 0) {
          const matched = initial?.category
            ? cats.find((c) => c.name === initial.category)
            : cats[0];
          setSelectedCategoryId(matched ? matched.id : cats[0].id);
        }
      })
      .catch(console.error);
  }, [initial, selectedCategoryId]);

  // Auto-generate slug from name unless manually modified
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    setName(newName);
    if (!isSlugManual) {
      setSlug(generateSlug(newName));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManual(true);
    setSlug(e.target.value);
  }

  // Handle Image Upload
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploadedUrls = await uploadService.uploadFiles(files);
      const newItems = uploadedUrls.map((url, idx) => ({
        url,
        name: files[idx].name,
      }));
      setImages((prev) => [...prev, ...newItems]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please ensure file is PNG, JPG, or WEBP under 5MB.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPrimary((p) => (i === p ? 0 : i < p ? p - 1 : p));
  }

  // Automatic Stock Status Calculation
  const isAutoInStock = stockQuantity > 0;
  const autoStockStatus = isAutoInStock ? "in_stock" : "out_of_stock";

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product Name is required.");
      return;
    }

    if (!selectedCategoryId) {
      setError("Please select a Category from the list.");
      return;
    }

    const regularNum = parseFloat(regularPrice);
    if (isNaN(regularNum) || regularNum <= 0) {
      setError("Regular Price is required and must be greater than zero.");
      return;
    }

    if (salePrice && parseFloat(salePrice) > regularNum) {
      setError("Sale Price cannot exceed Regular Price.");
      return;
    }

    if (stockQuantity < 0) {
      setError("Stock Quantity cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

      const formattedImages = images.map((img, i) => ({
        url: img.url,
        isPrimary: i === primary,
        displayOrder: i,
      }));

      const payload = {
        name: name.trim(),
        slug: slug.trim() ? generateSlug(slug) : generateSlug(name),
        sku: sku.trim() || undefined,
        categoryId: Number(selectedCategoryId),
        category: selectedCategoryObj?.name || "",
        regularPrice: regularNum,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: stockQuantity,
        status: (active ? "active" : "inactive") as "active" | "inactive",
        description: description.trim() || null,
        material: material.trim() || null,
        jewelleryType: jewelleryType || null,
        occasion: occasion || null,
        images: formattedImages,
      };

      if (isEdit && initial) {
        await productService.update(initial.id, payload);
      } else {
        await productService.create(payload);
      }

      router.push("/admin/products");
    } catch (err: any) {
      console.error("Save product error:", err);
      setError(err?.message || "Failed to save product. Please check the fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      <PageHeader
        eyebrow={isEdit ? "Update Catalogue" : "Catalogue Expansion"}
        title={isEdit ? "Edit Product" : "Add New Product"}
      >
        <Link href="/admin/products" className={secondaryBtn}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </PageHeader>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 shadow-xs">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: BASIC INFORMATION */}
        <Section
          number="1"
          title="Basic Information"
          hint="Essential product details and search keywords."
        >
          <div className="space-y-5">
            <Field label="Product Name" required>
              <input
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Grand Antique Temple Haaram"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Slug (URL identifier)">
                <div className="relative">
                  <input
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="grand-antique-temple-haaram"
                    className={`${inputClass} font-mono text-xs`}
                  />
                  {!isSlugManual && name && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                      <Sparkles className="h-3 w-3" /> Auto
                    </span>
                  )}
                </div>
              </Field>

              <Field label="SKU (Stock Keeping Unit)">
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. CH-HAR-001 (Optional)"
                  className={`${inputClass} font-mono`}
                />
              </Field>
            </div>

            <Field label="Product Description">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted temple motifs, plating finish, occasion styling..."
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {/* SECTION 2: PRICING */}
        <Section
          number="2"
          title="Pricing"
          hint="Customer selling price and optional festive discount."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Regular Price (₹)" required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-charcoal/50">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </Field>

            <Field label="Sale Price (₹, Optional Discount)">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-charcoal/50">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Optional discounted price"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* SECTION 3: JEWELLERY INFORMATION */}
        <Section
          number="3"
          title="Jewellery Specifications"
          hint="Key craftsmanship details for customer browsing."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Material">
              <input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 22K Gold Plated Brass, Kemp Stones"
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
                {["Haaram", "Choker", "Necklace", "Earrings", "Bangles", "Full Set", "Rentals"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Occasion">
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className={inputClass}
              >
                <option value="">Select occasion</option>
                {["Wedding", "Bridal", "Festive", "Party Wear", "Daily Wear"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* SECTION 4: PRODUCT IMAGES */}
        <Section
          number="4"
          title="Product Images"
          hint="Upload high-resolution photography. The primary image is featured on catalogue cards."
        >
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/40 bg-beige/40 px-6 py-8 text-center transition-colors hover:bg-beige/80">
              {uploading ? (
                <>
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-gold-600" />
                  <span className="text-sm font-semibold text-maroon">Uploading image files...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="mb-2 h-8 w-8 text-gold-600" />
                  <span className="text-sm font-semibold text-maroon">Click to upload product images</span>
                  <span className="mt-1 text-xs text-charcoal/50">
                    Supports PNG, JPG, or WEBP (up to 5MB each). Multiple images allowed.
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <div className="flex gap-2 items-center">
              <input
                type="url"
                placeholder="Or paste an image URL (e.g. https://... or /images/...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                className={`${inputClass} flex-1 text-xs`}
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="rounded-lg bg-gold/20 border border-gold/40 px-3 py-2 text-xs font-bold text-maroon hover:bg-gold/40 transition-colors shrink-0"
              >
                Add URL
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div
                    key={img.url + i}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gold/25 bg-white shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                    {i === primary ? (
                      <span className="absolute left-2 top-2 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold shadow">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        title="Set as primary image"
                        className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 text-gold-700 shadow hover:bg-white"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Remove image"
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-rose-700 shadow hover:bg-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* SECTION 5: CATEGORY */}
        <Section
          number="5"
          title="Category Selection"
          hint="Select the curated jewellery collection for this item."
        >
          <Field label="Category" required>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className={inputClass}
            >
              {categories.length === 0 && <option value="">Loading categories from database...</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        {/* SECTION 6: INVENTORY & AUTOMATIC STOCK STATUS */}
        <Section
          number="6"
          title="Inventory"
          hint="Warehouse stock count with automated status calculation."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-center">
            <Field label="Stock Quantity" required>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                placeholder="1"
                className={inputClass}
              />
              <span className="mt-1 block text-[11px] text-charcoal/50">
                Number of physical units available in stock.
              </span>
            </Field>

            <div>
              <label className={labelClass}>Calculated Stock Status (Automatic)</label>
              <div className="mt-1 flex items-center gap-3 rounded-xl border border-gold/20 bg-beige/30 p-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isAutoInStock
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAutoInStock ? "bg-emerald-600" : "bg-rose-600 animate-pulse"
                    }`}
                  />
                  {autoStockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-xs text-charcoal/60">
                  {isAutoInStock
                    ? "Available for instant customer purchases"
                    : "Zero stock: marked out of stock"}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* SECTION 7: VISIBILITY */}
        <Section
          number="7"
          title="Visibility"
          hint="Control product publication on the storefront."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                active ? "border-maroon bg-maroon/5" : "border-gold/20 bg-beige/20 hover:bg-beige/40"
              }`}
            >
              <input
                type="radio"
                name="store_visibility"
                checked={active}
                onChange={() => setActive(true)}
                className="mt-1 accent-maroon"
              />
              <div>
                <span className="block font-semibold text-charcoal text-sm">Active & Published</span>
                <span className="block text-xs text-charcoal/60 mt-0.5">
                  Visible to all customers browsing the online store.
                </span>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                !active ? "border-maroon bg-maroon/5" : "border-gold/20 bg-beige/20 hover:bg-beige/40"
              }`}
            >
              <input
                type="radio"
                name="store_visibility"
                checked={!active}
                onChange={() => setActive(false)}
                className="mt-1 accent-maroon"
              />
              <div>
                <span className="block font-semibold text-charcoal text-sm">Draft / Inactive</span>
                <span className="block text-xs text-charcoal/60 mt-0.5">
                  Hidden from catalogue while you prepare details.
                </span>
              </div>
            </label>
          </div>
        </Section>

        {/* SECTION 8: FORM ACTIONS */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end pt-4">
          <Link href="/admin/products" className={`${secondaryBtn} px-6 py-3`}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`${primaryBtn} px-8 py-3 text-sm disabled:opacity-60 shadow-lg`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Product...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? "Update Product" : "Save Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

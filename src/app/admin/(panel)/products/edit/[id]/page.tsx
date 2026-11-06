"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { productService, type Product } from "@/lib/services/product.service";

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError(true);
      setLoading(false);
      return;
    }

    productService
      .getById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error loading product for edit:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
        <span className="text-xs text-charcoal/60">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-xs text-rose-800">
        <p className="font-semibold">Product not found</p>
        <p className="mt-1">The requested product could not be loaded or has been deleted.</p>
        <button
          onClick={() => router.push("/admin/products")}
          className="mt-4 rounded-lg bg-maroon px-4 py-2 text-xs font-bold text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return <ProductForm mode="edit" initial={product} />;
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
          <span className="text-xs text-charcoal/60">Loading...</span>
        </div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}

import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { products } from "@/lib/mockData";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  return <ProductForm mode="edit" initial={product} />;
}
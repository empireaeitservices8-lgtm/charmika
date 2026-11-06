import { apiRequest } from "../api";

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categoryId?: number;
  regularPrice: number;
  salePrice: number | null;
  costPrice?: number | null;
  stock: number;
  status: "active" | "inactive";
  featured: boolean;
  newArrival: boolean;
  added: string;
  createdAt?: string;
  shortDescription?: string | null;
  description?: string | null;
  material?: string | null;
  jewelleryType?: string | null;
  weight?: string | null;
  size?: string | null;
  colour?: string | null;
  occasion?: string | null;
  collection?: string | null;
  tags?: string | null;
  primaryImage?: string | null;
  images?: {
    id?: number;
    url: string;
    isPrimary: boolean;
    displayOrder: number;
  }[];
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  status?: string;
  stock?: string;
  sort?: string;
};

export const productService = {
  async getAll(params: ProductQueryParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.query) searchParams.set("query", params.query);
    if (params.category && params.category !== "all") searchParams.set("category", params.category);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);
    if (params.stock && params.stock !== "all") searchParams.set("stock", params.stock);
    if (params.sort) searchParams.set("sort", params.sort);

    const qs = searchParams.toString();
    const endpoint = `/products${qs ? `?${qs}` : ""}`;
    const res = await apiRequest<Product[]>(endpoint);
    return {
      products: res.data,
      pagination: res.pagination,
    };
  },

  async getById(id: number) {
    const res = await apiRequest<Product>(`/products/${id}`);
    return res.data;
  },

  async create(data: Partial<Product> & { images?: { url: string; isPrimary: boolean; displayOrder: number }[] }) {
    const res = await apiRequest<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async update(id: number, data: Partial<Product> & { images?: { url: string; isPrimary: boolean; displayOrder: number }[] }) {
    const res = await apiRequest<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async delete(id: number) {
    const res = await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};

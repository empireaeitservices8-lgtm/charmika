import { apiRequest } from "../api";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: "active" | "inactive";
  products: number;
  createdAt?: string;
};

export const categoryService = {
  async getAll() {
    const res = await apiRequest<Category[]>("/categories");
    return res.data;
  },

  async getById(id: number) {
    const res = await apiRequest<Category>(`/categories/${id}`);
    return res.data;
  },

  async create(data: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    status: string;
  }) {
    const res = await apiRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async update(
    id: number,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      status?: string;
    }
  ) {
    const res = await apiRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async delete(id: number) {
    const res = await apiRequest(`/categories/${id}`, {
      method: "DELETE",
    });
    return res;
  },
};


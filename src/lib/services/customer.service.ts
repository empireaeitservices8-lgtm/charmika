import { apiRequest } from "../api";

export type CustomerAddress = {
  id: number;
  fullName?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  registrationDate: string;
  createdAt?: string;
  updatedAt?: string;
  totalOrders: number;
  totalSpending: number;
  addresses?: CustomerAddress[];
  mostRecentOrder?: {
    id: number;
    orderNumber: string;
    date: string;
    amount: number;
    status: string;
  } | null;
  orders?: {
    id: number;
    orderNumber: string;
    date: string;
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    productNames: string;
    itemsCount: number;
  }[];
};

export const customerService = {
  async getAll(params: { page?: number; limit?: number; query?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.query) searchParams.set("query", params.query);

    const qs = searchParams.toString();
    const endpoint = `/customers${qs ? `?${qs}` : ""}`;
    const res = await apiRequest<Customer[]>(endpoint);
    return {
      customers: res.data,
      pagination: res.pagination,
    };
  },

  async getById(id: number) {
    const res = await apiRequest<Customer>(`/customers/${id}`);
    return res.data;
  },

  async updateStatus(id: number, status: "active" | "inactive") {
    const res = await apiRequest<Customer>(`/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  async delete(id: number) {
    const res = await apiRequest<{ message: string }>(`/customers/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};



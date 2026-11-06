import { apiRequest } from "../api";

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activePublic: number;
  inactive: number;
  outOfStock: number;
  totalCategories: number;
};

export type DashboardRecentOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  date: string;
};

export type DashboardRecentCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  date: string;
  totalOrders: number;
  totalSpent: number;
};

export type DashboardTopProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  totalSold: number;
  totalRevenue: number;
  imageUrl?: string | null;
};

export type DashboardOutOfStockProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
};

export const dashboardService = {
  async getStats() {
    const res = await apiRequest<DashboardStats>("/dashboard/stats");
    return res.data;
  },

  async getRecentOrders(limit = 6) {
    const res = await apiRequest<DashboardRecentOrder[]>(
      `/dashboard/recent-orders?limit=${limit}`
    );
    return res.data;
  },

  async getRecentCustomers(limit = 6) {
    const res = await apiRequest<DashboardRecentCustomer[]>(
      `/dashboard/recent-customers?limit=${limit}`
    );
    return res.data;
  },

  async getTopProducts(limit = 5) {
    const res = await apiRequest<DashboardTopProduct[]>(
      `/dashboard/top-products?limit=${limit}`
    );
    return res.data;
  },

  async getOutOfStock(limit = 5) {
    const res = await apiRequest<DashboardOutOfStockProduct[]>(
      `/dashboard/out-of-stock?limit=${limit}`
    );
    return res.data;
  },
};

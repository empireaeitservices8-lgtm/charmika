import { apiRequest } from "../api";

export type OrderStatusHistoryItem = {
  id: number;
  prevStatus: string;
  newStatus: string;
  comment?: string;
  updatedBy: string;
  date: string;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  variant?: string;
  jewelleryType?: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currentStock?: number | null;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStatus?: string;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  stockDeducted: boolean;
  shippingAddress: string;
  billingAddress?: string;
  customerNotes?: string;
  couponCode?: string | null;
  transactionId?: string | null;
  itemsCount: number;
  items: OrderItem[];
  statusHistory?: OrderStatusHistoryItem[];
  createdAt: string;
  formattedDate: string;
  formattedUpdatedAt?: string;
};

export const orderService = {
  async getAll(
    params: {
      page?: number;
      limit?: number;
      query?: string;
      orderStatus?: string;
      paymentStatus?: string;
    } = {}
  ) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.query) searchParams.set("query", params.query);
    if (params.orderStatus && params.orderStatus !== "all")
      searchParams.set("orderStatus", params.orderStatus);
    if (params.paymentStatus && params.paymentStatus !== "all")
      searchParams.set("paymentStatus", params.paymentStatus);

    const qs = searchParams.toString();
    const endpoint = `/orders${qs ? `?${qs}` : ""}`;
    const res = await apiRequest<Order[]>(endpoint);
    return {
      orders: res.data,
      pagination: res.pagination,
    };
  },

  async getById(id: number) {
    const res = await apiRequest<Order>(`/orders/${id}`);
    return res.data;
  },

  async updateStatus(
    id: number,
    data: { orderStatus?: string; paymentStatus?: string; comment?: string }
  ) {
    const res = await apiRequest<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async create(data: any) {
    const res = await apiRequest<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },
};


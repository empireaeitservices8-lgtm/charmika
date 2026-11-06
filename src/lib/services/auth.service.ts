import { apiRequest } from "../api";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const res = await apiRequest<{ admin: AdminUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return res.data;
  },

  async logout() {
    const res = await apiRequest("/auth/logout", {
      method: "POST",
    });
    return res;
  },

  async getMe() {
    const res = await apiRequest<AdminUser>("/auth/me");
    return res.data;
  },

  async updateProfile(data: { name: string; email: string }) {
    const res = await apiRequest<AdminUser>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const res = await apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    });
    return res;
  },
};


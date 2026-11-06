const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/admin";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T; pagination?: any }> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach Bearer token from localStorage if available
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("charmika_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("charmika_admin_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Sends & receives HTTP-only cookies
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMsg = payload?.message || `Request failed with status ${response.status}`;
      
      // If unauthorized and in browser, redirect to login page
      if (response.status === 401 && typeof window !== "undefined") {
        const isAuthPage = window.location.pathname.includes("/login");
        if (!isAuthPage) {
          window.location.href = "/admin/login";
        }
      }

      throw new ApiError(errorMsg, response.status, payload);
    }

    return payload;
  } catch (error: any) {
    throw error;
  }
}

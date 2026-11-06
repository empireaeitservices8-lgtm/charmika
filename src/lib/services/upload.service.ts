import { apiRequest } from "../api";

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiRequest<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });

    return res.data.url;
  },

  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await apiRequest<any>("/upload", {
      method: "POST",
      body: formData,
    });

    return Array.isArray(res.data)
      ? res.data.map((item: any) => item.url)
      : [res.data?.url];
  },
};

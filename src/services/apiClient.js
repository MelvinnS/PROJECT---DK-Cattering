import axios from "axios";

// Backend NestJS (Cateringin) — tidak pakai prefix /api, langsung di root.
// Sesuaikan VITE_API_BASE_URL di .env kalau backend jalan di host/port lain.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Selipkan access token ke setiap request (kalau ada).
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Backend membungkus semua response dengan { success, statusCode, message, data }.
// Interceptor ini otomatis "membuka" bungkusnya supaya di kode lain tinggal pakai
// response.data langsung (tanpa response.data.data).
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Normalisasi pesan error dari backend: { success:false, message, ... }
    const message =
      error.response?.data?.message || error.message || "Terjadi kesalahan, coba lagi.";
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;

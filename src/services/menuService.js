import apiClient from "./apiClient";
import { USE_MOCK_BACKEND } from "../config/appConfig";

/**
 * Ambil semua menu aktif untuk halaman publik/customer.
 * Endpoint: GET /public/menus/active
 */
export const getPublicMenus = async () => {
  if (USE_MOCK_BACKEND) return [];
  // limit tinggi supaya semua menu tampil sekaligus (tanpa pagination)
  const response = await apiClient.get("/public/menus/active", {
    params: { limit: 100 },
  });
  // Interceptor sudah unwrap { success, data } → response.data = data
  // data yang dikembalikan dari backend berbentuk { data: [...], meta: {...} }
  return response.data?.data || response.data || [];
};

/**
 * Ambil semua menu (termasuk yang tidak aktif) untuk admin.
 * Endpoint: GET /admin/menus
 */
export const getAdminMenus = async () => {
  if (USE_MOCK_BACKEND) return [];
  const response = await apiClient.get("/admin/menus", {
    params: { limit: 100 },
  });
  return response.data?.data || response.data || [];
};

/**
 * Tambah menu baru ke backend.
 * Endpoint: POST /admin/menus
 */
export const createMenu = async (menuData) => {
  if (USE_MOCK_BACKEND) return { ...menuData, id: `mock-${Date.now()}` };
  const response = await apiClient.post("/admin/menus", menuData);
  return response.data;
};

/**
 * Update data menu di backend.
 * Endpoint: PATCH /admin/menus/:id
 */
export const updateMenuApi = async (id, updates) => {
  if (USE_MOCK_BACKEND) return { id, ...updates };
  const response = await apiClient.patch(`/admin/menus/${id}`, updates);
  return response.data;
};

/**
 * Hapus (soft delete) menu di backend.
 * Endpoint: DELETE /admin/menus/:id
 */
export const deleteMenuApi = async (id) => {
  if (USE_MOCK_BACKEND) return;
  await apiClient.delete(`/admin/menus/${id}`);
};

import apiClient from "./apiClient";

/** GET /public/menus/active — katalog menu untuk customer & landing page */
export const getActiveMenus = async (params = {}) => {
  const response = await apiClient.get("/public/menus/active", { params });
  return response.data; // { data: [...], meta: { total, page, limit, totalPages } }
};

/** GET /admin/menus — list menu untuk admin (dengan filter) */
export const getAdminMenus = async (params = {}) => {
  const response = await apiClient.get("/admin/menus", { params });
  return response.data;
};

/** POST /admin/menus — tambah menu baru */
export const createMenu = async (payload) => {
  const response = await apiClient.post("/admin/menus", payload);
  return response.data;
};

/** PATCH /admin/menus/:id — update menu */
export const updateMenu = async (id, payload) => {
  const response = await apiClient.patch(`/admin/menus/${id}`, payload);
  return response.data;
};

/** DELETE /admin/menus/:id — hapus menu (soft delete) */
export const deleteMenu = async (id) => {
  const response = await apiClient.delete(`/admin/menus/${id}`);
  return response.data;
};

/** POST /upload/image — upload foto menu ke Cloudinary */
export const uploadMenuImage = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // { url: "https://res.cloudinary.com/..." }
};

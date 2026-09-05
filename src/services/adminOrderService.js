import apiClient from "./apiClient";

/**
 * GET /admin/orders — list semua pesanan (dengan search/status/pagination)
 * @param {Object} params — { search, status, page, limit }
 */
export const getAdminOrders = async (params = {}) => {
  const response = await apiClient.get("/admin/orders", { params });
  return response.data; // { data: [...], meta: {...} }
};

/**
 * GET /admin/orders/:id — detail 1 pesanan lengkap
 */
export const getAdminOrderById = async (id) => {
  const response = await apiClient.get(`/admin/orders/${id}`);
  return response.data;
};

/**
 * PATCH /admin/orders/:id/status — update status pesanan
 * @param {string} id
 * @param {{ status: string, rejectionReason?: string }} payload
 */
export const updateAdminOrderStatus = async (id, payload) => {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, payload);
  return response.data;
};

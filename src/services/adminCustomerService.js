import apiClient from "./apiClient";

/** GET /admin/customers — list semua customer */
export const getAdminCustomers = async (params = {}) => {
  const response = await apiClient.get("/admin/customers", { params });
  return response.data;
};

/** GET /admin/customers/:id — detail customer + riwayat pesanan */
export const getAdminCustomerById = async (id) => {
  const response = await apiClient.get(`/admin/customers/${id}`);
  return response.data;
};

/** PATCH /admin/customers/:id/status — aktifkan / nonaktifkan akun */
export const toggleCustomerStatus = async (id, payload) => {
  const response = await apiClient.patch(`/admin/customers/${id}/status`, payload);
  return response.data;
};

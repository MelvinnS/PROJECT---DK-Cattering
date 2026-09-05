import apiClient from "./apiClient";

/** GET /admin/slots — list semua slot */
export const getSlots = async () => {
  const response = await apiClient.get("/admin/slots");
  return response.data;
};

/** POST /admin/slots — tambah slot baru */
export const createSlot = async (payload) => {
  const response = await apiClient.post("/admin/slots", payload);
  return response.data;
};

/** PATCH /admin/slots/:id — update slot (waktu / status) */
export const updateSlot = async (id, payload) => {
  const response = await apiClient.patch(`/admin/slots/${id}`, payload);
  return response.data;
};

/** DELETE /admin/slots/:id — hapus slot */
export const deleteSlot = async (id) => {
  const response = await apiClient.delete(`/admin/slots/${id}`);
  return response.data;
};

/** GET /public/slots — slot aktif untuk customer (pilih saat checkout) */
export const getPublicSlots = async () => {
  const response = await apiClient.get("/public/slots");
  return response.data;
};

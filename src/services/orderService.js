import apiClient from "./apiClient";

/**
 * GET /user/orders — list pesanan customer yang login
 * @param {Object} params — { status, page, limit }
 */
export const getMyOrders = async (params = {}) => {
  const response = await apiClient.get("/user/orders", { params });
  return response.data; // { data: [...], meta: {...} }
};

/**
 * POST /order/checkout — checkout dari keranjang
 * Minimal payload yang dibutuhkan:
 * { items: [{ menuId, quantity }], paymentType }
 * Optional: slotId, addressId, deliveryMethod, notes
 */
export const checkout = async (payload) => {
  const response = await apiClient.post("/order/checkout", payload);
  return response.data; // order + louvinPayment { qr_string, va_number, expired_at }
};

/**
 * PATCH /user/orders/:id/complete — konfirmasi pesanan diterima
 */
export const completeOrder = async (id) => {
  const response = await apiClient.patch(`/user/orders/${id}/complete`);
  return response.data;
};

/**
 * GET /user/orders/:id/tracking — tracking status pesanan
 */
export const trackOrder = async (id) => {
  const response = await apiClient.get(`/user/orders/${id}/tracking`);
  return response.data;
};

/**
 * POST /user/orders/:id/review — beri ulasan setelah COMPLETED
 * @param {string} id - orderId
 * @param {{ rating: number, comment: string }} payload
 */
export const submitReview = async (id, payload) => {
  const response = await apiClient.post(`/user/orders/${id}/review`, payload);
  return response.data;
};

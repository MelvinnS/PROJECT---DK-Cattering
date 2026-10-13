import apiClient from "./apiClient";

/**
 * GET /admin/reviews — semua ulasan customer
 * @param {Object} params — { search, rating, page, limit }
 */
export const getAdminReviews = async (params = {}) => {
  const response = await apiClient.get("/admin/reviews", { params });
  return response.data;
};

/** GET /public/reviews — ulasan publik untuk landing page */
export const getPublicReviews = async (params = {}) => {
  const response = await apiClient.get("/public/reviews", { params });
  return response.data;
};

/** DELETE /admin/reviews/:id — hapus ulasan */
export const deleteAdminReview = async (id) => {
  const response = await apiClient.delete(`/admin/reviews/${id}`);
  return response.data;
};

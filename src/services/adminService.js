import apiClient from "./apiClient";

/**
 * Satu-satunya data Dashboard Admin yang SUDAH real dari backend saat ini.
 * Mengembalikan: { period, totalRevenue, activeSubscribers, totalOrders, urgentAlertsCount }
 * urgentAlertsCount = jumlah pesanan yang harusnya diantar hari ini tapi
 * belum mulai dimasak (status masih PAID).
 *
 * Breakdown per-status (baru/diproses/diantar/selesai) & daftar pesanan
 * terbaru BELUM ada endpoint-nya di backend (GET admin/orders) — itu masih
 * data dummy di adminDummyData.js sampai backend menyediakannya.
 */
export const getAnalyticsOverview = async (period = "daily") => {
  const response = await apiClient.get("/admin/analytics/overview", {
    params: { period },
  });
  return response.data;
};

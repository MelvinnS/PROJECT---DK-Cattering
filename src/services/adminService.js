import apiClient from "./apiClient";
import { USE_MOCK_BACKEND } from "../config/appConfig";

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
  // Backend diputus -> kembalikan angka dummy supaya Dashboard tetap terisi.
  if (USE_MOCK_BACKEND) {
    return {
      period,
      totalRevenue: 1250000,
      activeSubscribers: 24,
      totalOrders: 28,
      urgentAlertsCount: 2,
    };
  }

  const response = await apiClient.get("/admin/analytics/overview", {
    params: { period },
  });
  return response.data;
};

import apiClient from "./apiClient";
import { USE_MOCK_BACKEND } from "../config/appConfig";

export const getAnalyticsOverview = async (period = "daily") => {
  if (USE_MOCK_BACKEND) {
    return {
      period,
      totalRevenue: 0,
      activeSubscribers: 0,
      totalOrders: 0,
      urgentAlertsCount: 0,
    };
  }

  const response = await apiClient.get("/admin/analytics/overview", {
    params: { period },
  });
  return response.data;
};

export const getAdminCustomers = async (params = {}) => {
  if (USE_MOCK_BACKEND) {
    return { data: [], meta: { total: 0 } };
  }
  const response = await apiClient.get("/admin/customers", { params });
  return response.data;
};

export const getAdminCustomerById = async (id) => {
  const response = await apiClient.get(`/admin/customers/${id}`);
  return response.data;
};

export const updateCustomerStatus = async (id, isActive) => {
  const response = await apiClient.patch(`/admin/customers/${id}/status`, { isActive });
  return response.data;
};

export const getAdminOrders = async () => {
  if (USE_MOCK_BACKEND) {
    return [];
  }
  const response = await apiClient.get("/admin/orders");
  return response.data?.data || response.data || [];
};

export const updateOrderStatus = async (id, status, proofOfDelivery = null) => {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, {
    status,
    proofOfDelivery,
  });
  return response.data;
};

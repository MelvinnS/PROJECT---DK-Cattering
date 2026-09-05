import { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../services/adminOrderService";

const AdminOrderContext = createContext(undefined);

export const AdminOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null); // { total, page, limit, totalPages }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list orders dari BE (dengan filter search/status/page/limit)
  const fetchOrders = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminOrders(params);
      const items = Array.isArray(result) ? result : result?.data ?? [];
      setOrders(items);
      setMeta(result?.meta ?? null);
    } catch (err) {
      console.error("Gagal memuat pesanan admin:", err);
      setError(err.message ?? "Gagal memuat pesanan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil 1 order by id — dari state lokal dulu, kalau tidak ada fetch dari BE
  const getOrderById = useCallback(
    async (id) => {
      const local = orders.find((o) => o.id === id);
      if (local) return local;
      try {
        return await getAdminOrderById(id);
      } catch {
        return null;
      }
    },
    [orders]
  );

  // Update status di BE, lalu sinkron state lokal
  const updateOrderStatus = useCallback(async (id, newStatus, extra = {}) => {
    const payload = { status: newStatus, ...extra };
    const updated = await updateAdminOrderStatus(id, payload);
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updated } : order))
    );
    return updated;
  }, []);

  const acceptOrder = useCallback(
    (id) => updateOrderStatus(id, "IN_KITCHEN"),
    [updateOrderStatus]
  );

  const rejectOrder = useCallback(
    (id, reason) => {
      if (!reason?.trim()) throw new Error("Alasan penolakan wajib diisi.");
      return updateOrderStatus(id, "CANCELLED", { rejectionReason: reason.trim() });
    },
    [updateOrderStatus]
  );

  // Batch accept — panggil satu-satu (BE belum punya batch endpoint)
  const batchAcceptOrders = useCallback(
    async (ids) => {
      await Promise.all(ids.map((id) => acceptOrder(id)));
    },
    [acceptOrder]
  );

  // Batch reject
  const batchRejectOrders = useCallback(
    async (ids, reason) => {
      if (!reason?.trim()) throw new Error("Alasan penolakan wajib diisi.");
      await Promise.all(ids.map((id) => rejectOrder(id, reason)));
    },
    [rejectOrder]
  );

  // Count per status (dari orders yang sudah di-fetch)
  const statusCounts = useMemo(() => {
    return {
      new: orders.filter((o) => o.status === "PAID").length,
      inKitchen: orders.filter((o) => o.status === "IN_KITCHEN").length,
      onDelivery: orders.filter((o) => o.status === "ON_DELIVERY").length,
      done: orders.filter((o) => ["DELIVERED", "COMPLETED"].includes(o.status)).length,
    };
  }, [orders]);

  const value = {
    orders,
    meta,
    isLoading,
    error,
    statusCounts,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
    acceptOrder,
    rejectOrder,
    batchAcceptOrders,
    batchRejectOrders,
  };

  return (
    <AdminOrderContext.Provider value={value}>
      {children}
    </AdminOrderContext.Provider>
  );
};

export const useAdminOrders = () => {
  const context = useContext(AdminOrderContext);
  if (!context) {
    throw new Error("useAdminOrders must be used within an AdminOrderProvider");
  }
  return context;
};

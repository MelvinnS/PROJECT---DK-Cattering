<<<<<<< HEAD
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { countOrdersByStatus } from "../data/adminDummyData";
import { getAdminOrders, updateOrderStatus as apiUpdateOrderStatus } from "../services/adminService";
=======
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  batchUpdateAdminOrderStatus,
} from "../services/adminOrderService";
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e

const AdminOrderContext = createContext(undefined);

const mapBackendOrder = (o) => ({
  id: o.orderNumber || o.id,
  backendId: o.id,
  customerId: o.user ? `Cust ${o.user.fullName?.split(" ")[0]}` : "Guest",
  customerName: o.user?.fullName || "Guest",
  customerPhone: o.user?.phone || "-",
  customerEmail: o.user?.email || "-",
  deliveryAddress: o.address
    ? `${o.address.streetName || ""}, ${o.address.detailNotes || ""}`.trim()
    : "Ambil Sendiri (Pickup)",
  deliverySlot: o.slot?.name || "Slot Pagi",
  deliveryDate: o.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  notes: o.notes || "-",
  paymentMethod: "QRIS / Transfer",
  paymentStatus: o.status === "PENDING_PAYMENT" ? "UNPAID" : "PAID",
  items: (o.items || []).map((it) => ({
    id: it.id,
    name: it.menu?.name || "Menu",
    price: Number(it.price) || (it.menu ? Number(it.menu.price) : 0),
    qty: it.quantity,
    notes: it.specialNotes || "-",
  })),
  subtotal: Number(o.subtotal) || 0,
  deliveryFee: Number(o.deliveryFee) || 0,
  totalPrice: Number(o.totalPrice) || 0,
  status: o.status,
  createdAt: o.createdAt,
  rejectionReason: null,
});

export const AdminOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders((data || []).map(mapBackendOrder));
    } catch (err) {
      console.error("Gagal mengambil data pesanan admin:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusCounts = useMemo(() => countOrdersByStatus(orders), [orders]);

  const getOrderById = (id) => {
    return orders.find((o) => o.id === id || o.backendId === id);
  };

  const updateOrderStatus = async (id, newStatus, extra = {}) => {
    const target = orders.find((o) => o.id === id || o.backendId === id);
    if (target?.backendId) {
      try {
        await apiUpdateOrderStatus(target.backendId, newStatus);
      } catch (err) {
        console.error("Gagal update status pesanan di backend:", err);
      }
    }
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id || order.backendId === id) {
          return {
            ...order,
            status: newStatus,
            ...extra,
          };
        }
        return order;
      })
    );
  };

  const acceptOrder = async (id) => {
    await updateOrderStatus(id, "IN_KITCHEN");
  };

  const rejectOrder = async (id, reason) => {
    if (!reason || !reason.trim()) {
      throw new Error("Alasan penolakan wajib diisi.");
    }
    await updateOrderStatus(id, "CANCELLED", { rejectionReason: reason.trim() });
  };

  const batchAcceptOrders = async (ids) => {
    for (const id of ids) {
      await acceptOrder(id);
    }
  };

  const batchRejectOrders = async (ids, reason) => {
    if (!reason || !reason.trim()) {
      throw new Error("Alasan penolakan wajib diisi.");
    }
    for (const id of ids) {
      await rejectOrder(id, reason);
    }
  };

  const value = {
    orders,
    loading,
    refreshOrders: fetchOrders,
=======
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

  // Batch accept — panggil endpoint batch BE
  const batchAcceptOrders = useCallback(
    async (ids) => {
      await batchUpdateAdminOrderStatus({ orderIds: ids, status: "IN_KITCHEN" });
      setOrders((prev) =>
        prev.map((order) => (ids.includes(order.id) ? { ...order, status: "IN_KITCHEN" } : order))
      );
    },
    []
  );

  // Batch reject — panggil endpoint batch BE
  const batchRejectOrders = useCallback(
    async (ids, reason) => {
      if (!reason?.trim()) throw new Error("Alasan penolakan wajib diisi.");
      await batchUpdateAdminOrderStatus({
        orderIds: ids,
        status: "CANCELLED",
        rejectionReason: reason.trim(),
      });
      setOrders((prev) =>
        prev.map((order) =>
          ids.includes(order.id)
            ? { ...order, status: "CANCELLED", rejectionReason: reason.trim() }
            : order
        )
      );
    },
    []
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
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
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

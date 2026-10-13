import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { countOrdersByStatus } from "../data/adminDummyData";
import { getAdminOrders, updateOrderStatus as apiUpdateOrderStatus } from "../services/adminService";

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
    statusCounts,
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

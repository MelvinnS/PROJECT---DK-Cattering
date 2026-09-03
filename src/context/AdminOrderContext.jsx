import { createContext, useContext, useState, useMemo } from "react";
import { initialAdminOrders, countOrdersByStatus } from "../data/adminDummyData";

const AdminOrderContext = createContext(undefined);

export const AdminOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(initialAdminOrders);

  const statusCounts = useMemo(() => countOrdersByStatus(orders), [orders]);

  const getOrderById = (id) => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = (id, newStatus, extra = {}) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
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

  const acceptOrder = (id) => {
    updateOrderStatus(id, "IN_KITCHEN");
  };

  const rejectOrder = (id, reason) => {
    if (!reason || !reason.trim()) {
      throw new Error("Alasan penolakan wajib diisi.");
    }
    updateOrderStatus(id, "CANCELLED", { rejectionReason: reason.trim() });
  };

  const batchAcceptOrders = (ids) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (ids.includes(order.id) && order.status === "PAID") {
          return { ...order, status: "IN_KITCHEN" };
        }
        return order;
      })
    );
  };

  const batchRejectOrders = (ids, reason) => {
    if (!reason || !reason.trim()) {
      throw new Error("Alasan penolakan wajib diisi.");
    }
    setOrders((prev) =>
      prev.map((order) => {
        if (ids.includes(order.id)) {
          return {
            ...order,
            status: "CANCELLED",
            rejectionReason: reason.trim(),
          };
        }
        return order;
      })
    );
  };

  const value = {
    orders,
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


<<<<<<< HEAD
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";
import { USE_MOCK_BACKEND } from "../config/appConfig";
=======
import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { getMyOrders, checkout as apiCheckout } from "../services/orderService";
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e

const OrderContext = createContext(undefined);

let cartItemUid = 0;

<<<<<<< HEAD
export const OrderProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Tambah menu baru ke keranjang atau tambah qty kalau sudah ada.
=======
// Status aktif (belum selesai)
export const ACTIVE_STATUSES = ["PENDING_PAYMENT", "PAID", "IN_KITCHEN", "ON_DELIVERY", "DELIVERED"];
// Status final (sudah selesai/batal)
export const FINAL_STATUSES = ["COMPLETED", "CANCELLED"];

// Mapping status BE → label Indonesia
export const orderStatusLabel = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Menunggu Konfirmasi",
  IN_KITCHEN: "Sedang Dimasak",
  ON_DELIVERY: "Sedang Diantar",
  DELIVERED: "Sudah Tiba",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

// Mapping status → warna badge
export const orderStatusColor = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PAID: "bg-amber-100 text-amber-700",
  IN_KITCHEN: "bg-blue-100 text-blue-700",
  ON_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const OrderProvider = ({ children }) => {
  // ── Keranjang ──────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);

  // ── Orders dari BE ─────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // ── Checkout state ─────────────────────────────────────────────────────────
  const [lastCheckoutResult, setLastCheckoutResult] = useState(null); // { order, louvinPayment }

  // ── Fetch orders dari BE ───────────────────────────────────────────────────
  const fetchOrders = useCallback(async (params = {}) => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const result = await getMyOrders(params);
      const items = Array.isArray(result) ? result : result?.data ?? [];
      const meta = result?.meta ?? null;
      setOrders(items);
      setOrdersMeta(meta);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
      setOrdersError(err.message ?? "Gagal memuat pesanan");
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // ── Cart operations ────────────────────────────────────────────────────────
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
  const addToCart = (menu) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          uid: `cart-${++cartItemUid}`,
          menuId: menu.id,
          name: menu.name,
          price: menu.price,
          image: menu.image,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (menuId) => {
    setCartItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const incrementQty = (menuId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrementQty = (menuId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.menuId === menuId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  );

  // ── Checkout ke BE ─────────────────────────────────────────────────────────
  /**
<<<<<<< HEAD
   * Mengirim pesanan ke backend API POST /order/checkout
   */
  const placeOrder = async () => {
    if (cartItems.length === 0) return null;

    // Ambil default slot pengiriman dari database (slot pagi)
    let slotId = "f540cfeb-73ab-4fd3-be18-7cfd0c4d4fa6";
    try {
      const slotsRes = await apiClient.get("/public/slots");
      if (slotsRes.data && slotsRes.data.length > 0) {
        slotId = slotsRes.data[0].id;
      }
    } catch {
      // fallback ke slot default
    }

    const payload = {
      items: cartItems.map((it) => ({
        menuId: String(it.menuId),
        quantity: it.qty,
        specialNotes: "",
      })),
      deliveryMethod: "PICKUP",
      slotId: slotId,
      paymentType: "qris",
      notes: "Pesanan melalui web",
    };

    if (!USE_MOCK_BACKEND) {
      try {
        const response = await apiClient.post("/order/checkout", payload);
        const orderData = response.data;
        const newOrder = {
          id: orderData.orderNumber || `ORD-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          items: cartItems.map(({ name, qty, price }) => ({ name, qty, price })),
          total: cartTotal,
          status: "Menunggu Konfirmasi",
        };
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        return newOrder;
      } catch (err) {
        console.error("Gagal melakukan checkout ke backend:", err);
        throw err;
      }
    } else {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        items: cartItems.map(({ name, qty, price }) => ({ name, qty, price })),
        total: cartTotal,
        status: "Menunggu Konfirmasi",
      };
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    }
=======
   * Kirim pesanan ke backend.
   * @param {{ paymentType: string, slotId?: string, addressId?: string, deliveryMethod?: string, notes?: string }} options
   * @returns hasil dari BE: { id, orderNumber, louvinPayment: { qr_string, va_number, expired_at } }
   */
  const placeOrder = async (options = {}) => {
    if (cartItems.length === 0) return null;

    const payload = {
      items: cartItems.map(({ menuId, qty }) => ({
        menuId,
        quantity: qty,
      })),
      paymentType: options.paymentType ?? "qris",
      ...(options.slotId && { slotId: options.slotId }),
      ...(options.addressId && { addressId: options.addressId }),
      ...(options.deliveryMethod && { deliveryMethod: options.deliveryMethod }),
      ...(options.notes && { notes: options.notes }),
    };

    const result = await apiCheckout(payload);
    setLastCheckoutResult(result);
    clearCart();
    return result;
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
  };

  // ── Derived orders ─────────────────────────────────────────────────────────
  const activeOrders = useMemo(
    () => orders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
    [orders]
  );

  const pastOrders = useMemo(
    () => orders.filter((o) => FINAL_STATUSES.includes(o.status)),
    [orders]
  );

  const value = {
    // Cart
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    incrementQty,
    decrementQty,
    clearCart,
    // Orders
    orders,
    ordersMeta,
    activeOrders,
    pastOrders,
    isLoadingOrders,
    ordersError,
    fetchOrders,
    // Checkout
    placeOrder,
    lastCheckoutResult,
    // Utils
    orderStatusLabel,
    orderStatusColor,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

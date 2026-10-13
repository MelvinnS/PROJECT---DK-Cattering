import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";
import { USE_MOCK_BACKEND } from "../config/appConfig";

const OrderContext = createContext(undefined);

let cartItemUid = 0;

export const OrderProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Tambah menu baru ke keranjang atau tambah qty kalau sudah ada.
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

  /**
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
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    incrementQty,
    decrementQty,
    clearCart,
    orders,
    placeOrder,
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

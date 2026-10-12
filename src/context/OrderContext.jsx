import { createContext, useContext, useMemo, useState } from "react";
import { seedOrders } from "../data/orderDummyData";

const OrderContext = createContext(undefined);

let cartItemUid = 0;

export const OrderProvider = ({ children }) => {
  // Isi keranjang sementara (sebelum "Pesan Sekarang" ditekan).
  const [cartItems, setCartItems] = useState([]);
  // Daftar pesanan yang sudah dibuat (Pesanan aktif + Riwayat).
  // Diawali data dummy supaya halaman tidak kosong saat development.
  const [orders, setOrders] = useState(seedOrders);

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

  // Tambah 1 qty item yang SUDAH ada di keranjang (dipakai tombol "+" pada
  // stepper). Kalau item belum ada, tidak melakukan apa-apa — pakai
  // addToCart(menu) untuk menambah item baru pertama kali.
  const incrementQty = (menuId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Kurangi 1 qty item (dipakai tombol "-" pada stepper). Kalau qty jadi 0,
  // item otomatis dihapus dari keranjang — persis pola stepper Gacoan dkk.
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
   * Simulasi checkout/pembayaran (belum terhubung payment gateway/backend).
   * Membuat 1 order baru berstatus "Menunggu Konfirmasi" dari isi keranjang,
   * lalu mengosongkan keranjang. Nantinya order ini akan dikonfirmasi Admin
   * lewat backend, dan status-nya berubah sampai akhirnya masuk Riwayat.
   */
  const placeOrder = () => {
    if (cartItems.length === 0) return null;

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

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  ChevronUp,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";

/* ─────────────────────────────────────────────────────────────────────────
   CartPanel — isi keranjang (daftar pesanan + total + tombol checkout).
   Dipakai di dua tempat supaya tampilannya selalu sama:
   • bottom-sheet pada StickyOrderBar (mobile & semua halaman)
   • panel samping di halaman Menu (desktop)
   Memakai font biasa (Poppins) agar mudah dibaca.
   ───────────────────────────────────────────────────────────────────────── */
export const CartPanel = ({ onCheckout, className = "" }) => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,
  } = useOrder();

  if (cartItems.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
      >
        <span className="w-14 h-14 rounded-full bg-[#C48259]/15 text-[#A66432] flex items-center justify-center mb-4">
          <ShoppingBag size={24} />
        </span>
        <p className="font-semibold text-[#181818]">Belum ada pesanan</p>
        <p className="text-sm text-[#181818]/60 mt-1 max-w-[16rem]">
          Tambahkan menu favoritmu, nanti muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      {/* Daftar item */}
      <ul className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 divide-y divide-black/10">
        {cartItems.map((item) => (
          <li key={item.uid} className="flex gap-3 py-4">
            <span className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#FBF3E7] shrink-0 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <ShoppingBag size={20} className="text-[#C48259]" />
              )}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[#181818] text-sm leading-snug line-clamp-2">
                  {item.name}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.menuId)}
                  aria-label={`Hapus ${item.name} dari keranjang`}
                  className="shrink-0 -mr-1 -mt-1 w-8 h-8 rounded-full text-[#181818]/40 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-xs text-[#181818]/55 mt-0.5">
                {formatCurrency(item.price)} / porsi
              </p>

              <div className="mt-2.5 flex items-center justify-between">
                <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
                  <button
                    type="button"
                    onClick={() => decrementQty(item.menuId)}
                    aria-label={`Kurangi ${item.name}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#181818] hover:bg-black/5 active:scale-90 transition"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold text-[#181818] tabular-nums">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementQty(item.menuId)}
                    aria-label={`Tambah ${item.name}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#181818] hover:bg-black/5 active:scale-90 transition"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="font-bold text-[#181818] text-sm tabular-nums">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Ringkasan + checkout */}
      <div className="px-5 pt-4 pb-5 border-t border-black/10 bg-white/60">
        <div className="flex items-center justify-between text-sm text-[#181818]/60">
          <span>Jumlah porsi</span>
          <span className="font-medium text-[#181818]">{cartCount}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5 mb-4">
          <span className="text-sm font-medium text-[#181818]">Total</span>
          <span className="text-xl font-bold text-[#181818] tabular-nums">
            {formatCurrency(cartTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#181818] text-white font-semibold text-sm py-3.5 hover:bg-black active:scale-[0.99] transition"
        >
          Lanjut ke Checkout
          <ArrowRight size={16} />
        </button>
        <button
          type="button"
          onClick={clearCart}
          className="w-full mt-2 py-2 text-xs font-medium text-[#181818]/50 hover:text-red-600 transition-colors"
        >
          Kosongkan keranjang
        </button>
      </div>
    </div>
  );
};

/**
 * Bar keranjang mengambang — muncul di bawah layar saat ada isi keranjang.
 * Tap untuk membuka bottom-sheet berisi daftar pesanan.
 * Di halaman Menu versi desktop, keranjang sudah tampil sebagai panel samping,
 * jadi bar ini disembunyikan di layar lebar (lg ke atas).
 */
const StickyOrderBar = () => {
  const { cartTotal, cartCount } = useOrder();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible = cartCount > 0 && location.pathname !== "/checkout";
  const hideOnDesktop = location.pathname === "/menu" ? "lg:hidden" : "";

  // Tutup sheet otomatis kalau keranjang kosong / pindah halaman
  useEffect(() => {
    if (!isVisible) setIsOpen(false);
  }, [isVisible]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Kunci scroll halaman + tombol Esc saat sheet terbuka
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* ── Bar mengambang (collapsed) ── */}
      <div
        className={`fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none ${hideOnDesktop}`}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              key="pill"
              onClick={() => setIsOpen(true)}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="pointer-events-auto w-full max-w-md flex items-center gap-3 rounded-2xl bg-[#181818] text-white pl-3 pr-4 py-3 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] text-left"
            >
              <span className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#C48259] shrink-0">
                <ShoppingBag size={20} />
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-white text-[#181818] text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </span>

              <span className="flex-1 min-w-0">
                <span className="block text-xs text-white/65 leading-none">
                  Lihat pesanan
                </span>
                <span className="block font-bold text-base leading-tight mt-1 tabular-nums">
                  {formatCurrency(cartTotal)}
                </span>
              </span>

              <ChevronUp size={20} className="shrink-0 text-white/70" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom sheet (expanded) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className={`fixed inset-0 z-[60] bg-[#181818]/50 ${hideOnDesktop}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Pesanan kamu"
              className={`fixed left-0 right-0 bottom-0 z-[70] mx-auto w-full max-w-lg bg-[#FBF8F3] rounded-t-3xl flex flex-col max-h-[85vh] overflow-hidden ${hideOnDesktop}`}
              style={{ boxShadow: "0 -8px 40px -8px rgba(24,24,24,0.3)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#181818] leading-tight">
                    Pesanan Kamu
                  </h3>
                  <p className="text-xs text-[#181818]/55 mt-0.5">
                    {cartCount} porsi dipilih
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup keranjang"
                  className="w-9 h-9 rounded-full bg-black/5 text-[#181818] flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <CartPanel
                onCheckout={handleCheckout}
                className="flex-1 border-t border-black/10"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyOrderBar;

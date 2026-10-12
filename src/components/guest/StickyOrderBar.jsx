import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, ChevronUp } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";

/**
 * Bar keranjang mengambang — muncul di bawah layar saat ada isi keranjang.
 * Desain konsisten dengan tema terracotta/krim halaman Menu.
 * Tap untuk membuka bottom-sheet berisi daftar pesanan + stepper +/−.
 */
const StickyOrderBar = () => {
  const { cartItems, cartTotal, cartCount, incrementQty, decrementQty } =
    useOrder();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible = cartCount > 0 && location.pathname !== "/checkout";

  // Tutup sheet otomatis kalau keranjang kosong / pindah halaman
  useEffect(() => {
    if (!isVisible) setIsOpen(false);
  }, [isVisible]);

  if (!isVisible) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* ── Pill mengambang (collapsed) ── */}
      <div className="fixed bottom-5 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              key="pill"
              layout
              onClick={() => setIsOpen(true)}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="pointer-events-auto relative w-full max-w-sm"
            >
              {/* Black shape (shadow) */}
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-1.5 rounded-full bg-[#181818]"
              />
              {/* Pill utama */}
              <span className="relative flex items-center gap-3 bg-[#C48259] text-white rounded-full pl-2 pr-3 py-2 border-2 border-[#181818] shadow-none">
                {/* Bag icon + badge */}
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#181818] shrink-0">
                  <ShoppingBag size={17} />
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-[#181818] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </span>

                <span className="flex-1 text-left">
                  <span className="block text-[10px] text-white/70 leading-none font-medium">
                    Lihat Keranjang
                  </span>
                  <span className="block font-display font-bold text-base leading-tight">
                    {formatCurrency(cartTotal)}
                  </span>
                </span>

                <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-white/20">
                  <ChevronUp size={16} />
                </span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom sheet (expanded) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-[#181818]/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              className="fixed left-0 right-0 bottom-0 z-[70] mx-auto w-full max-w-lg bg-[#FBF3E7] rounded-t-[2rem] flex flex-col max-h-[82vh]"
              style={{ boxShadow: "0 -8px 40px -8px rgba(24,24,24,0.25)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              {/* Drag indicator */}
              <div className="flex items-center justify-center pt-3 pb-1">
                <span className="w-10 h-1.5 rounded-full bg-[#181818]/20" />
              </div>

              {/* Header sheet */}
              <div className="flex items-center justify-between px-6 pt-2 pb-4">
                <h3 className="font-display display-bold text-[#181818] text-xl">
                  Keranjang Kamu
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup keranjang"
                  className="w-8 h-8 rounded-full bg-[#181818]/8 text-[#181818] flex items-center justify-center hover:bg-[#181818]/15 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* List item */}
              <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-2">
                {cartItems.map((item) => (
                  <div
                    key={item.uid}
                    className="flex items-center gap-3 bg-white rounded-2xl p-3"
                  >
                    {/* Thumbnail */}
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FBF3E7] shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag size={18} className="text-[#C48259]" />
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#181818] text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-[#C48259] font-semibold text-xs">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-[#FBF3E7] rounded-full p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => decrementQty(item.menuId)}
                        aria-label={`Kurangi ${item.name}`}
                        className="w-7 h-7 rounded-full bg-white text-[#181818] flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>
                      <span className="w-5 text-center font-bold text-[#181818] text-sm">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQty(item.menuId)}
                        aria-label={`Tambah ${item.name}`}
                        className="w-7 h-7 rounded-full bg-[#C48259] text-white flex items-center justify-center transition-transform active:scale-90"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer checkout */}
              <div className="px-6 pt-4 pb-7 mt-1 border-t border-[#181818]/8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#181818]/60 font-medium">
                    Total Pembayaran
                  </span>
                  <span className="font-display display-bold text-xl text-[#181818]">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                {/* Checkout button dengan black shape */}
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-1.5 rounded-full bg-[#181818]"
                  />
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="relative w-full flex items-center justify-center gap-2 bg-[#C48259] text-white font-bold rounded-full py-3.5 border-2 border-[#181818] transition-transform active:translate-y-1"
                  >
                    Checkout Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyOrderBar;

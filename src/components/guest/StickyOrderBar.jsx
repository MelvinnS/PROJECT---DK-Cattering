import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, X, ChevronUp } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";
import Button from "../common/Button";

/**
 * Bar keranjang mengambang bergaya iOS — muncul ringkas di atas layar begitu
 * ada isi keranjang, tanpa menempel penuh ke tepi bawah. Tap untuk membuka
 * lembar keranjang (bottom sheet) berisi daftar item dengan stepper +/-,
 * persis pola "keranjang" pada aplikasi pesan-antar makanan.
 */
const StickyOrderBar = () => {
  const { cartItems, cartTotal, cartCount, incrementQty, decrementQty } =
    useOrder();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible = cartCount > 0 && location.pathname !== "/checkout";

  // Tutup lembar otomatis kalau keranjang jadi kosong atau pindah halaman.
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
      {/* Bar mengambang (collapsed state) */}
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <motion.button
          type="button"
          layout
          onClick={() => setIsOpen(true)}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="pointer-events-auto w-full max-w-md flex items-center gap-3 bg-coffee-800/95 backdrop-blur-md text-cream-50 rounded-full shadow-[0_16px_40px_-12px_rgba(28,22,15,0.55)] pl-3 pr-2 py-2"
        >
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-accent-600 shrink-0">
            <ShoppingBag size={17} />
            <span className="absolute -top-1.5 -right-1.5 bg-cream-50 text-coffee-800 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="block text-[11px] text-cream-50/60 leading-none">
              Lihat Keranjang
            </span>
            <span className="block font-bold leading-tight truncate">
              {formatCurrency(cartTotal)}
            </span>
          </span>
          <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-cream-50/10">
            <ChevronUp size={16} />
          </span>
        </motion.button>
      </div>

      {/* Lembar keranjang (expanded state) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-coffee-900/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="sheet"
              className="fixed left-0 right-0 bottom-0 z-[70] mx-auto w-full max-w-lg bg-cream-50 rounded-t-[1.75rem] shadow-[0_-20px_50px_-12px_rgba(28,22,15,0.45)] flex flex-col max-h-[80vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-center pt-3">
                <span className="w-10 h-1.5 rounded-full bg-coffee-200" />
              </div>

              <div className="flex items-center justify-between px-6 pt-3 pb-4">
                <h3 className="font-bold text-coffee-800 text-lg">
                  Keranjang Kamu
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup keranjang"
                  className="w-8 h-8 rounded-full bg-coffee-100/70 text-coffee-600 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-4 pb-2">
                {cartItems.map((item) => (
                  <div key={item.uid} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white text-accent-600 shrink-0 shadow-sm">
                      <ShoppingBag size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-coffee-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-coffee-500/80">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white rounded-full p-1 shrink-0 shadow-sm">
                      <button
                        type="button"
                        onClick={() => decrementQty(item.menuId)}
                        aria-label={`Kurangi ${item.name}`}
                        className="w-7 h-7 rounded-full bg-cream-100 text-coffee-700 flex items-center justify-center transition-transform active:scale-90"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-4 text-center font-semibold text-coffee-800 text-sm">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQty(item.menuId)}
                        aria-label={`Tambah ${item.name}`}
                        className="w-7 h-7 rounded-full bg-accent-600 text-cream-50 flex items-center justify-center transition-transform active:scale-90"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 pt-4 pb-6 mt-2 border-t border-coffee-100 bg-cream-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-coffee-500/80">
                    Total Pembayaran
                  </span>
                  <span className="font-extrabold text-lg text-coffee-800">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <Button variant="primary" className="w-full" onClick={handleCheckout}>
                  Checkout Sekarang
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyOrderBar;

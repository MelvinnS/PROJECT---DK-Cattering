import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

const quickReasons = [
  "Bahan baku untuk menu habis",
  "Slot pengiriman waktu tersebut sudah penuh",
  "Alamat pengantaran di luar area jangkauan",
  "Permintaan pembatalan langsung dari pelanggan",
];

/**
 * Modal penolakan pesanan.
 * Sesuai requirement: Wajib mengisi alasan penolakan.
 * Mendukung penolakan 1 pesanan ataupun banyak pesanan (batch).
 */
const RejectOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  orderIds = [],
  customerName,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isBatch = orderIds.length > 0;
  const count = isBatch ? orderIds.length : 1;

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    if (isBatch) {
      onConfirm(orderIds, reason.trim());
    } else {
      onConfirm(orderId, reason.trim());
    }
    handleClose();
  };

  const handleSelectQuickReason = (text) => {
    setReason(text);
    setError("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-coffee-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-coffee-100 z-10"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-coffee-100/60">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertCircle size={20} />
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-coffee-800">
                  {isBatch ? `Tolak ${count} Pesanan` : "Tolak Pesanan"}
                </h3>
                <p className="text-xs text-coffee-500/80 mt-0.5">
                  {isBatch
                    ? `${count} pesanan akan dibatalkan`
                    : `#${orderId}${customerName ? ` • ${customerName}` : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-coffee-400 hover:text-coffee-700 hover:bg-coffee-50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-coffee-700 uppercase tracking-wider mb-2">
                Alasan Penolakan <span className="text-red-500">* (Wajib)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                placeholder="Tuliskan alasan penolakan pesanan ini..."
                className={`w-full rounded-xl p-3 text-sm text-coffee-800 bg-cream-50/70 border outline-none transition-colors ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                    : "border-coffee-200/80 focus:border-coffee-500 focus:bg-white"
                }`}
              />
              {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
            </div>

            {/* Rekomendasi alasan cepat */}
            <div>
              <p className="text-xs font-semibold text-coffee-500/80 mb-2">
                Pilihan Cepat:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickReasons.map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => handleSelectQuickReason(q)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-coffee-200/80 text-coffee-600 bg-cream-50/40 hover:bg-cream-100 hover:text-coffee-800 transition-colors text-left"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-coffee-100/60">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-full text-sm font-semibold text-coffee-600 hover:bg-coffee-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-[0_8px_20px_-6px_rgba(220,38,38,0.4)] transition-all active:scale-[0.98]"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RejectOrderModal;

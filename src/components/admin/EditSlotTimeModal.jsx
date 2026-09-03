import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles } from "lucide-react";

/**
 * Popup Modal untuk Ubah Jam Pengiriman.
 * Dirancang simpel, bersih, dan tidak membingungkan bagi pemilik catering.
 */
const EditSlotTimeModalContent = ({ onClose, slot, onSave }) => {
  const [startTime, setStartTime] = useState(slot?.startTime || "");
  const [endTime, setEndTime] = useState(slot?.endTime || "");
  const [error, setError] = useState("");

  const handlePresetClick = (preset) => {
    setStartTime(preset.start);
    setEndTime(preset.end);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime.trim() || !endTime.trim()) {
      setError("Jam mulai dan jam selesai wajib diisi.");
      return;
    }

    onSave(slot.id, startTime.trim(), endTime.trim());
    onClose();
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
          onClick={onClose}
          className="fixed inset-0 bg-coffee-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-coffee-100 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-coffee-100/60">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cream-100 text-coffee-800">
                <Clock size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-coffee-800">
                  Ubah Jam {slot.name}
                </h3>
                <p className="text-xs text-coffee-400">
                  Atur rentang waktu operasional pengiriman
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-coffee-400 hover:text-coffee-700 hover:bg-coffee-50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            {/* Input Jam Mulai & Selesai */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-coffee-700 uppercase tracking-wider mb-1.5">
                  Jam Mulai
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="06.00"
                  className="w-full text-center font-bold text-base text-coffee-800 rounded-xl p-3 bg-cream-50/70 border border-coffee-200 focus:border-coffee-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-700 uppercase tracking-wider mb-1.5">
                  Jam Selesai
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="08.00"
                  className="w-full text-center font-bold text-base text-coffee-800 rounded-xl p-3 bg-cream-50/70 border border-coffee-200 focus:border-coffee-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium -mt-1">{error}</p>
            )}

            {/* Quick Presets */}
            {slot.presets && slot.presets.length > 0 && (
              <div className="bg-cream-50/60 p-3 rounded-xl border border-coffee-100/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-coffee-600 mb-2">
                  <Sparkles size={13} className="text-accent-600" />
                  Pilihan Jam Cepat:
                </div>
                <div className="flex flex-wrap gap-2">
                  {slot.presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(p)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        startTime === p.start && endTime === p.end
                          ? "bg-coffee-800 text-cream-50 border-coffee-800"
                          : "bg-white text-coffee-700 border-coffee-200 hover:bg-cream-100"
                      }`}
                    >
                      {p.start} – {p.end}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-3 pt-4 border-t border-coffee-100/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-sm font-semibold text-coffee-600 hover:bg-coffee-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-coffee-800 hover:bg-coffee-900 text-cream-50 shadow-md transition-all active:scale-[0.98]"
              >
                Simpan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const EditSlotTimeModal = ({ isOpen, onClose, slot, onSave }) => {
  if (!isOpen || !slot) return null;

  return (
    <EditSlotTimeModalContent
      key={slot.id}
      slot={slot}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default EditSlotTimeModal;

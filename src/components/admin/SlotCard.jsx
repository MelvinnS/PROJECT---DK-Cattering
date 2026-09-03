import { Calendar, Sunrise, Sun, CloudSun } from "lucide-react";

/**
 * Komponen Kartu Slot Pengiriman (PAGI, SIANG, SORE).
 * Meniru secara presisi desain visual referensi:
 * - Ikon sesi dalam kotak warna lembut
 * - Status dot hijau (Aktif) / abu-abu (Tidak Aktif)
 * - Switch Pill ON/OFF interaktif
 * - Tombol Ubah Jam outline
 */
const SlotCard = ({ slot, onToggle, onEditTime }) => {
  // Render custom session icon based on type
  const renderIcon = () => {
    switch (slot.type) {
      case "pagi":
        return (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFF3E5] flex items-center justify-center text-[#E67E22] shrink-0">
            {/* Sunrise illustration */}
            <Sunrise size={32} strokeWidth={2.2} />
          </div>
        );
      case "siang":
        return (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFF9E6] flex items-center justify-center text-[#F39C12] shrink-0">
            {/* Bright Sun illustration */}
            <Sun size={32} strokeWidth={2.2} />
          </div>
        );
      case "sore":
        return (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EBF3FC] flex items-center justify-center text-[#3498DB] shrink-0">
            {/* Sun behind cloud illustration */}
            <CloudSun size={32} strokeWidth={2.2} />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cream-100 flex items-center justify-center text-coffee-700 shrink-0">
            <Sun size={32} />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/90 shadow-[0_10px_30px_-15px_rgba(42,33,24,0.12)] p-4 sm:p-6 flex items-center justify-between gap-4 transition-all">
      {/* Bagian Kiri: Ikon + Info Sesi */}
      <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
        {renderIcon()}

        <div className="flex flex-col min-w-0">
          <h3 className="font-black text-base sm:text-lg text-coffee-800 tracking-wide uppercase">
            {slot.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-coffee-600 mt-0.5">
            {slot.startTime} – {slot.endTime}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                slot.isActive ? "bg-[#1E7E34]" : "bg-[#9C9388]"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                slot.isActive ? "text-coffee-800 font-semibold" : "text-coffee-400"
              }`}
            >
              {slot.isActive ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Toggle Switch & Tombol Ubah Jam */}
      <div className="flex flex-col items-end gap-2.5 sm:gap-3 shrink-0">
        {/* Custom Pill Switch ON / OFF */}
        <button
          type="button"
          role="switch"
          aria-checked={slot.isActive}
          onClick={() => onToggle(slot.id)}
          className={`relative inline-flex items-center w-16 h-8 sm:w-[70px] sm:h-[34px] rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none select-none ${
            slot.isActive ? "bg-[#1E7E34]" : "bg-[#A3998E]"
          }`}
        >
          {/* Label Teks ON / OFF di dalam switch */}
          <span
            className={`absolute text-[11px] font-extrabold tracking-wider transition-opacity duration-200 text-white ${
              slot.isActive
                ? "left-2.5 opacity-100"
                : "right-2.5 opacity-100"
            }`}
          >
            {slot.isActive ? "ON" : "OFF"}
          </span>

          {/* Knob Bulat Putih */}
          <span
            className={`inline-block w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
              slot.isActive
                ? "translate-x-8 sm:translate-x-9"
                : "translate-x-0"
            }`}
          />
        </button>

        {/* Tombol Ubah Jam */}
        <button
          type="button"
          onClick={() => onEditTime(slot)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full border border-coffee-200/90 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-800 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
        >
          <Calendar size={14} className="text-coffee-600" />
          <span>Ubah Jam</span>
        </button>
      </div>
    </div>
  );
};

export default SlotCard;

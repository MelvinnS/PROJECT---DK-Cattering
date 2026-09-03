import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2 } from "lucide-react";
import { useSlots } from "../../context/SlotContext";
import SlotCard from "../../components/admin/SlotCard";
import EditSlotTimeModal from "../../components/admin/EditSlotTimeModal";

const AdminSlotsPage = () => {
  const {
    slots,
    formattedSelectedDate,
    nextDate,
    prevDate,
    toggleSlotActive,
    updateSlotTime,
  } = useSlots();

  const [editingSlot, setEditingSlot] = useState(null);

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
  };

  const handleCloseEdit = () => {
    setEditingSlot(null);
  };

  const handleSaveSlotTime = (slotId, startTime, endTime) => {
    updateSlotTime(slotId, startTime, endTime);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-4xl mx-auto">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-coffee-800">
          Jadwal Pengiriman
        </h1>
        <p className="text-coffee-500/80 mt-1 text-sm sm:text-base">
          Atur waktu pengiriman yang tersedia untuk customer.
        </p>
      </div>

      {/* Date Selector Bar */}
      <div className="flex items-center justify-center my-1 sm:my-2">
        <div className="inline-flex items-center justify-between w-full max-w-md bg-white rounded-2xl md:rounded-3xl border border-coffee-100/90 shadow-[0_8px_25px_-12px_rgba(42,33,24,0.12)] px-3 py-2.5 sm:px-5 sm:py-3">
          <button
            type="button"
            onClick={prevDate}
            aria-label="Hari Sebelumnya"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-cream-100/80 text-coffee-700 transition-colors active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 font-bold text-xs sm:text-sm text-coffee-800 select-none">
            <Calendar size={18} className="text-coffee-600 shrink-0" />
            <span>{formattedSelectedDate}</span>
          </div>

          <button
            type="button"
            onClick={nextDate}
            aria-label="Hari Berikutnya"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-cream-100/80 text-coffee-700 transition-colors active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 3 Slot Cards: PAGI, SIANG, SORE */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            onToggle={toggleSlotActive}
            onEditTime={handleOpenEdit}
          />
        ))}
      </div>

      {/* Banner Informasi Bawah */}
      <div className="bg-[#EBF7EE] border border-[#C6E7CE] rounded-2xl md:rounded-3xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 text-[#1E7E34] mt-2">
        <div className="w-8 h-8 rounded-full bg-[#1E7E34] text-white flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex flex-col text-xs sm:text-sm leading-relaxed">
          <p className="font-extrabold text-[#19692C]">
            Jadwal pengiriman otomatis terupdate.
          </p>
          <p className="text-[#2D7A3E]">
            Customer hanya akan melihat sesi yang aktif saat checkout.
          </p>
        </div>
      </div>

      {/* Popup Modal Ubah Jam (Simpel, Bersih, Tanpa Halaman Baru) */}
      <EditSlotTimeModal
        isOpen={Boolean(editingSlot)}
        slot={editingSlot}
        onClose={handleCloseEdit}
        onSave={handleSaveSlotTime}
      />
    </div>
  );
};

export default AdminSlotsPage;

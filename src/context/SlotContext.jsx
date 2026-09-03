import { createContext, useContext, useState } from "react";
import { initialSlots } from "../data/slotDummyData";

const SlotContext = createContext(undefined);

export const SlotProvider = ({ children }) => {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default: hari ini atau tanggal default yang diformat
    const now = new Date();
    return now;
  });

  // Toggle status aktif slot (ON/OFF)
  const toggleSlotActive = (slotId) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
      )
    );
  };

  // Update rentang waktu slot
  const updateSlotTime = (slotId, startTime, endTime) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, startTime, endTime } : slot
      )
    );
  };

  // Navigasi tanggal: Prev & Next Day
  const nextDate = () => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const prevDate = () => {
    setSelectedDate((prev) => {
      const p = new Date(prev);
      p.setDate(p.getDate() - 1);
      return p;
    });
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const value = {
    slots,
    selectedDate,
    formattedSelectedDate,
    setSelectedDate,
    nextDate,
    prevDate,
    toggleSlotActive,
    updateSlotTime,
  };

  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
};

export const useSlots = () => {
  const context = useContext(SlotContext);
  if (!context) {
    throw new Error("useSlots must be used within a SlotProvider");
  }
  return context;
};

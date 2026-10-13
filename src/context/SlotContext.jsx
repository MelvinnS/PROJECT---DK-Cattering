import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getSlots,
  createSlot as apiCreateSlot,
  updateSlot as apiUpdateSlot,
  deleteSlot as apiDeleteSlot,
} from "../services/adminSlotService";

const SlotContext = createContext(undefined);

export const SlotProvider = ({ children }) => {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Muat semua slot dari BE
  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSlots();
      const items = Array.isArray(result) ? result : result?.data ?? [];
      setSlots(items);
    } catch (err) {
      console.error("Gagal memuat slot:", err);
      setError(err.message ?? "Gagal memuat slot");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Toggle isActive slot via PATCH ke BE
  const toggleSlotActive = async (slotId) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;
    const updated = await apiUpdateSlot(slotId, { isActive: !slot.isActive });
    setSlots((prev) => prev.map((s) => (s.id === slotId ? updated : s)));
  };

  // Update waktu slot
  const updateSlotTime = async (slotId, startTime, endTime) => {
    const updated = await apiUpdateSlot(slotId, { startTime, endTime });
    setSlots((prev) => prev.map((s) => (s.id === slotId ? updated : s)));
  };

  // Tambah slot baru
  const addSlot = async (payload) => {
    const newSlot = await apiCreateSlot(payload);
    setSlots((prev) => [...prev, newSlot]);
    return newSlot;
  };

  // Hapus slot
  const removeSlot = async (slotId) => {
    await apiDeleteSlot(slotId);
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  // Navigasi tanggal
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
    isLoading,
    error,
    selectedDate,
    formattedSelectedDate,
    setSelectedDate,
    nextDate,
    prevDate,
    fetchSlots,
    toggleSlotActive,
    updateSlotTime,
    addSlot,
    removeSlot,
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

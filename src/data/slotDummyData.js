// DATA DUMMY JADWAL PENGIRIMAN (SLOTS)
// Struktur data untuk manajemen slot waktu pengiriman harian

export const initialSlots = [
  {
    id: "pagi",
    name: "PAGI",
    startTime: "06.00",
    endTime: "08.00",
    isActive: true,
    type: "pagi",
    iconType: "sunrise",
    bgColor: "bg-[#FFF3E5]", // soft orange/peach
    iconColor: "text-[#E67E22]",
    presets: [
      { start: "06.00", end: "08.00" },
      { start: "07.00", end: "09.00" },
      { start: "08.00", end: "10.00" },
    ],
  },
  {
    id: "siang",
    name: "SIANG",
    startTime: "12.00",
    endTime: "14.00",
    isActive: true,
    type: "siang",
    iconType: "sun",
    bgColor: "bg-[#FFF9E6]", // soft yellow
    iconColor: "text-[#F39C12]",
    presets: [
      { start: "11.00", end: "13.00" },
      { start: "12.00", end: "14.00" },
      { start: "13.00", end: "15.00" },
    ],
  },
  {
    id: "sore",
    name: "SORE",
    startTime: "15.00",
    endTime: "17.00",
    isActive: false,
    type: "sore",
    iconType: "sunset",
    bgColor: "bg-[#EBF3FC]", // soft blue/cloud
    iconColor: "text-[#3498DB]",
    presets: [
      { start: "15.00", end: "17.00" },
      { start: "16.00", end: "18.00" },
      { start: "17.00", end: "19.00" },
    ],
  },
];

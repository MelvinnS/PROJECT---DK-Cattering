// DATA DUMMY — pesanan awal (seed) supaya halaman Pesanan & Riwayat tidak
// kosong saat development, sebelum backend order/payment beneran tersambung.
// Format status disamakan dengan yang nanti dipakai backend.

export const orderStatusColor = {
  "Menunggu Konfirmasi": "bg-amber-100 text-amber-700",
  Diproses: "bg-blue-100 text-blue-700",
  Diantar: "bg-purple-100 text-purple-700",
  Selesai: "bg-green-100 text-green-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

// Status yang masih dianggap "berjalan" -> tampil di halaman Pesanan.
export const ACTIVE_STATUSES = ["Menunggu Konfirmasi", "Diproses", "Diantar"];
// Status yang sudah final -> tampil di halaman Riwayat.
export const FINAL_STATUSES = ["Selesai", "Dibatalkan"];

export const seedOrders = [
  {
    id: "ORD-2026-0142",
    date: "2026-08-28",
    items: [{ name: "Nasi Ayam Katsu", qty: 2, price: 18000 }],
    total: 36000,
    status: "Selesai",
  },
  {
    id: "ORD-2026-0139",
    date: "2026-08-25",
    items: [{ name: "Nasi Yakiniku", qty: 1, price: 20000 }],
    total: 20000,
    status: "Diantar",
  },
  {
    id: "ORD-2026-0135",
    date: "2026-08-22",
    items: [
      { name: "Nasi Chicken Karaage", qty: 1, price: 18000 },
      { name: "Nasi Ayam Katsu", qty: 1, price: 18000 },
    ],
    total: 36000,
    status: "Menunggu Konfirmasi",
  },
];

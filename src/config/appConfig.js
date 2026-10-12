// Saklar utama koneksi backend.
//
// true  (default) -> backend DIPUTUS: semua halaman bisa dibuka tanpa login,
//                    data memakai mock/dummy, dan role bisa dipindah
//                    Customer <-> Admin lewat menu akun di Navbar.
// false           -> kembali memakai backend NestJS asli (login sungguhan).
//
// Cara mengganti: set VITE_USE_MOCK_BACKEND=false di file .env
export const USE_MOCK_BACKEND =
  import.meta.env.VITE_USE_MOCK_BACKEND !== "false";

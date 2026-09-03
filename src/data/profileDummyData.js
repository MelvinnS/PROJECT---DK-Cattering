// DATA DUMMY — backend saat ini belum punya endpoint untuk update profil
// (no. HP & alamat tidak dikembalikan saat login/register). Jadi field-field
// ini disimpan lokal dulu di ProfilePage, murni untuk keperluan tampilan.
// Nanti kalau backend sudah punya endpoint profil, ganti dengan data asli
// + panggilan API (pola yang sama seperti authService.js).

export const dummyProfileExtra = {
  phone: "0812-3456-7890",
  address: "Jl. Soekarno Hatta No. 12, Malang, Jawa Timur",
};

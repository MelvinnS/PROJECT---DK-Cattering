// Konfigurasi umum bisnis — ubah di sini untuk update ke seluruh website.

export const siteConfig = {
  brandName: "DK",
  brandNameSecondary: "CATTERING",
  brandFullName: "DK Cattering",
  tagline: "Makan enak, praktis dan higienis setiap hari untukmu.",
  whatsappNumber: "6282231258463", // format internasional tanpa '+' dan tanpa spasi/strip
  whatsappDisplay: "+62 822-3125-8463",
  location: "Malang, Jawa Timur",
  address: "Jl. Soekarno Hatta No. 12, Malang, Jawa Timur",
  email: "halo@dkcattering.id",
  openingHours: [
    { days: "Senin – Jumat", time: "07.00 – 20.00 WIB" },
    { days: "Sabtu – Minggu", time: "08.00 – 18.00 WIB" },
  ],
};

export const getWhatsappLink = (message = "") => {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export default siteConfig;

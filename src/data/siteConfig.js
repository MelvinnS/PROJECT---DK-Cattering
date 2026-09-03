// Konfigurasi umum bisnis — ubah di sini untuk update ke seluruh website.

export const siteConfig = {
  brandName: "DK",
  brandNameSecondary: "CATTERING",
  brandFullName: "DK Cattering",
  tagline: "Makan enak, praktis dan higienis setiap hari untukmu.",
  whatsappNumber: "6282231258463", // format internasional tanpa '+' dan tanpa spasi/strip
  whatsappDisplay: "+62 822-3125-8463",
  location: "Malang, Jawa Timur",
};

export const getWhatsappLink = (message = "") => {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export default siteConfig;

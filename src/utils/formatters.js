/**
 * Format angka menjadi format Rupiah, contoh: 18000 -> "Rp18.000"
 */
export const formatCurrency = (amount) =>
  `Rp${Number(amount).toLocaleString("id-ID")}`;

/**
 * Potong teks panjang dan tambahkan "..." jika melebihi batas.
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

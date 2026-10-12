// Data halaman utama (Beranda). Ubah teks/foto/warna di sini — tidak perlu
// menyentuh komponen. Foto memakai aset lokal di src/assets/images.
import menu1 from "../assets/images/menu1.jpg";
import menu2 from "../assets/images/menu2.jpg";
import menu3 from "../assets/images/menu3.jpg";
import menu4 from "../assets/images/menu4.jpg";

// id/nama/harga sengaja sama dengan data keranjang yang sudah ada.
// bg = warna latar hero untuk menu tersebut (berganti halus saat slide).
export const landingMenus = [
  {
    id: 1,
    name: "Nasi Ayam Katsu",
    price: 18000,
    image: menu1,
    tagline: "Ayam katsu renyah dengan saus spesial",
    bg: { light: "#CC7D59", dark: "#A8553A" },
  },
  {
    id: 2,
    name: "Nasi Ayam Crispy",
    price: 17000,
    image: menu2,
    tagline: "Ayam crispy gurih dengan sambal racikan",
    bg: { light: "#62B27D", dark: "#3E8458" },
  },
  {
    id: 3,
    name: "Nasi Ayam Bakar",
    price: 19000,
    image: menu3,
    tagline: "Ayam bakar bumbu meresap, lalapan segar",
    bg: { light: "#EE7F5E", dark: "#D1563A" },
  },
  {
    id: 4,
    name: "Nasi Beef Teriyaki",
    price: 20000,
    image: menu4,
    tagline: "Potongan juicy dengan saus teriyaki homemade",
    bg: { light: "#D69C70", dark: "#B97A52" },
  },
];

export const heroCopy = {
  titleLine1: "Rasa Bahagia",
  titleLine2: "Di Setiap Suapan",
  description:
    "Catering harian dengan menu pilihan dan bahan segar berkualitas, dimasak setiap hari dan diantar sesuai jadwal pilihanmu.",
  reviewsTitle: "10K+ Ulasan",
  reviewsSubtitle: "Pelanggan puas dengan layanan kami",
  portions: ["S", "M", "L"],
};

export const quoteText =
  "Kami percaya pada kehangatan masakan rumah di setiap suapan. Menu kami dimasak segar setiap hari dari bahan pilihan dan bumbu racikan sendiri.";

export const menuSectionCopy = {
  title: "Jelajahi Menu\nLezat Kami",
  description:
    "Setiap porsi adalah perayaan rasa. Dimasak dengan cinta, bahan segar, dan bumbu yang meresap sempurna.",
};

export const faqCopy = {
  title: "FAQ's",
  description:
    "Kami rangkum pertanyaan yang paling sering ditanyakan supaya pengalaman pesanmu semulus mungkin.",
  items: [
    {
      emoji: "🍱",
      question: "Apa yang membuat catering kami berbeda?",
      answer:
        "Kami hanya memakai bahan segar pilihan tanpa pengawet buatan. Setiap porsi dimasak dalam jumlah terbatas setiap hari agar kualitas rasa tetap terjaga.",
    },
    {
      emoji: "🚚",
      question: "Apakah tersedia antar ke rumah atau kantor?",
      answer:
        "Ya! Pesanan diantar sesuai jadwal pengiriman yang kamu pilih saat checkout, khusus area Malang dan sekitarnya.",
    },
    {
      emoji: "🌶️",
      question: "Bisa request tanpa pedas atau tanpa bahan tertentu?",
      answer:
        "Bisa. Tulis catatan pada pesananmu dan tim kami akan menyesuaikan sebisa mungkin.",
    },
    {
      emoji: "📦",
      question: "Bisa pesan dalam jumlah besar untuk acara?",
      answer:
        "Tentu. Hubungi admin lewat WhatsApp untuk pesanan acara, arisan, atau kantor — kami siapkan penawaran khusus.",
    },
  ],
};

export const testimonialCopy = {
  title: "Apa Kata Pelanggan",
  description: "Cerita nyata dari orang-orang yang selalu ketagihan masakan kami.",
  items: [
    {
      name: "Aisha Khan",
      role: "Karyawan Swasta",
      text: "Langganan tiap hari kerja dan rasanya konsisten enak. Porsi pas, pengantaran selalu tepat waktu. Makan siang jadi hal yang paling ditunggu.",
    },
    {
      name: "Budi Santoso",
      role: "Mahasiswa",
      text: "Harganya ramah di kantong tapi rasanya tidak murahan. Nasi Ayam Katsu-nya juara, ayamnya selalu renyah walau sudah sampai.",
    },
    {
      name: "Dita Rahmawati",
      role: "Ibu Rumah Tangga",
      text: "Praktis banget buat keluarga. Bisa atur jadwal antar sendiri dan menunya bervariasi, anak-anak pun lahap makannya.",
    },
    {
      name: "Andi Prasetyo",
      role: "Owner Kantor Kecil",
      text: "Kami pesan untuk seluruh tim tiap minggu. Adminnya responsif dan semua pesanan selalu rapi. Sangat direkomendasikan.",
    },
    {
      name: "Sri Wulandari",
      role: "Guru",
      text: "Bahan terasa segar dan higienis. Sambalnya bikin nagih! Terima kasih sudah bikin hari-hari saya lebih mudah.",
    },
  ],
};

// Data halaman utama (Beranda).
// Menggunakan foto makanan dari assets lokal (menu1.jpg - menu4.jpg).
import menu1 from "../assets/images/menu1.jpg";
import menu2 from "../assets/images/menu2.jpg";
import menu3 from "../assets/images/menu3.jpg";
import menu4 from "../assets/images/menu4.jpg";

export const landingMenus = [
  {
    id: 1,
    name: "Nasi Ayam Katsu Renyah",
    title: "Nasi Ayam Katsu",
    price: "Rp 18.000",
    priceValue: 18000,
    image: menu1,
    tagline: "Ayam katsu renyah dengan saus spesial",
    bg: { light: "#C48259", dark: "#A6633E" },
  },
  {
    id: 2,
    name: "Nasi Ayam Crispy Gurih",
    title: "Nasi Ayam Crispy",
    price: "Rp 17.000",
    priceValue: 17000,
    image: menu2,
    tagline: "Ayam crispy gurih dengan sambal racikan",
    bg: { light: "#C48259", dark: "#A6633E" },
  },
  {
    id: 3,
    name: "Nasi Ayam Bakar Bumbu",
    title: "Nasi Ayam Bakar",
    price: "Rp 19.000",
    priceValue: 19000,
    image: menu3,
    tagline: "Ayam bakar bumbu meresap lalapan segar",
    bg: { light: "#C48259", dark: "#A6633E" },
  },
  {
    id: 4,
    name: "Nasi Beef Teriyaki Spesial",
    title: "Nasi Beef Teriyaki",
    price: "Rp 20.000",
    priceValue: 20000,
    image: menu4,
    tagline: "Potongan juicy dengan saus teriyaki",
    bg: { light: "#C48259", dark: "#A6633E" },
  },
];

export const heroCopy = {
  titleLine1: "Taste Joy in",
  titleLine2: "Every Bite",
  description:
    "Catering harian dengan menu pilihan dan bahan segar berkualitas, dimasak setiap hari dan diantar sesuai jadwal pilihanmu.",
  reviewsTitle: "10K+ Reviews",
  reviewsSubtitle: "Customers are satisfied",
};

export const quoteCopy = {
  quote: "“Psikolog itu mahal, jadi saya duduk di kursi indomart sambil makan Orastrix, beban hidup hilang.”",
  highlight: "Orastrix",
  author: "ISAAC NEWTON",
};

export const menuSectionCopy = {
  title: "Explore Our\nDelicious Taste",
  description:
    "Setiap porsi adalah perayaan rasa. Dimasak dengan cinta, bahan segar, dan bumbu yang meresap sempurna.",
};

export const faqCopy = {
  title: "FAQ's",
  description:
    "We've answered the most common questions to make your experience as smooth as our ice cream.",
  items: [
    {
      emoji: "🍨",
      question: "What makes your ice cream different?",
      answer:
        "Kami hanya memakai bahan segar pilihan tanpa pengawet buatan. Setiap porsi dimasak dalam jumlah terbatas setiap hari agar kualitas rasa tetap terjaga.",
    },
    {
      emoji: "🛺",
      question: "Do you offer home delivery?",
      answer:
        "Ya! Pesanan diantar langsung ke rumah atau kantor sesuai jadwal pengiriman yang kamu tentukan saat checkout.",
    },
    {
      emoji: "🌱",
      question: "Is your ice cream vegan or dairy-free?",
      answer:
        "Tersedia varian pilihan ramah nabati dengan bahan nabati berkualitas tanpa mengurangi kelezatan rasa.",
    },
    {
      emoji: "📦",
      question: "Can I order in bulk for events/parties?",
      answer:
        "Tentu saja! Hubungi admin lewat WhatsApp untuk pesanan acara, arisan, atau pesta keluarga dengan penawaran khusus.",
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

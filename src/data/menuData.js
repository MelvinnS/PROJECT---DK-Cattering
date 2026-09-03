// Mock data untuk menu catering.
// Nantinya bisa diganti dengan data dari API/backend.

const menuData = [
  {
    id: 1,
    name: "Nasi Ayam Katsu",
    price: 18000,
    description: "Ayam katsu crispy dengan saus spesial.",
    image:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=800&q=80",
    category: "Menu Harian",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Nasi Yakiniku",
    price: 20000,
    description: "Daging sapi yakiniku dengan saus manis gurih khas Jepang.",
    image:
      "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=800&q=80",
    category: "Menu Harian",
    isFeatured: false,
  },
  {
    id: 3,
    name: "Nasi Chicken Teriyaki",
    price: 19000,
    description: "Ayam teriyaki juicy disiram saus teriyaki homemade.",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80",
    category: "Menu Harian",
    isFeatured: false,
  },
  {
    id: 4,
    name: "Nasi Chicken Karaage",
    price: 18000,
    description: "Karaage renyah dengan sayuran segar dan saus mayo pedas.",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
    category: "Menu Harian",
    isFeatured: false,
  },
];

export const getFeaturedMenu = () =>
  menuData.find((menu) => menu.isFeatured) || menuData[0];

export const formatPrice = (price) =>
  `Rp${price.toLocaleString("id-ID")}`;

export default menuData;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Plus,
  Heart,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";

import menu1 from "../../assets/images/menu1.jpg";
import menu2 from "../../assets/images/menu2.jpg";
import menu3 from "../../assets/images/menu3.jpg";
import menu4 from "../../assets/images/menu4.jpg";

const FEATURED_MENUS = [
  {
    id: 1,
    name: "Nasi Ayam Katsu",
    price: 18000,
    image: menu1,
    rating: 4.8,
    reviewsCount: 120,
    isPopular: true,
  },
  {
    id: 2,
    name: "Nasi Ayam Crispy",
    price: 17000,
    image: menu2,
    rating: 4.7,
    reviewsCount: 89,
    isPopular: false,
  },
  {
    id: 3,
    name: "Nasi Ayam Bakar",
    price: 19000,
    image: menu3,
    rating: 4.9,
    reviewsCount: 76,
    isPopular: true,
  },
  {
    id: 4,
    name: "Nasi Beef Teriyaki",
    price: 20000,
    image: menu4,
    rating: 4.8,
    reviewsCount: 95,
    isPopular: false,
  },
];

const FeaturedMenuSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useOrder();

  const [activeDot, setActiveDot] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [addedIds, setAddedIds] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (menu, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    addToCart(menu);
    setAddedIds((prev) => ({ ...prev, [menu.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [menu.id]: false }));
    }, 1200);
  };

  const handlePrev = () => {
    setActiveDot((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const handleNext = () => {
    setActiveDot((prev) => (prev === 3 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#FAF4EA] py-14 md:py-20" aria-label="Menu Hari Ini">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* ── Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#C17F45] uppercase block mb-1.5">
              Menu Hari Ini
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#2A2118] tracking-tight">
              Pilihan Spesial Hari Ini
            </h2>
            <p className="text-[#6B5744] text-xs sm:text-sm md:text-base mt-1.5 max-w-md font-normal">
              Menu pilihan yang tersedia hari ini, disiapkan dengan bahan terbaik.
            </p>
          </div>

          {/* Tombol Lihat Menu Lainnya di Kanan Atas */}
          <Link to="/menu" className="self-start sm:self-auto shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-cream-50 text-[#3A2E23] text-xs sm:text-sm font-bold border border-[#D8C2A7] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Lihat Menu Lainnya</span>
              <ArrowRight size={15} strokeWidth={2.4} />
            </button>
          </Link>
        </div>

        {/* ── 4 Menu Cards Slider Grid */}
        <div className="relative">
          {/* Tombol Panah Kiri */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Menu sebelumnya"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#3A2E23] shadow-[0_6px_20px_rgba(42,33,24,0.12)] border border-[#E8D5B7] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>

          {/* Grid 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {FEATURED_MENUS.map((item) => {
              const isFav = Boolean(favorites[item.id]);
              const isAdded = Boolean(addedIds[item.id]);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl p-3.5 border border-[#EBDDC8] shadow-[0_10px_30px_-15px_rgba(42,33,24,0.12)] hover:shadow-[0_16px_36px_-12px_rgba(140,74,38,0.2)] hover:border-[#D8C2A7] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Container with Favorite Heart Button */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF4EA]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Tombol Favorite Heart */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      aria-label="Simpan ke favorit"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#8C4A26] shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    >
                      <Heart
                        size={16}
                        className={`${
                          isFav ? "fill-[#E02424] text-[#E02424]" : "text-[#7A5843]"
                        } transition-colors`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="pt-3.5 pb-1 px-1 flex flex-col gap-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#2A2118] leading-snug group-hover:text-[#8C4A26] transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-bold text-xs sm:text-sm text-[#3A2E23]">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Bottom Row: Rating Star & Plus Button */}
                    <div className="mt-2 pt-2 border-t border-[#F5EADB] flex items-center justify-between">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#6B5744]">
                        <Star size={13} className="text-[#F5A623] fill-[#F5A623]" />
                        <span>{item.rating}</span>
                        <span className="text-coffee-400 font-normal">({item.reviewsCount}+)</span>
                      </div>

                      {/* Add to Cart Plus Button */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(item, e)}
                        aria-label={`Tambah ${item.name} ke pesanan`}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-xs cursor-pointer active:scale-90 ${
                          isAdded
                            ? "bg-green-600 scale-110"
                            : "bg-[#8C4A26] hover:bg-[#723819] hover:scale-105"
                        }`}
                      >
                        {isAdded ? (
                          <Check size={16} strokeWidth={2.6} />
                        ) : (
                          <Plus size={18} strokeWidth={2.4} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Panah Kanan */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Menu berikutnya"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#3A2E23] shadow-[0_6px_20px_rgba(42,33,24,0.12)] border border-[#E8D5B7] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* ── Carousel Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveDot(dot)}
              aria-label={`Slide ${dot + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                dot === activeDot
                  ? "w-2.5 h-2.5 bg-[#8C4A26] ring-2 ring-[#8C4A26]/30"
                  : "w-2 h-2 border border-[#D8C2A7] bg-transparent hover:border-[#8C4A26]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenuSection;

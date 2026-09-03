import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

const DEFAULT_SLIDES = [
  {
    id: "default-1",
    name: "Sup Brokoli Krim Gurih",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "default-2",
    name: "Nasi Ayam Katsu Spesial",
    image:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "default-3",
    name: "Nasi Daging Yakiniku",
    image:
      "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "default-4",
    name: "Nasi Chicken Teriyaki",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1400&q=85",
  },
];

const AUTO_PLAY_INTERVAL = 4500; // ms

const FeaturedMenuSection = () => {
  const navigate = useNavigate();
  const { availableMenus } = useMenu();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gunakan data menu dari katalog jika ada, padukan dengan default agar selalu minimal 4 slide
  const slides =
    availableMenus && availableMenus.length > 0
      ? [
          ...availableMenus.map((m) => ({
            id: m.id,
            name: m.name,
            image: m.image,
          })),
          ...DEFAULT_SLIDES.slice(Math.min(availableMenus.length, 3)),
        ].slice(0, Math.max(availableMenus.length, 4))
      : DEFAULT_SLIDES;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay slider
  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [handleNext, slides.length]);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-coffee-800 tracking-wide">
          MENU HARI INI
        </h2>
        <div className="w-14 h-1 bg-accent-500 rounded-full mt-1.5 mb-3" />
        <p className="text-coffee-500/90 text-sm md:text-base leading-relaxed max-w-md">
          Pilihan menu yang tersedia hari ini,
          <br className="hidden sm:inline" /> disiapkan dengan bahan terbaik.
        </p>
      </div>

      {/* Main Image Slider Banner */}
      <div className="relative">
        {/* Tombol Panah Kiri */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Menu sebelumnya"
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 text-coffee-800 shadow-[0_8px_24px_rgba(42,33,24,0.12)] border border-cream-200 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-white active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>

        {/* Gambar Banner Melengkung */}
        <div className="relative w-full h-60 sm:h-80 md:h-[380px] lg:h-[420px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(42,33,24,0.18)] border border-coffee-100/50 bg-cream-100">
          {slides.map((slide, i) => (
            <img
              key={slide.id || i}
              src={slide.image}
              alt={slide.name || "Menu Hari Ini"}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                i === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            />
          ))}
        </div>

        {/* Tombol Panah Kanan */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Menu berikutnya"
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 text-coffee-800 shadow-[0_8px_24px_rgba(42,33,24,0.12)] border border-cream-200 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-white active:scale-95 cursor-pointer"
        >
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      {/* Titik Indikator (Carousel Dots) */}
      <div className="flex items-center justify-center gap-2.5 mt-6 mb-7">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={`Pindah ke slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === currentIndex
                ? "w-3 h-3 bg-accent-600 ring-2 ring-accent-600/30"
                : "w-2.5 h-2.5 border border-coffee-400/60 bg-transparent hover:border-coffee-600"
            }`}
          />
        ))}
      </div>

      {/* Tombol CTA "Lihat Menu Lainnya" */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/menu")}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-cream-50/90 hover:bg-cream-100 text-accent-700 font-semibold text-sm sm:text-base border border-accent-400/80 hover:border-accent-500 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Lihat Menu Lainnya</span>
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
};

export default FeaturedMenuSection;

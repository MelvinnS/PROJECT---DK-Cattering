import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  Leaf,
  Truck,
  Star,
  Sparkles,
} from "lucide-react";
import Button from "../common/Button";
import menu1 from "../../assets/images/menu1.jpg";

const Hero = () => {
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [clickedStar, setClickedStar] = useState(null);

  // 3 Customer Avatars for rating badge
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  ];

  return (
    <section className="relative overflow-hidden bg-[#FBF3E7] pt-6 pb-16 md:pt-10 md:pb-24">
      {/* ── Background Organic Curves (Element oranye & beige di belakang dan bawah foto makanan) */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[55%] md:w-[50%] lg:w-[46%] h-[90%] md:h-[105%] z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full object-cover"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Layer Beige / Warm Cream Organic Blob */}
          <path
            d="M260,0 C380,0 500,80 500,220 C500,380 340,480 180,480 C70,480 0,380 0,260 C0,130 140,0 260,0 Z"
            fill="#EEDEC9"
            opacity="0.65"
          />
          {/* Layer Terracotta / Warm Orange Accent Curve Sweep */}
          <path
            d="M340,0 C450,20 500,120 500,260 C500,420 380,500 240,500 C160,500 80,440 90,340 C100,220 230,240 310,180 C370,130 330,40 340,0 Z"
            fill="#8C4A26"
            opacity="0.85"
          />
          {/* Smooth Warm Orange Highlight */}
          <path
            d="M380,40 C460,80 500,180 500,300 C500,440 400,500 280,500 C200,500 130,430 150,350 C180,240 300,250 360,190 C410,140 370,70 380,40 Z"
            fill="#C17F45"
            opacity="0.35"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ── Sisi Kiri: Teks & Call to Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tagline Badge */}
            <span className="inline-block text-xs md:text-sm font-extrabold tracking-[0.22em] text-[#C17F45] uppercase mb-3 sm:mb-4">
              Catering Harian Terpercaya
            </span>

            {/* Headline Utama */}
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#2A2118] leading-[1.12] tracking-tight">
                Makan Enak,
                <br />
                Tinggal{" "}
                <span className="text-[#8C4A26] relative inline-block">
                  Pesan.
                </span>
              </h1>

              {/* Aksen Daun Halus Dekoratif */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C17F45"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute -top-3 right-8 sm:right-24 md:right-32 opacity-80 pointer-events-none"
                aria-hidden="true"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20Z" />
                <path d="m2 21 9-9" />
              </svg>
            </div>

            {/* Deskripsi */}
            <p className="mt-5 text-[#5C4532] text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-normal">
             Catering harian dengan menu pilihan yang berbeda beda setiap harinya.
            </p>

            {/* Tombol CTA */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
              <Link to="/menu">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#8C4A26] hover:bg-[#723819] active:scale-95 shadow-[0_10px_25px_-5px_rgba(140,74,38,0.4)] transition-all duration-200 cursor-pointer"
                >
                  <span>Lihat Menu Hari Ini</span>
                  <ArrowRight size={16} strokeWidth={2.4} />
                </button>
              </Link>

              <a href="#cara-pemesanan">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-[#3A2E23] bg-white/90 hover:bg-white active:scale-95 border border-[#D8C2A7] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
                >
                  Cara Pesan
                </button>
              </a>
            </div>

            {/* 3 Fitur Unggulan di bawah Tombol */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-[#E8D5B7]/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
              {/* Fitur 1 */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F5EADB] flex items-center justify-center text-[#8C4A26] shrink-0 border border-[#E4D5C3]">
                  <ClipboardList size={16} />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] sm:text-xs font-bold text-[#2A2118]">
                    Menu Variatif
                  </p>
                  <p className="text-[10px] text-[#6B5744]">Setiap Hari</p>
                </div>
              </div>

              {/* Fitur 2 */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F5EADB] flex items-center justify-center text-[#8C4A26] shrink-0 border border-[#E4D5C3]">
                  <Leaf size={16} />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] sm:text-xs font-bold text-[#2A2118]">
                    Bahan Segar
                  </p>
                  <p className="text-[10px] text-[#6B5744]">Berkualitas</p>
                </div>
              </div>

              {/* Fitur 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F5EADB] flex items-center justify-center text-[#8C4A26] shrink-0 border border-[#E4D5C3]">
                  <Truck size={16} />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] sm:text-xs font-bold text-[#2A2118]">
                    Pengiriman Tepat
                  </p>
                  <p className="text-[10px] text-[#6B5744]">Sesuai Jadwal</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sisi Kanan: Foto Makanan Besar & Rating Card Interaktif */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            {/* Wadah Foto Makanan dengan Animasi Floating Halus */}
            <div className="relative w-full max-w-[430px] sm:max-w-[480px] lg:max-w-[520px] aspect-square flex items-center justify-center">
              {/* Lingkaran Piring Makanan & Efek Hover Dinamis */}
              <div className="relative w-full h-full flex items-center justify-center group">
                <img
                  src={menu1}
                  alt="Nasi Ayam Katsu DK Catering"
                  className="w-[92%] h-[92%] object-contain drop-shadow-[0_24px_45px_rgba(42,33,24,0.35)] select-none transition-transform duration-700 ease-out hover:scale-105 hover:rotate-1 cursor-pointer animate-float"
                  loading="eager"
                />
              </div>

              {/* ── Rating Card Floating & Interaktif (Pojok Kanan Bawah Foto) */}
              <div
                onMouseEnter={() => setIsRatingHovered(true)}
                onMouseLeave={() => setIsRatingHovered(false)}
                className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-[#EADFCF] shadow-[0_16px_36px_rgba(42,33,24,0.18)] transition-all duration-300 hover:scale-105 ${
                  isRatingHovered ? "shadow-[0_20px_45px_rgba(140,74,38,0.25)] ring-2 ring-[#C17F45]/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Stack 3 Pelanggan */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {avatars.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Pelanggan ${i + 1}`}
                        className="inline-block w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-white object-cover shadow-2xs transition-transform duration-200 hover:scale-110 hover:z-30"
                      />
                    ))}
                  </div>

                  {/* Keterangan Jumlah Pelanggan */}
                  <div className="leading-tight">
                    <p className="text-xs sm:text-sm font-extrabold text-[#2A2118]">
                      +500
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#6B5744] font-medium">
                      Pelanggan Puas
                    </p>
                  </div>
                </div>

                {/* Stars Rating Interaktif */}
                <div className="mt-2.5 pt-2 border-t border-[#F0E4D3] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setClickedStar(star)}
                        className="p-0.5 focus:outline-none transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                        aria-label={`Beri bintang ${star}`}
                      >
                        <Star
                          size={15}
                          className={`${
                            star <= (clickedStar || 5)
                              ? "text-[#F5A623] fill-[#F5A623]"
                              : "text-[#D3BFA6]"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-[#2A2118] tracking-tight">
                    4.8/5
                  </span>
                </div>

                {/* Micro-tooltip jika di-hover */}
                {isRatingHovered && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2A2118] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md animate-fade-in flex items-center gap-1">
                    <Sparkles size={10} className="text-[#F5A623]" />
                    <span>99% Ulasan Positif</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

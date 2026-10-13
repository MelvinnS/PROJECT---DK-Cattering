import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { landingMenus, heroCopy } from "../../data/landingData";
import useMediaQuery from "../../hooks/useMediaQuery";
import { WhatsAppIcon, InstagramIcon, GlobeIcon } from "../common/BrandIcons";

const AUTOPLAY_MS = 5000;

// Posisi tiap foto: offset 0 = utama di tengah depan, offset 1 & 2 = antrean kanan agak kecil
const desktopSlots = [
  { x: "0vw", scale: 1, opacity: 1, blur: 0, rotate: 0, z: 10 },
  { x: "23vw", scale: 0.65, opacity: 1, blur: 0, rotate: 0, z: 8 },
  { x: "37vw", scale: 0.44, opacity: 0.95, blur: 0, rotate: 0, z: 6 },
  { x: "-24vw", scale: 0.5, opacity: 0, blur: 4, rotate: -15, z: 4 },
];
const mobileSlots = [
  { x: "0vw", scale: 1, opacity: 1, blur: 0, rotate: 0, z: 10 },
  { x: "55vw", scale: 0.6, opacity: 1, blur: 0, rotate: 0, z: 8 },
  { x: "85vw", scale: 0.4, opacity: 0.9, blur: 0, rotate: 0, z: 6 },
  { x: "-50vw", scale: 0.5, opacity: 0, blur: 4, rotate: -15, z: 4 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const slots = isDesktop ? desktopSlots : mobileSlots;
  const total = landingMenus.length;

  const [current, setCurrent] = useState(0);
  const prevOffsets = useRef({});
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % total),
      AUTOPLAY_MS
    );
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const selectMenu = (index) => {
    setCurrent(index);
    startTimer();
  };

  const offsetsNow = {};
  landingMenus.forEach((_, i) => {
    offsetsNow[i] = (i - current + total) % total;
  });
  useEffect(() => {
    prevOffsets.current = offsetsNow;
  });

  return (
    <section
      data-nav="light"
      className="relative min-h-[680px] h-[100svh] overflow-hidden text-white bg-[#C48259]"
    >
      {/* Background warm terracotta */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#C48259]"
      />

      <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-16">
        {/* Teks Headline Kiri */}
        <div className="relative z-20 pt-32 lg:pt-0 lg:absolute lg:left-16 lg:top-[42%] lg:-translate-y-1/2 lg:w-[38%]">
          <h1 className="font-display display-bold text-[3rem] sm:text-6xl lg:text-[4.4rem] xl:text-[5.2rem] leading-[1.06] text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
            {heroCopy.titleLine1}
            <br />
            {heroCopy.titleLine2}
          </h1>
          <p className="mt-6 text-[13px] sm:text-sm leading-relaxed text-white/90 max-w-[21rem]">
            {heroCopy.description}
          </p>

          {/* Tombol CTA dengan shape hitam di bawahnya (seperti di prototype) */}
          <div className="mt-8 flex items-center gap-5 flex-wrap">
            {/* Tombol ORDER NOW dengan alas/shape hitam di bawahnya */}
            <div className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-1.5 rounded-full bg-[#181818]"
              />
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="relative rounded-full bg-white text-[#181818] border border-black/80 text-[11px] font-extrabold uppercase tracking-wider px-7 py-3 transition-transform active:translate-y-1 hover:-translate-y-0.5"
              >
                ORDER NOW
              </button>
            </div>

            {/* Tombol SEE MENU ITEMS dengan alas/shape hitam di bawahnya */}
            <div className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-1.5 rounded-full bg-[#181818]"
              />
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="relative rounded-full bg-[#4A1A0E] text-white text-[11px] font-extrabold uppercase tracking-wider px-7 py-3 transition-transform active:translate-y-1 hover:-translate-y-0.5"
              >
                SEE MENU ITEMS
              </button>
            </div>
          </div>
        </div>

        {/* Panggung foto produk tengah & kanan (Interaksi klik foto makanan langsung untuk mengganti) */}
        <div className="absolute inset-x-0 bottom-0 top-[28%] lg:top-0">
          {landingMenus.map((menu, i) => {
            const offset = offsetsNow[i];
            const prev = prevOffsets.current[i];
            const slot = slots[offset];
            const wraps =
              prev !== undefined &&
              ((prev === 3 && offset === 2) || (prev === 2 && offset === 3));
            const spring = { type: "spring", stiffness: 75, damping: 16, mass: 1 };
            const instant = { duration: 0 };

            return (
              <div
                key={menu.id}
                onClick={() => selectMenu(i)}
                aria-label={`Pilih ${menu.title}`}
                className="cursor-pointer absolute left-1/2 lg:left-[51%] top-[45%] lg:top-[48%] w-[min(82vw,410px)] lg:w-[min(38vw,560px)] aspect-square"
                style={{ transform: "translate(-50%, -50%)", zIndex: slot.z }}
              >
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={false}
                  animate={{
                    x: slot.x,
                    scale: slot.scale,
                    opacity: slot.opacity,
                    rotate: slot.rotate,
                    filter: `blur(${slot.blur}px)`,
                  }}
                  transition={
                    wraps
                      ? {
                          x: instant,
                          scale: instant,
                          rotate: instant,
                          filter: instant,
                          opacity: { duration: 0.7 },
                        }
                      : {
                          x: spring,
                          scale: spring,
                          rotate: spring,
                          filter: { duration: 0.7 },
                          opacity: { duration: 0.7 },
                        }
                  }
                >
                  <img
                    src={menu.image}
                    alt={menu.name}
                    draggable={false}
                    className={`w-full h-full object-contain rounded-full drop-shadow-[0_24px_30px_rgba(70,30,10,0.25)] transition-transform hover:scale-105 ${
                      offset === 0 ? "animate-float" : ""
                    }`}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gelombang krim di bawah hero — warna #FBF3E7 sama persis dengan latar section quotes agar menyatu */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[22%] lg:h-[32%] z-[9] pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#FBF3E7"
          d="M0,170 C90,120 180,95 270,120 C360,145 420,240 510,240 C600,240 660,110 750,110 C840,110 900,210 990,210 C1080,210 1140,80 1230,80 C1320,80 1390,150 1440,180 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Ulasan 10K+ Reviews di kiri bawah */}
      <div className="absolute z-30 left-6 lg:left-16 bottom-6 flex items-center gap-3 text-scoop-ink">
        <div className="flex -space-x-3">
          {["#C9805A", "#E7B98C", "#8E5A3C"].map((c, i) => (
            <span
              key={c}
              className="w-10 h-10 rounded-full border-2 border-scoop-cream flex items-center justify-center text-[12px] font-bold text-white shadow-sm"
              style={{ background: c }}
            >
              {["A", "B", "D"][i]}
            </span>
          ))}
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm text-[#181818]">{heroCopy.reviewsTitle}</p>
          <p className="text-[11px] text-[#555555]">{heroCopy.reviewsSubtitle}</p>
        </div>
      </div>

      {/* Sosmed hitam di kanan bawah: WhatsApp, Instagram, Browser/Globe */}
      <div className="flex absolute z-30 right-6 lg:right-16 bottom-7 items-center gap-5 text-[#181818]">
        <a
          href="https://wa.me"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="hover:scale-110 transition-transform"
        >
          <WhatsAppIcon size={19} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:scale-110 transition-transform"
        >
          <InstagramIcon size={19} />
        </a>
        <a
          href="/"
          aria-label="Website"
          className="hover:scale-110 transition-transform"
        >
          <GlobeIcon size={19} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;

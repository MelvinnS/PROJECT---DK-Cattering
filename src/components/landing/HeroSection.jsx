import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { landingMenus, heroCopy } from "../../data/landingData";
import useMediaQuery from "../../hooks/useMediaQuery";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "../common/BrandIcons";

const AUTOPLAY_MS = 4800;

// Posisi tiap foto berdasarkan "urutannya" dari foto utama (offset 0).
// offset 0 = utama, 1 & 2 = antrean di kanan (kecil + blur), 3 = baru saja lewat.
const desktopSlots = [
  { x: "0vw", scale: 1, opacity: 1, blur: 0, rotate: 0, z: 10 },
  { x: "23vw", scale: 0.6, opacity: 1, blur: 3, rotate: 4, z: 8 },
  { x: "36vw", scale: 0.34, opacity: 0.95, blur: 5, rotate: 8, z: 6 },
  { x: "-24vw", scale: 0.5, opacity: 0, blur: 6, rotate: -22, z: 4 },
];
const mobileSlots = [
  { x: "0vw", scale: 1, opacity: 1, blur: 0, rotate: 0, z: 10 },
  { x: "58vw", scale: 0.58, opacity: 1, blur: 3, rotate: 6, z: 8 },
  { x: "88vw", scale: 0.36, opacity: 0.95, blur: 5, rotate: 12, z: 6 },
  { x: "-50vw", scale: 0.5, opacity: 0, blur: 6, rotate: -22, z: 4 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const slots = isDesktop ? desktopSlots : mobileSlots;
  const total = landingMenus.length;

  const [current, setCurrent] = useState(0);
  const [portion, setPortion] = useState(1);
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

  const go = (dir) => {
    setCurrent((c) => (c + dir + total) % total);
    startTimer();
  };

  // Simpan offset sebelumnya untuk mendeteksi foto yang "berputar" dari
  // belakang ke antrean (supaya berpindah posisi tanpa menyapu layar).
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
      className="relative min-h-[680px] h-[100svh] overflow-hidden text-white"
    >
      {/* Latar: satu lapisan per menu, berganti dengan fade halus */}
      {landingMenus.map((menu, i) => (
        <div
          key={menu.id}
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            background: `radial-gradient(ellipse at 52% 42%, ${menu.bg.light} 0%, ${menu.bg.dark} 78%)`,
          }}
        />
      ))}

      <div className="relative h-full max-w-[1500px] mx-auto px-6 lg:px-12">
        {/* Ukuran porsi (dekoratif) */}
        <div className="hidden lg:flex absolute right-[7%] top-[17%] z-20 gap-3">
          {heroCopy.portions.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setPortion(i)}
              aria-label={`Porsi ${label}`}
              className={`w-11 h-11 rounded-full text-[11px] font-semibold transition-colors ${
                portion === i
                  ? "bg-white/70 text-scoop-ink"
                  : "bg-white/30 text-white/90 hover:bg-white/45"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Teks */}
        <div className="relative z-20 pt-28 lg:pt-0 lg:absolute lg:left-12 lg:top-[43%] lg:-translate-y-1/2 lg:w-[40%]">
          <h1 className="font-display display-bold text-[2.7rem] sm:text-6xl lg:text-[clamp(3rem,3.8vw,5.2rem)] leading-[1.08] text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.1)] lg:whitespace-nowrap">
            {heroCopy.titleLine1}
            <br />
            {heroCopy.titleLine2}
          </h1>
          <p className="mt-5 text-[12px] sm:text-[13px] leading-relaxed text-white/90 max-w-[19rem] lg:max-w-[20rem]">
            {heroCopy.description}
          </p>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="btn-3d rounded-full bg-scoop-cream text-scoop-ink text-[10px] font-bold uppercase tracking-wide px-6 py-3 shadow-[0_4px_0_#C9B07A]"
            >
              Pesan Sekarang
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("menu")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-3d rounded-full bg-scoop-maroon text-white text-[10px] font-bold uppercase tracking-wide px-6 py-3 shadow-[0_4px_0_#2B0A04]"
            >
              Lihat Menu
            </button>
          </div>
        </div>

        {/* Panggung foto menu */}
        <div className="absolute inset-x-0 bottom-0 top-[38%] lg:top-0 pointer-events-none">
          {landingMenus.map((menu, i) => {
            const offset = offsetsNow[i];
            const prev = prevOffsets.current[i];
            const slot = slots[offset];
            // Berputar dari belakang <-> antrean: pindah posisi instan, hanya fade.
            const wraps =
              prev !== undefined &&
              ((prev === 3 && offset === 2) || (prev === 2 && offset === 3));
            const spring = { type: "spring", stiffness: 70, damping: 16, mass: 1 };
            const instant = { duration: 0 };

            return (
              <div
                key={menu.id}
                className="absolute left-1/2 lg:left-[54%] top-[44%] lg:top-[50%] w-[min(78vw,380px)] lg:w-[min(36vw,560px)] aspect-square"
                style={{ transform: "translate(-50%, -50%)", zIndex: slot.z }}
              >
                <motion.div
                  className="w-full h-full"
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
                    className={`w-full h-full object-contain drop-shadow-[0_32px_28px_rgba(0,0,0,0.3)] ${
                      offset === 0 ? "animate-float-slow" : ""
                    }`}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gelombang krim di bawah hero. Bentuk & tinggi diukur dari prototype
          (puncak sekitar 1/3 tinggi hero). z-[9]: berada di belakang foto utama
          (z-10) sehingga foto menumpuk di atas gelombang seperti di video. */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[21%] lg:h-[33%] z-[9] pointer-events-none"
        viewBox="0 0 1440 330"
        preserveAspectRatio="none"
      >
        <path
          fill="#FFF0CD"
          d="M0,150 C50,136 100,107 150,107 C215,107 280,207 345,207 C393,207 442,99 490,56 C509,39 528,15 547,15 C578,15 609,35 640,55 C690,87 740,180 790,180 C833,180 877,95 920,95 C953,95 987,103 1020,115 C1069,132 1117,187 1166,187 C1209,187 1253,95 1296,95 C1344,95 1392,145 1440,170 L1440,330 L0,330 Z"
        />
      </svg>

      {/* Ulasan (kiri bawah) */}
      <div className="absolute z-30 left-6 lg:left-12 bottom-5 flex items-center gap-3 text-scoop-ink">
        <div className="flex -space-x-3">
          {["#C9805A", "#E7B98C", "#8E5A3C"].map((c, i) => (
            <span
              key={c}
              className="w-10 h-10 rounded-full border-2 border-scoop-cream flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: c }}
            >
              {["A", "B", "D"][i]}
            </span>
          ))}
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm">{heroCopy.reviewsTitle}</p>
          <p className="text-[11px] text-scoop-ink/60">{heroCopy.reviewsSubtitle}</p>
        </div>
      </div>

      {/* Tombol prev / next */}
      <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-5 flex gap-3">
        {[
          { dir: -1, icon: ArrowLeft, label: "Sebelumnya" },
          { dir: 1, icon: ArrowRight, label: "Berikutnya" },
        ].map(({ dir, icon: Icon, label }) => (
          <button
            key={dir}
            type="button"
            onClick={() => go(dir)}
            aria-label={label}
            className="w-11 h-11 rounded-full bg-white text-scoop-ink shadow-[0_3px_8px_rgba(0,0,0,0.18)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Icon size={17} />
          </button>
        ))}
      </div>

      {/* Sosmed (kanan bawah) */}
      <div className="hidden sm:flex absolute z-30 right-6 lg:right-12 bottom-8 items-center gap-4 text-scoop-ink">
        <FacebookIcon size={15} />
        <InstagramIcon size={15} />
        <YoutubeIcon size={16} />
      </div>
    </section>
  );
};

export default HeroSection;

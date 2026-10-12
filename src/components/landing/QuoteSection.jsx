import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { landingMenus, quoteText } from "../../data/landingData";

// Foto menu yang melayang & sedikit blur di sekeliling teks (parallax saat scroll).
<<<<<<< HEAD
// Posisi & ukuran mengikuti prototype: satu besar di kiri-tengah, satu besar di
// kanan-atas, dan dua kecil di sisi berlawanan.
const floaters = [
  { img: 0, size: "clamp(110px,10.5vw,165px)", pos: { left: "6%", top: "50%" }, speed: -60 },
  { img: 1, size: "clamp(34px,3.6vw,56px)", pos: { left: "14%", top: "24%" }, speed: 40 },
  { img: 2, size: "clamp(90px,8.6vw,135px)", pos: { right: "4%", top: "19%" }, speed: -90 },
  { img: 3, size: "clamp(44px,4.8vw,74px)", pos: { right: "9%", top: "61%" }, speed: 50 },
=======
const floaters = [
  { img: 0, size: "clamp(110px,11vw,170px)", pos: { left: "4%", top: "52%" }, speed: -60 },
  { img: 1, size: "clamp(36px,3.4vw,52px)", pos: { left: "13%", top: "21%" }, speed: 40 },
  { img: 2, size: "clamp(120px,12vw,185px)", pos: { right: "3%", top: "17%" }, speed: -90 },
  { img: 3, size: "clamp(44px,4.4vw,68px)", pos: { right: "11%", top: "66%" }, speed: 50 },
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
];

const Floater = ({ item, progress }) => {
  const y = useTransform(progress, [0, 1], [-item.speed, item.speed]);
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none hidden sm:block"
      style={{ ...item.pos, width: item.size, height: item.size, y }}
    >
      <img
        src={landingMenus[item.img].image}
        alt=""
        draggable={false}
        className="w-full h-full object-contain blur-[2.5px] opacity-90 drop-shadow-[0_14px_14px_rgba(120,66,34,0.25)]"
      />
    </motion.div>
  );
};

const QuoteSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="tentang"
      ref={ref}
      data-nav="dark"
<<<<<<< HEAD
      className="relative bg-scoop-cream overflow-hidden min-h-[100svh] flex items-center justify-center px-6 pt-28 pb-44 lg:pt-32 lg:pb-52"
=======
      className="relative bg-scoop-cream overflow-hidden min-h-[100svh] flex items-center justify-center px-6 py-32 lg:py-40"
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
    >
      {floaters.map((f) => (
        <Floater key={f.img} item={f} progress={scrollYProgress} />
      ))}

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
<<<<<<< HEAD
        className="relative z-10 font-display text-scoop-3d text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.2] text-center max-w-[22ch] sm:max-w-4xl lg:max-w-5xl"
=======
        className="relative z-10 font-display text-scoop-3d text-[1.9rem] sm:text-5xl lg:text-[3.4rem] leading-[1.22] text-center max-w-4xl"
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
      >
        {quoteText}
      </motion.p>

<<<<<<< HEAD
      {/* Gelombang cokelat -> warnanya sama dengan latar section menu (#BA7E55),
          lebih gelap & lebih tinggi dari sebelumnya, bentuk dari prototype. */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[18%] min-h-[100px]"
=======
      {/* Gelombang cokelat -> menyambung ke section menu */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[16%] min-h-[90px]"
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
<<<<<<< HEAD
          fill="#BA7E55"
          d="M0,57 C48,92 96,161 144,161 C216,161 288,48 360,48 C425,48 489,205 554,205 C614,205 674,57 734,57 C801,57 869,173 936,173 C998,173 1061,57 1123,57 C1181,57 1238,173 1296,173 C1344,173 1392,110 1440,78 L1440,200 L0,200 Z"
=======
          fill="#C28862"
          d="M0,105 C70,165 150,190 235,130 C300,85 365,60 430,95 C490,128 520,200 600,200 L860,200 C920,200 950,120 1020,92 C1100,60 1170,85 1230,135 C1300,190 1380,170 1440,120 L1440,200 L0,200 Z"
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
        />
      </svg>
    </section>
  );
};

export default QuoteSection;

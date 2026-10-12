import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { landingMenus, quoteText } from "../../data/landingData";

// Foto menu yang melayang & sedikit blur di sekeliling teks (parallax saat scroll).
const floaters = [
  { img: 0, size: "clamp(110px,11vw,170px)", pos: { left: "4%", top: "52%" }, speed: -60 },
  { img: 1, size: "clamp(36px,3.4vw,52px)", pos: { left: "13%", top: "21%" }, speed: 40 },
  { img: 2, size: "clamp(120px,12vw,185px)", pos: { right: "3%", top: "17%" }, speed: -90 },
  { img: 3, size: "clamp(44px,4.4vw,68px)", pos: { right: "11%", top: "66%" }, speed: 50 },
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
      className="relative bg-scoop-cream overflow-hidden min-h-[100svh] flex items-center justify-center px-6 py-32 lg:py-40"
    >
      {floaters.map((f) => (
        <Floater key={f.img} item={f} progress={scrollYProgress} />
      ))}

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 font-display text-scoop-3d text-[1.9rem] sm:text-5xl lg:text-[3.4rem] leading-[1.22] text-center max-w-4xl"
      >
        {quoteText}
      </motion.p>

      {/* Gelombang cokelat -> menyambung ke section menu */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[16%] min-h-[90px]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          fill="#C28862"
          d="M0,105 C70,165 150,190 235,130 C300,85 365,60 430,95 C490,128 520,200 600,200 L860,200 C920,200 950,120 1020,92 C1100,60 1170,85 1230,135 C1300,190 1380,170 1440,120 L1440,200 L0,200 Z"
        />
      </svg>
    </section>
  );
};

export default QuoteSection;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonialCopy } from "../../data/landingData";
import { getPublicReviews } from "../../services/reviewService";
import useMediaQuery from "../../hooks/useMediaQuery";

const tilts = [-3, 0, 3];

const Sparkle = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 60 60" className={className} fill="#3F9060">
    <path d="M30 0 L34 24 L55 12 L38 28 L60 30 L38 33 L55 48 L34 36 L30 60 L26 36 L5 48 L22 33 L0 30 L22 28 L5 12 L26 24 Z" />
  </svg>
);

const Squiggle = ({ className = "" }) => (
  <svg aria-hidden="true" viewBox="0 0 80 50" className={className} fill="none" stroke="#3F9060" strokeWidth="5" strokeLinecap="round">
    <path d="M6 44 C26 46 20 20 40 22 C62 24 52 8 74 6" />
  </svg>
);

const TestimonialSection = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [items, setItems] = useState(
    testimonialCopy.items.map((t, i) => ({ ...t, id: i }))
  );

  // Ambil ulasan nyata dari database publik jika tersedia
  useEffect(() => {
    let isMounted = true;
    getPublicReviews({ limit: 10 })
      .then((res) => {
        if (!isMounted) return;
        const revs = Array.isArray(res) ? res : res?.data ?? [];
        if (revs.length > 0) {
          const mapped = revs.map((r, idx) => ({
            id: r.id || idx,
            title: r.user?.fullName || "Pelanggan Setia",
            text: r.comment || "Makanannya sangat lezat dan pengirimannya selalu tepat waktu!",
            role: `Rating ${r.rating || 5}★`,
          }));
          setItems(mapped);
        }
      })
      .catch(() => {
        // Fallback ke testimonial default
      });
    return () => {
      isMounted = false;
    };
  }, []);
  const visibleCount = isDesktop ? 3 : 1;

  const rotate = (dir) =>
    setItems((prev) =>
      dir > 0 ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)]
    );

  const visible = items.slice(0, visibleCount);

  const arrowClass =
    "w-10 h-10 rounded-full bg-white text-scoop-ink shadow-[0_3px_6px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform";

  return (
    <section
      id="testimoni"
      data-nav="dark"
      className="relative bg-scoop-cream overflow-hidden px-6 pt-8 pb-16 lg:pb-24"
    >
      <Sparkle className="absolute left-[8%] top-[4%] w-12 lg:w-16" />
      <Squiggle className="absolute right-[9%] top-[2%] w-16 lg:w-24" />
      <Squiggle className="absolute left-[24%] bottom-[5%] w-10 lg:w-14" />
      <Sparkle className="absolute right-[22%] bottom-[4%] w-5" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-md mx-auto">
          <h2 className="font-display text-scoop-ink text-3xl lg:text-4xl">
            {testimonialCopy.title}
          </h2>
          <p className="mt-3 text-[13px] text-scoop-ink/80">
            {testimonialCopy.description}
          </p>
        </div>

        <div
          className={`mt-14 grid gap-6 lg:gap-8 ${
            isDesktop ? "grid-cols-3" : "grid-cols-1 max-w-sm mx-auto"
          }`}
        >
          {visible.map((t, i) => (
            <motion.article
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, rotate: isDesktop ? tilts[i] : 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              className="rounded-[1.75rem] bg-white p-6 lg:p-7 shadow-[5px_6px_0_#3F9060]"
            >
              <span className="font-display text-3xl leading-none text-scoop-ink">“</span>
              <p className="mt-2 text-[13px] leading-relaxed text-scoop-ink/90 min-h-[7.5rem]">
                {t.text}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-scoop-mint text-scoop-greenDark text-[11px] font-bold flex items-center justify-center">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="leading-tight">
                  <p className="font-bold text-sm text-scoop-ink">{t.name}</p>
                  <p className="text-[11px] text-scoop-ink/50">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <button type="button" onClick={() => rotate(-1)} aria-label="Sebelumnya" className={arrowClass}>
            <ArrowLeft size={16} />
          </button>
          <button type="button" onClick={() => rotate(1)} aria-label="Berikutnya" className={arrowClass}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

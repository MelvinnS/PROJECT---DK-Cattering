import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { faqCopy } from "../../data/landingData";
import { InstagramIcon, XIcon } from "../common/BrandIcons";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      data-nav="dark"
      className="relative bg-scoop-cream px-4 sm:px-6 lg:px-12 py-20 lg:py-28"
    >
      {/* Box Hijau Besar Rounded Lebar dengan shadow tebal di bawahnya */}
      <div className="relative max-w-[1320px] mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3.8rem] bg-[#3B8A5A] shadow-[0_12px_0_#2B6944] px-7 sm:px-12 lg:px-20 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Garis lengkung / gelombang halus di dalam box hijau */}
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 w-full h-[65%] pointer-events-none"
          viewBox="0 0 1200 350"
          preserveAspectRatio="none"
        >
          <path
            d="M-40,290 C120,270 200,200 340,240 C480,280 560,320 700,260 C840,200 980,210 1100,160 C1180,130 1220,100 1260,70"
            fill="none"
            stroke="#327A4F"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </svg>

        {/* Kolom Kiri: Judul FAQ's, Deskripsi, dan 3 Ikon bulat di kiri bawah */}
        <div className="relative z-10 lg:col-span-5 flex flex-col justify-between h-full min-h-[280px]">
          <div>
            <h2 className="font-display display-bold text-white text-[3rem] sm:text-5xl lg:text-[4rem] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]">
              {faqCopy.title}
            </h2>
            <p className="mt-6 text-[13px] sm:text-[14px] leading-relaxed text-white/90 max-w-[19rem]">
              {faqCopy.description}
            </p>
          </div>

          {/* 3 Ikon sosial media bulat mint di kiri bawah (Instagram, X, Facebook/threads) */}
          <div className="flex items-center gap-3.5 pt-12 lg:pt-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-[#BFF2CB] text-[#245D3B] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
            >
              <InstagramIcon size={17} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="w-10 h-10 rounded-full bg-[#BFF2CB] text-[#245D3B] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
            >
              <XIcon size={17} />
            </a>
            <span
              className="w-10 h-10 rounded-full bg-[#BFF2CB] text-[#245D3B] flex items-center justify-center hover:scale-110 transition-transform shadow-sm cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Kolom Kanan: 4 Pill Item FAQ berwarna hijau muda mint */}
        <div className="relative z-10 lg:col-span-7 flex flex-col gap-4">
          {faqCopy.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question} className="relative">
                {/* Pill Capsule dengan border halus dan bayangan dasar gelap */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 rounded-full bg-[#C2F2CE] pl-6 pr-2.5 py-2.5 sm:py-3 text-left shadow-[0_4px_0_#286B44] hover:bg-[#B3EEBF] active:translate-y-0.5 transition-all"
                >
                  <span className="font-display font-bold text-[#181818] text-[15px] sm:text-[17px] leading-snug flex items-center gap-2.5">
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.question}</span>
                  </span>

                  {/* Lingkaran Putih dengan Icon Panah (Panah Bawah jika Open, Panah Kanan jika Closed) */}
                  <span className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#181818] border border-black/5">
                    {isOpen ? (
                      <ArrowDown size={18} className="stroke-[2.5]" />
                    ) : (
                      <ArrowRight size={18} className="stroke-[2.5]" />
                    )}
                  </span>
                </button>

                {/* Konten Accordion jika terbuka */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 mx-5 rounded-2xl bg-white/95 px-5 py-4 text-[13.5px] leading-relaxed text-[#181818] shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { faqCopy } from "../../data/landingData";
import { getWhatsappLink } from "../../data/siteConfig";
import { InstagramIcon, FacebookIcon, XIcon } from "../common/BrandIcons";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      data-nav="dark"
      className="relative bg-scoop-cream px-4 sm:px-6 lg:px-10 pt-24 pb-24 lg:pb-32"
    >
      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] bg-scoop-green shadow-[0_8px_0_#2F6E48] px-6 sm:px-10 lg:px-16 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 min-h-[28rem]">
        {/* Garis gelombang dekoratif */}
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 w-full h-1/2 pointer-events-none"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            d="M-20,230 C120,200 200,150 320,200 C440,250 540,270 680,210 C820,150 960,160 1080,120 C1140,100 1190,80 1230,60"
            fill="none"
            stroke="#2F7C4F"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative flex flex-col justify-between gap-10">
          <div>
            <h2 className="font-display text-white text-4xl lg:text-5xl [text-shadow:0_3px_0_rgba(0,0,0,0.18)]">
              {faqCopy.title}
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-white/85 max-w-[17rem]">
              {faqCopy.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[InstagramIcon, XIcon, FacebookIcon].map((Icon, i) => (
              <span
                key={i}
                className="w-10 h-10 rounded-full bg-scoop-mint text-scoop-greenDark flex items-center justify-center"
              >
                <Icon size={16} />
              </span>
            ))}
            <a
              href={getWhatsappLink("Halo, saya ingin bertanya tentang catering.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tanya lewat WhatsApp"
              className="w-10 h-10 rounded-full bg-scoop-mint text-scoop-greenDark flex items-center justify-center hover:scale-105 transition-transform"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div className="relative flex flex-col gap-4">
          {faqCopy.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl bg-scoop-mint pl-5 pr-3 py-3.5 text-left shadow-[0_4px_0_#1F5B3A] hover:brightness-105 transition"
                >
                  <span className="font-display text-scoop-ink text-[15px] leading-snug">
                    <span className="mr-2">{item.emoji}</span>
                    {item.question}
                  </span>
                  <span className="w-9 h-9 shrink-0 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center text-scoop-ink">
                    <ArrowRight
                      size={16}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 mx-3 rounded-xl bg-white px-4 py-3 text-[13px] leading-relaxed text-scoop-ink shadow-[0_3px_6px_rgba(0,0,0,0.18)]">
                        {item.answer}
                      </p>
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

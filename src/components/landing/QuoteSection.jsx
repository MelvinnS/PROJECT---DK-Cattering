import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { quoteCopy } from "../../data/landingData";

const QuoteSection = () => {
  return (
    <section
      id="tentang"
      data-nav="dark"
      className="relative overflow-hidden min-h-[520px] lg:min-h-[640px] flex items-center justify-center px-6 py-28 lg:py-36"
      style={{ background: "#FBF3E7" }}
    >
      {/* Lingkaran Orbit di Belakang Teks (di sebelah kanan) */}
      <div
        aria-hidden="true"
        className="absolute right-[-8%] lg:right-[8%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] lg:w-[620px] lg:h-[620px] pointer-events-none"
      >
        {/* Orbit 1: Luar */}
        <div className="absolute inset-0 rounded-full border border-black/[0.08]" />
        {/* Orbit 2: Tengah */}
        <div className="absolute inset-[15%] rounded-full border border-dashed border-black/[0.12]" />
        {/* Orbit 3: Dalam */}
        <div className="absolute inset-[32%] rounded-full border border-black/[0.09]" />
        {/* Orbit 4: Pusat */}
        <div className="absolute inset-[48%] rounded-full border border-black/[0.07]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start"
        >
          {/* 5 Bintang Emas/Oranye di Atas */}
          <div className="flex items-center gap-1.5 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={22}
                className="fill-[#F59E0B] text-[#F59E0B]"
              />
            ))}
          </div>

          {/* Teks Quotes: Tiru tipografi & highlight Orastrix */}
          <blockquote className="font-display text-[#181818] text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem] leading-[1.22] tracking-tight font-bold text-left">
            “beli makan di restoran mahal, jadi saya pilih Cattering Harian di{" "}
            <span className="relative inline-block text-[#D97706] italic font-serif underline decoration-[#D97706] underline-offset-8 decoration-2">
              DK Cattering 
            </span>
            , Dompet aman, perut kenyang.”
          </blockquote>

          {/* Penulis Quote: — ISAAC NEWTON */}
          <div className="mt-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-black/40" />
            <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.22em] text-black/70 uppercase">
              {quoteCopy.author}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Gelombang cokelat menyambung ke latar section menu (#C48259) */}
      <svg
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 w-full h-[18%] min-h-[100px] pointer-events-none"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          fill="#C48259"
          d="M0,57 C48,92 96,161 144,161 C216,161 288,48 360,48 C425,48 489,205 554,205 C614,205 674,57 734,57 C801,57 869,173 936,173 C998,173 1061,57 1123,57 C1181,57 1238,173 1296,173 C1344,173 1392,110 1440,78 L1440,200 L0,200 Z"
        />
      </svg>
    </section>
  );
};

export default QuoteSection;

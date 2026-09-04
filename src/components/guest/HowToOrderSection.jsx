import {
  FileText,
  MessageCircle,
  CheckCircle2,
  Bike,
} from "lucide-react";
import { getWhatsappLink } from "../../data/siteConfig";

const WHATSAPP_LINK = getWhatsappLink(
  "Halo Admin, saya ingin memesan catering harian."
);

const STEPS = [
  {
    stepNumber: 1,
    icon: FileText,
    title: "Pilih Menu",
    description: "Lihat menu harian dan pilih makanan favoritmu.",
  },
  {
    stepNumber: 2,
    icon: MessageCircle,
    title: "Pesan",
    description: "Hubungi admin atau pesan lewat WhatsApp.",
  },
  {
    stepNumber: 3,
    icon: CheckCircle2,
    title: "Konfirmasi",
    description: "Konfirmasi pesanan dan detail pengantaran.",
  },
  {
    stepNumber: 4,
    icon: Bike,
    title: "Nikmati",
    description: "Makanan siap diantar, tinggal nikmati!",
  },
];

const HowToOrderSection = () => {
  return (
    <section id="cara-pemesanan" className="bg-[#FAF4EA] py-16 md:py-24" aria-label="Cara Pemesanan">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* ── Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#C17F45] uppercase block mb-1.5">
            Cara Pemesanan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#2A2118] tracking-tight">
            Empat Langkah Mudah
          </h2>
          <p className="text-[#6B5744] text-xs sm:text-sm md:text-base mt-2 max-w-md mx-auto font-normal">
            Proses pemesanan yang cepat, praktis, dan aman.
          </p>
        </div>

        {/* ── 4 Step Cards connected with subtle wavy curve line */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-stretch">
          {/* Subtle curved connecting line on desktop */}
          <div
            className="hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-[2px] border-t-2 border-dashed border-[#E0CFBB] pointer-events-none z-0"
            aria-hidden="true"
          />

          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.stepNumber}
                className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDDC8] shadow-[0_10px_30px_-15px_rgba(42,33,24,0.1)] hover:shadow-[0_16px_36px_-12px_rgba(140,74,38,0.18)] hover:border-[#D8C2A7] transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Step Badge Number */}
                <div className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-[#8C4A26] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {step.stepNumber}
                </div>

                {/* Step Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#FAF4EA] flex items-center justify-center text-[#8C4A26] mb-4 mt-1 border border-[#EBDDC8] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} strokeWidth={2.2} />
                </div>

                {/* Step Title */}
                <h3 className="font-extrabold text-base text-[#2A2118] mb-1.5 group-hover:text-[#8C4A26] transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs text-[#6B5744] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Centered Button "Hubungi Admin" */}
        <div className="flex justify-center mt-12 sm:mt-14">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2A2118] hover:bg-[#1E1610] text-white text-xs sm:text-sm font-bold shadow-[0_10px_25px_-5px_rgba(42,33,24,0.4)] hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <MessageCircle size={18} strokeWidth={2.4} />
            <span>Hubungi Admin</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowToOrderSection;

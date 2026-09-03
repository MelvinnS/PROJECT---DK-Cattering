import { MessageCircle } from "lucide-react";
import orderStepsData from "../../data/orderStepsData";
import OrderStepCard from "./OrderStepCard";
import Button from "../common/Button";
import { getWhatsappLink } from "../../data/siteConfig";

const WHATSAPP_LINK = getWhatsappLink(
  "Halo, saya ingin bertanya tentang menu catering hari ini."
);

const HowToOrderSection = () => {
  return (
    <section id="cara-pemesanan" className="bg-cream-100/60 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-coffee-800 tracking-wide relative inline-block">
            CARA PEMESANAN
            <span className="block w-14 h-1 bg-accent-500 rounded-full mt-2 mx-auto" />
          </h2>
          <p className="text-coffee-500/80 text-sm md:text-base mt-4 max-w-md mx-auto">
            Empat langkah sederhana sebelum makananmu siap diantar.
          </p>
        </div>

        {/* Grid rapi tanpa scroll horizontal — garis penghubung hanya tampil di desktop */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <div
            className="hidden md:block absolute top-6 md:top-7 left-[12.5%] right-[12.5%] h-px bg-coffee-200"
            aria-hidden="true"
          />
          {orderStepsData.map((step) => (
            <OrderStepCard key={step.id} step={step} />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" icon={MessageCircle}>
              Hubungi Admin
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowToOrderSection;

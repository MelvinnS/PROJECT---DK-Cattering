import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { landingMenus, menuSectionCopy } from "../../data/landingData";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";

const MenuShowcaseSection = () => {
  const { addToCart } = useOrder();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState(landingMenus);
  const [addedId, setAddedId] = useState(null);

  // Geser carousel: kartu pertama pindah ke belakang (atau sebaliknya);
  // animasi perpindahan ditangani prop `layout` dari framer-motion.
  const rotate = (dir) =>
    setItems((prev) =>
      dir > 0 ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)]
    );

  const handleBuy = (menu) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    addToCart({ id: menu.id, name: menu.name, price: menu.price, image: menu.image });
    setAddedId(menu.id);
    setTimeout(() => setAddedId((cur) => (cur === menu.id ? null : cur)), 1300);
  };

  const arrowClass =
    "w-11 h-11 rounded-full bg-white text-scoop-ink shadow-[0_3px_8px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform";

  return (
    <section
      id="menu"
      data-nav="light"
      className="relative bg-scoop-tan overflow-hidden pt-24 pb-28 lg:pt-32 lg:pb-32"
    >
      {/* Garis lengkung dekoratif */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[70%] pointer-events-none"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
      >
        <path
          d="M-20,380 C120,300 220,330 330,400 C470,490 600,430 720,350 C850,265 960,290 1080,390 C1200,480 1330,420 1470,300"
          fill="none"
          stroke="#B77C55"
          strokeWidth="26"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-start justify-between gap-8 flex-wrap mb-16 lg:mb-24">
          <h2 className="font-display text-white text-4xl lg:text-5xl leading-[1.12] whitespace-pre-line drop-shadow-[0_3px_0_rgba(90,40,15,0.25)]">
            {menuSectionCopy.title}
          </h2>
          <p className="text-[13px] leading-relaxed text-white/70 max-w-[15rem] lg:mt-3">
            {menuSectionCopy.description}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => rotate(-1)}
            aria-label="Menu sebelumnya"
            className={`${arrowClass} hidden lg:flex absolute -left-16 top-1/2 z-20`}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => rotate(1)}
            aria-label="Menu berikutnya"
            className={`${arrowClass} hidden lg:flex absolute -right-16 top-1/2 z-20`}
          >
            <ArrowRight size={17} />
          </button>

          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-24 lg:gap-x-6">
            {items.map((menu) => (
              <motion.li
                key={menu.id}
                layout
                transition={{ type: "spring", stiffness: 220, damping: 30 }}
                className="group relative pt-16"
              >
                <img
                  src={menu.image}
                  alt={menu.name}
                  draggable={false}
                  className="absolute left-1/2 top-0 z-10 w-[88%] -translate-x-1/2 aspect-square object-contain drop-shadow-[0_18px_16px_rgba(60,25,8,0.28)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:rotate-3"
                />
                <div className="relative bg-white rounded-[2.4rem] px-4 pt-[min(34vw,9.5rem)] lg:pt-36 pb-10 text-center shadow-[0_14px_30px_-14px_rgba(60,25,8,0.35)]">
                  <p className="font-display text-scoop-ink text-2xl lg:text-[1.7rem]">
                    {formatCurrency(menu.price)}
                  </p>
                  <p className="mt-2 text-sm text-scoop-ink/60 leading-snug">
                    {menu.name}
                  </p>
                  <p className="mt-1 text-[11px] text-scoop-ink/40 leading-snug hidden sm:block">
                    {menu.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleBuy(menu)}
                    className="btn-3d absolute left-1/2 -bottom-4 -translate-x-1/2 min-w-[7rem] inline-flex items-center justify-center gap-1.5 rounded-full bg-scoop-ink text-white text-[11px] font-bold uppercase tracking-wide px-5 py-3 shadow-[0_4px_0_#000]"
                  >
                    {addedId === menu.id ? (
                      <>
                        <Check size={13} /> Ditambah
                      </>
                    ) : (
                      "Pesan"
                    )}
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Panah versi mobile/tablet */}
          <div className="lg:hidden flex justify-center gap-3 mt-14">
            <button type="button" onClick={() => rotate(-1)} aria-label="Menu sebelumnya" className={arrowClass}>
              <ArrowLeft size={17} />
            </button>
            <button type="button" onClick={() => rotate(1)} aria-label="Menu berikutnya" className={arrowClass}>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuShowcaseSection;

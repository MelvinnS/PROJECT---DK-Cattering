import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { landingMenus, menuSectionCopy } from "../../data/landingData";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useMenu } from "../../context/MenuContext";
import { formatCurrency } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";

const cardSpring = { type: "spring", stiffness: 240, damping: 28 };

const MenuShowcaseSection = () => {
  const { addToCart } = useOrder();
  const { isAuthenticated } = useAuth();
  const { availableMenus } = useMenu();
  const navigate = useNavigate();
  const [items, setItems] = useState(landingMenus);

  // Jika katalog menu aktif dari database sudah termuat, gunakan menu database
  useEffect(() => {
    if (availableMenus && availableMenus.length >= 3) {
      const palette = [
        { light: "#C48259", dark: "#A6633E" },
        { light: "#4E7B68", dark: "#385C4D" },
        { light: "#C87A5B", dark: "#A85E40" },
        { light: "#5D6D7E", dark: "#34495E" },
      ];
      const mapped = availableMenus.slice(0, 6).map((m, idx) => ({
        id: m.id,
        name: m.name,
        title: m.name,
        price: formatCurrency(Number(m.price)),
        priceValue: Number(m.price),
        image: m.image || m.imageUrl || landingMenus[idx % landingMenus.length].image,
        tagline: m.description || "Menu lezat berkualitas setiap hari",
        bg: palette[idx % palette.length],
      }));
      setItems(mapped);
    }
  }, [availableMenus]);
  const [addedId, setAddedId] = useState(null);
  const [wrapId, setWrapId] = useState(null);

  // Geser carousel: kartu pertama pindah ke belakang (atau sebaliknya)
  const rotate = (dir) => {
    const first = items[0];
    const last = items[items.length - 1];
    setWrapId(dir > 0 ? first.id : last.id);
    setItems(
      dir > 0 ? [...items.slice(1), first] : [last, ...items.slice(0, -1)]
    );
  };

  const handleBuy = (menu) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    addToCart({
      id: menu.id,
      name: menu.title || menu.name,
      price: menu.priceValue || 18000,
      image: menu.image,
    });
    setAddedId(menu.id);
    setTimeout(() => setAddedId((cur) => (cur === menu.id ? null : cur)), 1300);
  };

  const arrowBtnClass =
    "w-12 h-12 rounded-full bg-white text-[#181818] shadow-[0_4px_16px_rgba(0,0,0,0.18)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20";

  return (
    <section
      id="menu"
      data-nav="light"
      className="relative bg-[#C48259] overflow-hidden pt-28 pb-28 lg:pt-36 lg:pb-36"
    >
      {/* Garis lengkung organik latar belakang di belakang kartu */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-12 w-full h-[55%] pointer-events-none"
        viewBox="0 0 1440 450"
        preserveAspectRatio="none"
      >
        <path
          d="M-40,320 C140,420 300,420 480,360 C680,290 820,380 1020,400 C1180,415 1320,320 1480,240"
          fill="none"
          stroke="#AB6943"
          strokeWidth="32"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header Section: Judul tebal font display di kiri, deskripsi halus di kanan */}
        <div className="flex items-start justify-between gap-8 flex-wrap mb-20 lg:mb-28">
          <h2 className="font-display display-bold text-white text-[2.8rem] sm:text-[3.4rem] lg:text-[4.2rem] leading-[1.05] tracking-tight whitespace-pre-line drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            {menuSectionCopy.title}
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/90 max-w-[21rem] lg:pt-3 font-normal">
            {menuSectionCopy.description}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Tombol Panah Kiri Desktop */}
          <button
            type="button"
            onClick={() => rotate(-1)}
            aria-label="Menu sebelumnya"
            className={`${arrowBtnClass} hidden xl:flex absolute -left-7 top-[60%] -translate-y-1/2`}
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* Tombol Panah Kanan Desktop */}
          <button
            type="button"
            onClick={() => rotate(1)}
            aria-label="Menu berikutnya"
            className={`${arrowBtnClass} hidden xl:flex absolute -right-7 top-[60%] -translate-y-1/2`}
          >
            <ArrowRight size={20} className="stroke-[2.5]" />
          </button>

          {/* Grid 4 Kartu Menu */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 lg:gap-x-7 gap-y-36 pt-16">
            {items.map((menu) => (
              <motion.li
                key={menu.id}
                layout
                animate={wrapId === menu.id ? { opacity: [0, 0, 1] } : { opacity: 1 }}
                transition={{
                  layout: cardSpring,
                  opacity: { duration: 0.5, times: [0, 0.3, 1] },
                }}
                className="group relative flex flex-col items-center"
              >
                {/* Kotak Putih: Rounded membulat lebar, shadow lembut */}
                <div className="relative w-full bg-white rounded-[2.6rem] lg:rounded-[3.2rem] pt-32 lg:pt-40 pb-12 px-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex flex-col items-center">
                  
                  {/* Foto Makanan Melayang di Atas Kotak Putih */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[45%] w-[88%] max-w-[230px] aspect-square z-10 pointer-events-none">
                    <img
                      src={menu.image}
                      alt={menu.name}
                      draggable={false}
                      className="w-full h-full object-cover rounded-full drop-shadow-[0_16px_22px_rgba(70,30,10,0.22)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105"
                    />
                  </div>

                  {/* Harga makanan */}
                  <p className="font-display font-bold text-[#181818] text-[2.1rem] lg:text-[2.5rem] leading-none tracking-tight">
                    {menu.price}
                  </p>

                  {/* Nama / Deskripsi Menu */}
                  <p className="mt-3 text-[14px] lg:text-[15px] font-normal text-[#666666] leading-snug max-w-[11rem] min-h-[42px] flex items-center justify-center">
                    {menu.name}
                  </p>

                  {/* Tombol BUY NOW: Kotak kapsul hitam di bawah */}
                  <div className="absolute inset-x-0 -bottom-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleBuy(menu)}
                      className="min-w-[124px] h-10 px-6 rounded-full bg-[#181818] text-white text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      {addedId === menu.id ? (
                        <>
                          <Check size={14} className="stroke-[3]" /> ADDED
                        </>
                      ) : (
                        "BUY NOW"
                      )}
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Tombol Prev & Next untuk Mobile / Tablet */}
          <div className="xl:hidden flex justify-center gap-4 mt-16">
            <button
              type="button"
              onClick={() => rotate(-1)}
              aria-label="Menu sebelumnya"
              className={arrowBtnClass}
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => rotate(1)}
              aria-label="Menu berikutnya"
              className={arrowBtnClass}
            >
              <ArrowRight size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuShowcaseSection;

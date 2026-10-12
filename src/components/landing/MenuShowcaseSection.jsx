import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { landingMenus, menuSectionCopy } from "../../data/landingData";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";

<<<<<<< HEAD
const cardSpring = { type: "spring", stiffness: 220, damping: 30 };

=======
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
const MenuShowcaseSection = () => {
  const { addToCart } = useOrder();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState(landingMenus);
  const [addedId, setAddedId] = useState(null);
<<<<<<< HEAD
  const [wrapId, setWrapId] = useState(null); // kartu yang "melompat" dari ujung ke ujung

  // Geser carousel: kartu pertama pindah ke belakang (atau sebaliknya).
  // Perpindahan posisi dianimasikan prop `layout`; kartu yang berpindah ujung
  // di-fade supaya tidak terlihat menyapu melewati kartu lain.
  const rotate = (dir) => {
    const first = items[0];
    const last = items[items.length - 1];
    setWrapId(dir > 0 ? first.id : last.id);
    setItems(
      dir > 0 ? [...items.slice(1), first] : [last, ...items.slice(0, -1)]
    );
  };
=======

  // Geser carousel: kartu pertama pindah ke belakang (atau sebaliknya);
  // animasi perpindahan ditangani prop `layout` dari framer-motion.
  const rotate = (dir) =>
    setItems((prev) =>
      dir > 0 ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)]
    );
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca

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
<<<<<<< HEAD
    "w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white text-scoop-ink shadow-[0_3px_10px_rgba(60,25,8,0.22)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform";
=======
    "w-11 h-11 rounded-full bg-white text-scoop-ink shadow-[0_3px_8px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform";
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca

  return (
    <section
      id="menu"
      data-nav="light"
<<<<<<< HEAD
      className="relative bg-scoop-tan overflow-hidden pt-28 pb-24 lg:pt-36 lg:pb-32"
    >
      {/* Pita lengkung dekoratif: naik dari kiri-bawah ke kanan-atas, lewat di belakang kartu */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 w-full h-[62%] pointer-events-none"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M-20,490 C31,458 83,395 134,395 C189,395 245,435 300,450 C362,467 423,490 485,490 C558,490 630,401 703,366 C800,319 897,281 994,252 C1091,223 1188,210 1285,192 C1347,180 1408,171 1470,160"
          fill="none"
          stroke="#AA6D45"
          strokeWidth="28"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-20 xl:px-10">
        {/* Judul (kiri) + deskripsi kecil (kanan) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start justify-between gap-8 flex-wrap"
        >
          <h2 className="font-display display-bold text-white text-[2.1rem] lg:text-[2.6rem] leading-[1.12] whitespace-pre-line drop-shadow-[0_2px_0_rgba(90,40,15,0.18)]">
            {menuSectionCopy.title}
          </h2>
          <p className="text-[12px] leading-relaxed text-white/60 max-w-[14.5rem] lg:mt-3">
            {menuSectionCopy.description}
          </p>
        </motion.div>

        {/* Carousel kartu */}
        <div className="relative">
          {/* Panah kiri/kanan (desktop): sejajar bagian tengah-bawah kartu */}
          <div className="hidden lg:block absolute inset-x-0 top-40 bottom-0 pointer-events-none">
            <button
              type="button"
              onClick={() => rotate(-1)}
              aria-label="Menu sebelumnya"
              className={`${arrowClass} pointer-events-auto absolute -left-[3.6rem] top-[58%] -translate-y-1/2`}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => rotate(1)}
              aria-label="Menu berikutnya"
              className={`${arrowClass} pointer-events-auto absolute -right-[3.6rem] top-[58%] -translate-y-1/2`}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 lg:gap-x-4 gap-y-28 pt-28 lg:pt-40">
=======
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
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
            {items.map((menu) => (
              <motion.li
                key={menu.id}
                layout
<<<<<<< HEAD
                animate={wrapId === menu.id ? { opacity: [0, 0, 1] } : { opacity: 1 }}
                transition={{
                  layout: cardSpring,
                  opacity: { duration: 0.6, times: [0, 0.4, 1] },
                }}
                className="group relative"
              >
                {/* Kartu putih tinggi, sudut sangat membulat. Padding-top berbasis
                    persen = proporsi lebar kartu, jadi tata letak ikut mengecil. */}
                <div className="relative bg-white rounded-[2.5rem] lg:rounded-[3.6rem] [corner-shape:squircle] px-3 lg:px-4 pt-[60%] pb-12 text-center shadow-[0_10px_30px_-12px_rgba(60,25,8,0.3)]">
                  {/* Foto: setengah di atas kartu, setengah menumpuk ke dalam kartu */}
                  <div className="absolute left-1/2 top-0 z-10 w-[92%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <img
                      src={menu.image}
                      alt={menu.name}
                      draggable={false}
                      className="w-full aspect-square object-contain drop-shadow-[0_14px_14px_rgba(60,25,8,0.22)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:rotate-3"
                    />
                  </div>

                  <p className="font-display text-scoop-ink text-[1.65rem] lg:text-[2.1rem] leading-none">
                    {formatCurrency(menu.price)}
                  </p>
                  <p className="mt-3 text-[0.8rem] lg:text-[0.95rem] font-medium text-[#6b6b6b] leading-snug max-w-[9.5rem] mx-auto">
                    {menu.name}
                  </p>
                  <span className="sr-only">{menu.tagline}</span>

                  {/* Tombol hitam: setengah keluar dari tepi bawah kartu */}
                  <div className="absolute inset-x-0 -bottom-[1.1rem] flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleBuy(menu)}
                      className="inline-flex items-center justify-center gap-1.5 h-9 lg:h-10 px-4 lg:px-5 rounded-[0.9rem] bg-scoop-ink text-white text-[9.5px] lg:text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap shadow-[0_6px_14px_-4px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-transform"
                    >
                      {addedId === menu.id ? (
                        <>
                          <Check size={13} /> Ditambah
                        </>
                      ) : (
                        "Beli Sekarang"
                      )}
                    </button>
                  </div>
=======
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
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
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

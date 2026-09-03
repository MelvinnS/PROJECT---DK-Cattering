import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { formatPrice } from "../../data/menuData";
import Button from "../common/Button";

const ROTATE_INTERVAL = 3800; // jeda antar foto & info menu (ms)

/**
 * Featured Menu Card — menampilkan foto & info menu yang berganti otomatis
 * (crossfade + zoom halus) mengambil semua foto dari data menu, sehingga
 * "MENU HARI INI" terasa hidup tanpa perlu interaksi apa pun dari user.
 */
const MenuCard = ({ menus = [], onAddMenu, onSeeMore }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (menus.length <= 1) return undefined;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % menus.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [menus.length]);

  if (!menus.length) return null;
  const active = menus[index];

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_24px_60px_-24px_rgba(42,33,24,0.25)] border border-coffee-100/60">
      {/* Galeri foto — semua foto ditumpuk, hanya yang aktif terlihat (crossfade + zoom) */}
      <div className="relative md:w-[42%] h-64 md:h-auto min-h-[16rem] shrink-0 overflow-hidden bg-cream-100">
        {menus.map((menu, i) => (
          <img
            key={menu.id}
            src={menu.image}
            alt={menu.name}
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/35 via-transparent to-transparent" />

        {/* Indikator titik */}
        {menus.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {menus.map((menu, i) => (
              <span
                key={menu.id}
                className={`h-1.5 rounded-full bg-cream-50 transition-all duration-500 ${
                  i === index ? "w-6 opacity-100" : "w-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info menu aktif — fade + slide halus setiap kali menu berganti */}
      <div
        key={active.id}
        className="flex-1 flex flex-col justify-center gap-2 p-6 md:p-8 animate-fade-slide-up"
      >
        <span className="text-xs font-semibold tracking-[0.18em] text-accent-600 uppercase">
          Menu Pilihan Hari Ini
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-coffee-800">
          {active.name}
        </h3>
        <p className="text-lg font-semibold text-accent-600">
          {formatPrice(active.price)}
        </p>
        <p className="text-sm text-coffee-500/90 max-w-sm">
          {active.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          <Button variant="primary" icon={Plus} onClick={() => onAddMenu(active)}>
            Tambah Pesanan
          </Button>
          <Button variant="secondary" withArrow onClick={onSeeMore}>
            Lihat Menu Lainnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

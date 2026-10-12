import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../data/menuData";
import { Plus, Minus, ShoppingBag, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { useMenu } from "../../context/MenuContext";
import { useState } from "react";

/* ─── Kategori filter (dummy — bisa dihubungkan ke field menu.category) ─── */
const CATEGORIES = ["Semua", "Makanan", "Minuman", "Snack"];

const MenuPage = () => {
  const { availableMenus } = useMenu();
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, addToCart, incrementQty, decrementQty } =
    useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const handleAdd = (menu) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    addToCart(menu);
  };

  const getQty = (menuId) =>
    cartItems.find((item) => item.menuId === menuId)?.qty || 0;

  const filtered = availableMenus.filter((m) => {
    const matchSearch = m.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF0CD]">
      {/* ── Header ── */}
      <section
        className="relative bg-[#C48259] overflow-hidden pt-10 pb-20"
        data-nav="light"
      >
        {/* Dekoratif lingkaran */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <p className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase text-white/60 mb-3">
            Catering Harian Terbaik
          </p>
          <h1 className="font-display display-bold text-white text-5xl md:text-7xl leading-none mb-4">
            MENU
          </h1>
          <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed mb-8">
            Pilih menu favoritmu — dimasak segar setiap hari dengan bahan
            pilihan berkualitas.
          </p>

          {/* Search bar */}
          <div className="relative max-w-sm mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C48259]"
            />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-[#181818] placeholder:text-[#181818]/40 rounded-full py-3 pl-10 pr-5 text-sm font-medium focus:outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Wave bawah header */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z"
              fill="#FFF0CD"
            />
          </svg>
        </div>
      </section>

      {/* ── Filter kategori ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-4 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-[#181818] text-white shadow-md"
                  : "bg-white text-[#181818]/70 hover:bg-[#181818]/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid menu ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#181818]/40">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((menu) => {
              const qty = getQty(menu.id);
              return (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  qty={qty}
                  onAdd={() => handleAdd(menu)}
                  onIncrement={() => incrementQty(menu.id)}
                  onDecrement={() => decrementQty(menu.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Card komponen ─────────────────────────────────────────────────── */
const MenuCard = ({ menu, qty, onAdd, onIncrement, onDecrement }) => (
  <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(24,24,24,0.12)] flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-12px_rgba(24,24,24,0.2)]">
    {/* Gambar */}
    <div className="relative overflow-hidden rounded-t-[2rem] bg-[#FFF0CD] h-44">
      <img
        src={menu.image}
        alt={menu.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Badge qty */}
      {qty > 0 && (
        <span className="absolute top-3 right-3 bg-[#C48259] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
          {qty}
        </span>
      )}
    </div>

    {/* Info */}
    <div className="p-5 flex flex-col gap-1 flex-1">
      <h3 className="font-display display-bold text-[#181818] text-lg leading-snug">
        {menu.name}
      </h3>
      <p className="text-[#C48259] font-bold text-sm">{formatPrice(menu.price)}</p>
      <p className="text-[#181818]/50 text-xs leading-relaxed flex-1 line-clamp-2">
        {menu.description}
      </p>

      {/* CTA */}
      <div className="mt-4">
        {qty === 0 ? (
          /* Tambah Pesanan — black-shape button */
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-1.5 rounded-full bg-[#181818]"
            />
            <button
              type="button"
              onClick={onAdd}
              className="relative w-full flex items-center justify-center gap-2 bg-[#C48259] text-white text-sm font-bold rounded-full py-2.5 px-4 border-2 border-[#181818] transition-transform active:translate-y-1"
            >
              <Plus size={15} strokeWidth={2.5} />
              Tambah Pesanan
            </button>
          </div>
        ) : (
          /* Stepper +/− */
          <div className="flex items-center justify-between bg-[#FFF0CD] rounded-full p-1">
            <button
              type="button"
              onClick={onDecrement}
              aria-label={`Kurangi ${menu.name}`}
              className="w-9 h-9 rounded-full bg-white text-[#181818] shadow-sm flex items-center justify-center transition-transform active:scale-90"
            >
              <Minus size={15} strokeWidth={2.5} />
            </button>
            <span className="font-display display-bold text-[#181818] text-base min-w-[1.5rem] text-center">
              {qty}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={`Tambah ${menu.name}`}
              className="w-9 h-9 rounded-full bg-[#C48259] text-white shadow-sm flex items-center justify-center transition-transform active:scale-90"
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default MenuPage;

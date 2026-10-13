import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingBag, Search, X, UtensilsCrossed } from "lucide-react";
import { formatPrice } from "../../data/menuData";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { useMenu } from "../../context/MenuContext";
import { CartPanel } from "../../components/guest/StickyOrderBar";

const ALL = "Semua";

/**
 * Halaman Menu — dirombak total.
 *
 * Susunan:
 *  1. Header ringkas (judul + keterangan)
 *  2. Toolbar menempel (cari + filter kategori) yang ikut turun saat scroll
 *  3. Grid kartu menu di kiri
 *  4. Panel "Pesanan Kamu" menempel di kanan (desktop). Di mobile keranjang
 *     memakai bar mengambang + bottom-sheet dari StickyOrderBar.
 *
 * Semua teks memakai font biasa (Poppins) supaya mudah dibaca.
 */
const MenuPage = () => {
  const { availableMenus } = useMenu();
  const { isAuthenticated } = useAuth();
  const { cartItems, cartCount, addToCart, incrementQty, decrementQty } =
    useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Kategori diambil dari data menu yang tersedia (menu tanpa kategori
  // masuk "Lainnya"), jadi filter selalu cocok dengan isi katalog.
  const categories = useMemo(() => {
    const set = new Set(availableMenus.map((m) => m.category || "Lainnya"));
    return [ALL, ...set];
  }, [availableMenus]);

  // Kalau kategori yang dipilih sudah tidak ada (mis. admin menonaktifkan
  // menunya), otomatis kembali ke "Semua".
  const currentCategory = categories.includes(activeCategory)
    ? activeCategory
    : ALL;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return availableMenus.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q);
      const matchCategory =
        currentCategory === ALL ||
        (m.category || "Lainnya") === currentCategory;
      return matchSearch && matchCategory;
    });
  }, [availableMenus, search, currentCategory]);

  const qtyById = useMemo(() => {
    const map = new Map();
    cartItems.forEach((item) => map.set(item.menuId, item.qty));
    return map;
  }, [cartItems]);

  const handleAdd = (menu) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    addToCart(menu);
  };

  const resetFilters = () => {
    setSearch("");
    setActiveCategory(ALL);
  };

  const hasFilter = search.trim() !== "" || currentCategory !== ALL;

  return (
    <div
      /* Layout induk memberi ruang atas (pt) untuk navbar & ruang bawah (pb)
         untuk bar keranjang. Di sini header dibuat full-bleed sampai atas,
         dan latar halaman dilanjutkan sampai ke footer tanpa garis pemisah. */
      className={`-mt-24 lg:-mt-28 bg-[#FBF8F3] min-h-screen ${
        cartCount > 0 ? "-mb-28 pb-28" : ""
      }`}
    >
      {/* ── Header ── */}
      <section
        data-nav="light"
        className="bg-[#C48259] rounded-b-[2rem] lg:rounded-b-[2.5rem] pt-28 lg:pt-36 pb-10 lg:pb-14"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-white bg-white/20 rounded-full px-3 py-1.5">
            <UtensilsCrossed size={13} />
            Menu Harian
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white leading-tight">
            Pilih menu favoritmu
          </h1>
          <p className="mt-3 text-base text-white/95 max-w-xl leading-relaxed">
            Dimasak segar setiap hari dengan bahan pilihan. Tambahkan ke
            pesanan, lalu lanjut checkout kapan saja.
          </p>
        </div>
      </section>

      {/* ── Toolbar: cari + kategori (menempel di bawah navbar) ── */}
      <div className="sticky top-[68px] lg:top-[76px] z-30 bg-[#FBF8F3]/95 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative w-full md:max-w-xs shrink-0">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#181818]/45 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Cari menu..."
              aria-label="Cari menu"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-[#181818] placeholder:text-[#181818]/45 rounded-xl border border-black/10 py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48259]/50 focus:border-[#C48259]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-[#181818]/50 hover:bg-black/5 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={currentCategory === cat}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentCategory === cat
                      ? "bg-[#181818] text-white"
                      : "bg-white text-[#181818]/75 border border-black/10 hover:bg-black/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <p className="hidden md:block md:ml-auto text-sm text-[#181818]/55 whitespace-nowrap">
            {filtered.length} menu
          </p>
        </div>
      </div>

      {/* ── Isi: grid menu + panel pesanan ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:items-start">
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
              <ShoppingBag size={44} className="mx-auto mb-4 text-[#181818]/25" />
              <p className="font-semibold text-[#181818]">
                {availableMenus.length === 0
                  ? "Belum ada menu yang tersedia"
                  : "Menu tidak ditemukan"}
              </p>
              <p className="text-sm text-[#181818]/55 mt-1">
                {availableMenus.length === 0
                  ? "Silakan cek kembali nanti."
                  : "Coba kata kunci atau kategori lain."}
              </p>
              {hasFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#181818] text-white text-sm font-semibold hover:bg-black transition-colors"
                >
                  Reset pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
              {filtered.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  qty={qtyById.get(menu.id) || 0}
                  onAdd={() => handleAdd(menu)}
                  onIncrement={() => incrementQty(menu.id)}
                  onDecrement={() => decrementQty(menu.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Panel pesanan (desktop) */}
        <aside className="hidden lg:block sticky top-[148px]">
          <div className="flex flex-col max-h-[calc(100vh-10rem)] bg-white rounded-2xl border border-black/5 shadow-[0_12px_40px_-16px_rgba(24,24,24,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <h2 className="text-lg font-bold text-[#181818]">Pesanan Kamu</h2>
              {cartCount > 0 && (
                <span className="min-w-[1.75rem] h-7 px-2 rounded-full bg-[#C48259] text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <CartPanel
              onCheckout={() => navigate("/checkout")}
              className="flex-1 min-h-0"
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ─── Kartu menu ─────────────────────────────────────────────────────── */
const MenuCard = ({ menu, qty, onAdd, onIncrement, onDecrement }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = menu.image && !imgFailed;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_36px_-14px_rgba(24,24,24,0.28)]">
      <div className="relative aspect-[4/3] bg-[#F4EDE0] overflow-hidden">
        {showImage ? (
          <img
            src={menu.image}
            alt={menu.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#C48259]/60">
            <UtensilsCrossed size={36} />
          </div>
        )}

        {menu.isFeatured && (
          <span className="absolute top-3 left-3 bg-white text-[#181818] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Pilihan
          </span>
        )}
        {qty > 0 && (
          <span className="absolute top-3 right-3 bg-[#181818] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {qty} dipesan
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A66432]">
          {menu.category || "Lainnya"}
        </p>
        <h3 className="mt-1 text-base font-semibold text-[#181818] leading-snug">
          {menu.name}
        </h3>
        <p className="mt-1 text-sm text-[#181818]/60 leading-relaxed line-clamp-2 flex-1">
          {menu.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-[#181818] tabular-nums">
            {formatPrice(menu.price)}
          </span>

          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#181818] text-white text-sm font-semibold px-4 py-2.5 hover:bg-black active:scale-95 transition"
            >
              <Plus size={16} strokeWidth={2.5} />
              Tambah
            </button>
          ) : (
            <div className="inline-flex items-center rounded-xl bg-[#C48259] text-white">
              <button
                type="button"
                onClick={onDecrement}
                aria-label={`Kurangi ${menu.name}`}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/10 active:scale-90 transition"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center text-sm font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label={`Tambah ${menu.name}`}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/10 active:scale-90 transition"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuPage;

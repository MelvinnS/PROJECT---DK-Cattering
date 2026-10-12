import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu as MenuIcon,
  X,
  UserRound,
  ShoppingBag,
  ClipboardList,
  History,
  LogOut,
  ShieldCheck,
  Repeat,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import siteConfig from "../../data/siteConfig";

const pillLinks = [
  { label: "Beranda", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Tentang", to: "/#tentang" },
  { label: "Kontak", to: "/#kontak" },
];

const Navbar = () => {
  const { user, isAuthenticated, isMock, logout, switchRole } = useAuth();
  const { cartCount } = useOrder();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const [tone, setTone] = useState("dark"); // warna logo/ikon mengikuti section di bawahnya
  const [hasSection, setHasSection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef(null);

  // Deteksi section di bawah navbar (atribut data-nav="light|dark").
  useEffect(() => {
    let raf;
    const update = () => {
      const x = window.innerWidth < 1024 ? 40 : 90;
      const hit = document
        .elementsFromPoint(x, 36)
        .map((el) => el.closest?.("[data-nav]"))
        .find(Boolean);
      setTone(hit?.dataset.nav === "light" ? "light" : "dark");
      setHasSection(!!hit);
      setScrolled(window.scrollY > 10);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    const t = setTimeout(update, 450); // setelah animasi pindah halaman selesai
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Tutup dropdown saat pindah halaman / klik di luar.
  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (to) => {
    if (to === "/") return pathname === "/" && !hash;
    if (to.startsWith("/#")) return pathname === "/" && hash === to.slice(1);
    return pathname === to;
  };

  const handleSwitchRole = (role) => {
    switchRole(role);
    setAccountOpen(false);
    setMobileOpen(false);
    navigate(role === "ADMIN" ? "/admin" : "/");
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const toneText = tone === "light" ? "text-white" : "text-scoop-ink";
  const showBackdrop = scrolled && !hasSection;

  const accountItems = [
    { label: "Profil Saya", to: "/profile", icon: UserRound },
    { label: "Pesanan", to: "/pesanan", icon: ClipboardList },
    { label: "Riwayat", to: "/riwayat", icon: History },
  ];

  const itemClass =
    "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-scoop-ink hover:bg-scoop-cream/70 transition-colors text-left";

  const renderAccountMenu = () => (
    <>
      {isAuthenticated && (
        <div className="px-4 py-3 border-b border-black/5">
          <p className="font-bold text-sm text-scoop-ink truncate">{user?.fullName}</p>
          <p className="text-[11px] text-scoop-ink/50">
            {user?.role === "ADMIN" ? "Admin" : "Customer"}
          </p>
        </div>
      )}

      {isAuthenticated ? (
        <>
          {accountItems.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} className={itemClass}>
              <Icon size={16} className="text-scoop-ink/60" /> {label}
            </Link>
          ))}
          <div className="border-t border-black/5 my-1" />
          {isMock ? (
            user?.role === "ADMIN" ? (
              <button type="button" onClick={() => handleSwitchRole("CUSTOMER")} className={itemClass}>
                <Repeat size={16} className="text-scoop-green" /> Beralih ke Customer
              </button>
            ) : (
              <button type="button" onClick={() => handleSwitchRole("ADMIN")} className={itemClass}>
                <ShieldCheck size={16} className="text-scoop-green" /> Masuk sebagai Admin
              </button>
            )
          ) : (
            <button type="button" onClick={handleLogout} className={itemClass}>
              <LogOut size={16} className="text-scoop-ink/60" /> Keluar
            </button>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className={itemClass}>
            <UserRound size={16} className="text-scoop-ink/60" /> Masuk
          </Link>
          <Link to="/register" className={itemClass}>
            <ClipboardList size={16} className="text-scoop-ink/60" /> Daftar Sekarang
          </Link>
        </>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        showBackdrop ? "bg-scoop-cream/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]" : ""
      }`}
    >
      <nav className="relative max-w-[1500px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4 lg:py-5">
        {/* Logo */}
        <Link
          to="/"
          className={`font-display text-xl lg:text-2xl leading-none transition-colors duration-300 ${toneText}`}
        >
          {siteConfig.brandFullName}
        </Link>

        {/* Pill navigasi (desktop) */}
        <ul className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          {pillLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`block rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                  isActive(link.to)
                    ? "bg-scoop-ink text-white"
                    : "text-scoop-ink hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Ikon kanan */}
        <div className={`flex items-center gap-4 transition-colors duration-300 ${toneText}`}>
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              aria-label="Menu akun"
              aria-expanded={accountOpen}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/10 transition-colors"
            >
              <UserRound size={22} />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)] py-1"
                >
                  {renderAccountMenu()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            aria-label="Keranjang"
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/10 transition-colors"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Buka menu"
            className="lg:hidden flex items-center justify-center w-9 h-9"
          >
            {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mx-4 mb-3 rounded-3xl bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <ul className="p-2 flex flex-col">
              {pillLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wide ${
                      isActive(link.to) ? "bg-scoop-ink text-white" : "text-scoop-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

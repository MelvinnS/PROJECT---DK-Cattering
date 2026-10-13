import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarClock,
  Users,
  ClipboardList,
  Receipt,
  MessageSquareHeart,
  LogOut,
  Coffee,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import AnimatedOutlet from "../components/common/AnimatedOutlet";
import { useAuth } from "../context/AuthContext";

// Menu sidebar Admin. Sebagian besar route-nya belum dibuat (dikerjakan
// bertahap) — ditandai `soon: true` supaya tetap kelihatan roadmap-nya
// tapi tidak bisa diklik dulu.
const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Kelola Pesanan", to: "/admin/orders", icon: ClipboardList },
  { label: "Kelola Menu", to: "/admin/menu", icon: UtensilsCrossed },
  { label: "Jadwal Pengiriman", to: "/admin/slots", icon: CalendarClock },
  { label: "Kelola Customer", to: "/admin/customers", icon: Users },
  { label: "Laporan Transaksi", to: "/admin/reports", icon: Receipt },
  { label: "Saran & Masukan", to: "/admin/reviews", icon: MessageSquareHeart },
];

// Isi sidebar dipisah jadi komponen sendiri supaya bisa dipakai ulang di
// sidebar statis (desktop) maupun drawer (mobile) tanpa duplikasi markup.
const SidebarContent = ({ user, onNavigate, onLogout, onSwitchToCustomer }) => (
  <>
    <div className="flex items-center gap-2 px-6 py-5 border-b border-cream-50/10 shrink-0">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cream-50 text-coffee-700 shrink-0">
        <Coffee size={18} />
      </span>
      <div className="leading-tight">
        <p className="font-extrabold text-sm">DK CATTERING</p>
        <p className="text-[11px] text-cream-50/60">Admin Panel</p>
      </div>
    </div>

    <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
      {navItems.map(({ label, to, icon: Icon, end, soon }) =>
        soon ? (
          <span
            key={label}
            title="Segera hadir — belum dikerjakan"
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cream-50/35 cursor-not-allowed select-none"
          >
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            <span className="text-[10px] border border-cream-50/20 rounded-full px-2 py-0.5">
              Segera
            </span>
          </span>
        ) : (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cream-50 text-coffee-800"
                  : "text-cream-50/80 hover:bg-coffee-700"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        )
      )}
    </nav>

    <div className="px-3 py-4 border-t border-cream-50/10 flex flex-col gap-1 shrink-0">
      <div className="px-4 py-2 text-xs text-cream-50/60">
        Masuk sebagai
        <p className="text-cream-50 font-semibold text-sm truncate">
          {user?.fullName || "Admin"}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cream-50/80 hover:bg-coffee-700 transition-colors"
      >
        <LogOut size={18} />
        Keluar
      </button>
      {onSwitchToCustomer && (
        <button
          onClick={onSwitchToCustomer}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cream-50/80 hover:bg-coffee-700 transition-colors"
        >
          ⇄ Beralih ke Customer
        </button>
      )}
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cream-50/60 hover:bg-coffee-700 transition-colors"
      >
        ← Kembali ke Beranda
      </Link>
    </div>
  </>
);

const AdminLayout = () => {
  const { user, logout, isMock, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mode mock (backend diputus): pindah role ke Customer tanpa login ulang.
  const handleSwitchToCustomer = () => {
    switchRole("CUSTOMER");
    navigate("/");
  };
  const switchProp = isMock ? handleSwitchToCustomer : undefined;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream-50">
      {/* Top bar — mobile & tablet saja, jadi hamburger untuk buka sidebar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-coffee-800 text-cream-50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cream-50 text-coffee-700">
            <Coffee size={16} />
          </span>
          <p className="font-extrabold text-sm">DK CATTERING</p>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Buka menu navigasi"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-coffee-700 transition-colors"
        >
          <MenuIcon size={20} />
        </button>
      </header>

      {/* Sidebar — statis, hanya tampil di desktop (md ke atas) */}
      <aside className="hidden md:flex md:w-64 shrink-0 bg-coffee-800 text-cream-50 flex-col">
        <SidebarContent user={user} onLogout={handleLogout} onSwitchToCustomer={switchProp} />
      </aside>

      {/* Sidebar — drawer geser dari kiri, khusus mobile/tablet */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-0 z-50 bg-coffee-900/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="md:hidden fixed inset-y-0 left-0 z-[60] w-72 max-w-[80%] bg-coffee-800 text-cream-50 flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex justify-end px-3 pt-3 shrink-0">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Tutup menu navigasi"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-coffee-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent
                user={user}
                onNavigate={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                onSwitchToCustomer={switchProp}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          <AnimatedOutlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

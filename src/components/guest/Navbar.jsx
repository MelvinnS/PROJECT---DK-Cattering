import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

// Nav sama untuk Guest & Customer. "Pesanan" & "Riwayat" dilindungi
// ProtectedRoute di routes/AppRoutes.jsx — Guest yang klik otomatis
// diarahkan ke /login, Customer langsung ke halamannya.
const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Pesanan", to: "/pesanan" },
  { label: "Riwayat", to: "/riwayat" },
  { label: "Kontak", to: "#" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const initials = (user?.fullName || "U")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-cream-50/95 backdrop-blur-sm sticky top-0 z-40 border-b border-coffee-100/50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
        <Logo />

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-coffee-700">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition-colors ${
                    isActive
                      ? "border-accent-500 text-coffee-800"
                      : "border-transparent hover:text-coffee-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-coffee-700 hover:text-coffee-900"
              >
                <span className="w-7 h-7 rounded-full bg-coffee-700 text-cream-50 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                Halo, {user.fullName?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-coffee-300 text-coffee-700 text-sm font-semibold hover:bg-coffee-50 transition-colors"
              >
                Keluar <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-coffee-300 text-coffee-700 text-sm font-semibold hover:bg-coffee-50 transition-colors"
              >
                Masuk <UserRound size={16} />
              </Link>
              <Link to="/register">
                <Button variant="primary" className="!py-2.5 !px-5">
                  Daftar Sekarang
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-coffee-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-cream-50 border-t border-coffee-100">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-coffee-700 font-medium py-1"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-medium text-coffee-700"
                >
                  Halo, {user.fullName?.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-center px-5 py-2.5 rounded-full border border-coffee-300 text-coffee-700 text-sm font-semibold"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-5 py-2.5 rounded-full border border-coffee-300 text-coffee-700 text-sm font-semibold"
                >
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Daftar Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

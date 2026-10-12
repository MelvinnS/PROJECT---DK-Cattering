import { useLocation, useOutlet, matchPath } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Peta pathname → label halaman yang ditampilkan di layar hitam
const PAGE_LABELS = {
  "/": "HOME",
  "/menu": "MENU",
  "/checkout": "CHECKOUT",
  "/login": "MASUK",
  "/register": "DAFTAR",
  "/profile": "PROFIL",
  "/pesanan": "PESANAN",
  "/riwayat": "RIWAYAT",
};

const getLabel = (pathname) => {
  for (const [pattern, label] of Object.entries(PAGE_LABELS)) {
    if (matchPath({ path: pattern, end: true }, pathname)) return label;
  }
  return "";
};

/**
 * Transisi "gorden hitam" — layar hitam muncul dari kanan ke kiri (curtain in),
 * sebentar menampilkan nama halaman di tengah, lalu menyapu ke kiri keluar
 * (curtain out). Navbar/Footer yang ada di layout tidak ikut ter-animasi.
 */
const CurtainTransition = ({ label, onMidpoint }) => {
  const calledRef = useRef(false);

  // Panggil onMidpoint tepat saat layar hitam sudah menutup penuh (0.5 s)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onMidpoint?.();
      }
    }, 480);
    return () => clearTimeout(t);
  }, [onMidpoint]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#181818] flex items-center justify-center pointer-events-none"
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      exit={{ clipPath: "inset(0 0 0 100%)" }}
      transition={{
        duration: 0.55,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {/* Nama halaman tujuan */}
      <motion.span
        className="font-display display-bold text-white text-4xl md:text-6xl tracking-[0.12em] select-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.22 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();

  // Simpan elemen "sebelumnya" untuk ditampilkan selama curtain masuk
  const [displayedElement, setDisplayedElement] = useState(element);
  const [displayedKey, setDisplayedKey] = useState(location.pathname);
  const [curtainVisible, setCurtainVisible] = useState(false);
  const [pendingElement, setPendingElement] = useState(null);
  const [pendingKey, setPendingKey] = useState(null);
  const [curtainLabel, setCurtainLabel] = useState("");

  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;

    // Mulai transisi: tampilkan gorden
    setCurtainLabel(getLabel(location.pathname));
    setPendingElement(element);
    setPendingKey(location.pathname);
    setCurtainVisible(true);
    prevPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleMidpoint = () => {
    // Saat gorden sudah menutup penuh → tukar konten halaman
    setDisplayedElement(pendingElement);
    setDisplayedKey(pendingKey);
  };

  const handleCurtainExitComplete = () => {
    setCurtainVisible(false);
  };

  return (
    <>
      {/* Konten halaman (tidak bergerak, hanya ditukar saat midpoint) */}
      <div key={displayedKey}>{displayedElement}</div>

      {/* Gorden hitam */}
      <AnimatePresence onExitComplete={handleCurtainExitComplete}>
        {curtainVisible && (
          <CurtainTransition
            key="curtain"
            label={curtainLabel}
            onMidpoint={handleMidpoint}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedOutlet;

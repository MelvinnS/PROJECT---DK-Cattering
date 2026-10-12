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

// Durasi (ms). Seluruh urutan DIJALANKAN LEWAT TIMER, bukan menunggu callback
// animasi — jadi gorden dijamin selalu menutup lalu terbuka lagi dan halaman
// tidak mungkin "nyangkut".
const CURTAIN_IN = 480; // gorden menutup penuh → konten ditukar
const LABEL_HOLD = 220; // jeda singkat menampilkan nama halaman
const CURTAIN_OUT = 480; // lama animasi gorden keluar

/**
 * Gorden hitam — murni tampilan. Masuk dari kanan, keluar ke kiri.
 */
const CurtainTransition = ({ label }) => (
  <motion.div
    className="fixed inset-0 z-[200] bg-[#181818] flex items-center justify-center pointer-events-none"
    initial={{ clipPath: "inset(0 100% 0 0)" }}
    animate={{ clipPath: "inset(0 0% 0 0)" }}
    exit={{ clipPath: "inset(0 0 0 100%)" }}
    transition={{ duration: CURTAIN_IN / 1000, ease: [0.76, 0, 0.24, 1] }}
  >
    <motion.span
      className="font-display display-bold text-white text-4xl md:text-6xl tracking-[0.12em] select-none"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.2 }}
    >
      {label}
    </motion.span>
  </motion.div>
);

const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();

  // Path yang kontennya sedang benar-benar tampil di layar.
  const [settledPath, setSettledPath] = useState(location.pathname);
  // Info gorden (null = gorden tidak tampil).
  const [curtain, setCurtain] = useState(null);

  // Elemen halaman terakhir yang tampil penuh — dipertahankan selama gorden
  // masih menutup supaya halaman lama tidak "berkedip" jadi halaman baru.
  const snapshotRef = useRef(element);
  const timersRef = useRef([]);
  const prevPathRef = useRef(location.pathname);
  const hashRef = useRef(location.hash);
  hashRef.current = location.hash;

  const inSync = settledPath === location.pathname;
  if (inSync) snapshotRef.current = element;
  const content = inSync ? element : snapshotRef.current;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    // Pindah halaman (path berubah) → jalankan urutan gorden. Kalau user
    // pindah lagi saat gorden masih berjalan, urutan di-restart ke tujuan baru.
    if (prevPathRef.current === location.pathname) return undefined;
    prevPathRef.current = location.pathname;

    const target = location.pathname;
    clearTimers();
    setCurtain({ label: getLabel(target) });

    // 1) Gorden sudah menutup penuh → tukar konten, reset scroll.
    timersRef.current.push(
      setTimeout(() => {
        setSettledPath(target);
        const hash = hashRef.current;
        if (hash) {
          // Tunggu konten baru ter-render dulu sebelum scroll ke anchor.
          requestAnimationFrame(() => {
            const el = document.getElementById(hash.slice(1));
            if (el) el.scrollIntoView();
            else window.scrollTo(0, 0);
          });
        } else {
          window.scrollTo(0, 0);
        }
        // Beri tahu Navbar (dengar event resize) agar warna logo menyesuaikan
        // halaman yang baru tampil.
        requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
      }, CURTAIN_IN)
    );

    // 2) Tahan sebentar, lalu buka gorden (animasi exit dijalankan
    //    AnimatePresence begitu `curtain` jadi null).
    timersRef.current.push(
      setTimeout(() => setCurtain(null), CURTAIN_IN + LABEL_HOLD)
    );

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Bersihkan timer saat layout di-unmount.
  useEffect(() => clearTimers, []);

  // Setelah gorden terbuka, pastikan Navbar sinkron lagi.
  useEffect(() => {
    if (curtain) return undefined;
    const t = setTimeout(
      () => window.dispatchEvent(new Event("resize")),
      CURTAIN_OUT
    );
    return () => clearTimeout(t);
  }, [curtain]);

  return (
    <>
      <div key={settledPath}>{content}</div>

      <AnimatePresence>
        {curtain && <CurtainTransition key="curtain" label={curtain.label} />}
      </AnimatePresence>
    </>
  );
};

export default AnimatedOutlet;

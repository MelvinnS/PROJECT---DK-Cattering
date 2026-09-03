import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Transisi halaman: geser + sedikit scale, TANPA fade (opacity tetap 1).
const pageVariants = {
  initial: { x: 48, scale: 0.98 },
  animate: { x: 0, scale: 1 },
  exit: { x: -48, scale: 0.98 },
};

const pageTransition = {
  duration: 0.38,
  ease: [0.4, 0, 0.2, 1],
};

/**
 * Pengganti <Outlet /> di dalam layout (Guest/Customer/Admin) supaya konten
 * halaman berpindah dengan animasi halus, sementara Navbar/Footer di layout
 * tetap diam (tidak ikut ter-animasi).
 */
const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;

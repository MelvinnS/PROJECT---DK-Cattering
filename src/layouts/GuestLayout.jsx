import Navbar from "../components/guest/Navbar";
import Footer from "../components/guest/Footer";
import AnimatedOutlet from "../components/common/AnimatedOutlet";
import StickyOrderBar from "../components/guest/StickyOrderBar";
import { useOrder } from "../context/OrderContext";
import { useLocation } from "react-router-dom";

const GuestLayout = () => {
  const { cartCount } = useOrder();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const barVisible = cartCount > 0 && location.pathname !== "/checkout";

  return (
    <div
      className={`min-h-screen flex flex-col overflow-x-clip ${
        isLanding ? "bg-scoop-cream" : "bg-cream-50"
      }`}
    >
      <Navbar />
      {/* Navbar bersifat fixed (melayang di atas hero), jadi halaman lain
          diberi ruang di atas. Beranda justru full-bleed sampai ke atas. */}
      <main className={`flex-1 ${isLanding ? "" : "pt-24 lg:pt-28"} ${barVisible ? "pb-28" : ""}`}>
        <AnimatedOutlet />
      </main>
      <Footer />
      <StickyOrderBar />
    </div>
  );
};

export default GuestLayout;

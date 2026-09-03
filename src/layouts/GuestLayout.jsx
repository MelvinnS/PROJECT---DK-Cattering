import Navbar from "../components/guest/Navbar";
import Footer from "../components/guest/Footer";
import AnimatedOutlet from "../components/common/AnimatedOutlet";
import StickyOrderBar from "../components/guest/StickyOrderBar";
import { useOrder } from "../context/OrderContext";
import { useLocation } from "react-router-dom";

const GuestLayout = () => {
  const { cartCount } = useOrder();
  const location = useLocation();
  const barVisible = cartCount > 0 && location.pathname !== "/checkout";

  return (
    <div className={`min-h-screen flex flex-col bg-cream-50 ${barVisible ? "pb-24" : ""}`}>
      <Navbar />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
      <StickyOrderBar />
    </div>
  );
};

export default GuestLayout;

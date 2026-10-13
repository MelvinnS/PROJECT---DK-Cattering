import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";
import Button from "../../components/common/Button";

const CheckoutPage = () => {
  const { cartItems, cartTotal, placeOrder } = useOrder();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Belum terhubung payment gateway beneran — ini simulasi supaya alur
  // Checkout -> Pesanan bisa dites di frontend. Nanti tinggal ganti
  // handlePay() dengan panggilan API payment yang sesungguhnya.
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await placeOrder();
      navigate("/pesanan");
    } catch (err) {
      alert("Gagal memproses pesanan: " + (err.message || "Silakan coba lagi"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-coffee-800 mb-2">
          Keranjang kosong
        </h1>
        <p className="text-coffee-500/80 mb-6">
          Belum ada menu yang ditambahkan. Yuk pilih menu favoritmu dulu.
        </p>
        <Button variant="primary" onClick={() => navigate("/menu")}>
          Lihat Menu
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-coffee-800 mb-2">
        Checkout
      </h1>
      <p className="text-coffee-500/90 mb-8">
        Periksa kembali pesananmu sebelum melanjutkan pembayaran.
      </p>

      <div className="bg-white border border-coffee-100/60 rounded-[1.75rem] p-6 md:p-8 shadow-[0_24px_60px_-24px_rgba(42,33,24,0.28)]">
        <h2 className="font-bold text-coffee-800 mb-4">Ringkasan Pesanan</h2>

        <div className="flex flex-col gap-3 mb-6">
          {cartItems.map((item) => (
            <div key={item.uid} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cream-100 text-accent-600">
                  <ShoppingBag size={16} />
                </span>
                <div>
                  <p className="font-medium text-coffee-800">{item.name}</p>
                  <p className="text-xs text-coffee-500/70">Qty {item.qty}</p>
                </div>
              </div>
              <p className="font-semibold text-coffee-700">
                {formatCurrency(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-coffee-200 pt-4 flex items-center justify-between">
          <p className="font-bold text-coffee-800">Total</p>
          <p className="font-extrabold text-xl text-coffee-800">
            {formatCurrency(cartTotal)}
          </p>
        </div>

        <Button
          variant="primary"
          icon={isProcessing ? Loader2 : CreditCard}
          className={`mt-6 w-full ${isProcessing ? "[&_svg]:animate-spin" : ""}`}
          onClick={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? "Memproses Pembayaran..." : "Bayar Sekarang"}
        </Button>

        <p className="text-xs text-center text-coffee-400 mt-3">
          Setelah pembayaran, pesananmu akan dikonfirmasi oleh Admin. Kamu bisa
          pantau progresnya di halaman Pesanan.
        </p>
      </div>
    </section>
  );
};

export default CheckoutPage;

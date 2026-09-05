import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";
import Button from "../../components/common/Button";

const CheckoutPage = () => {
  const { cartItems, cartTotal, placeOrder } = useOrder();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [paymentType, setPaymentType] = useState("qris");

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    setCheckoutError(null);
    try {
      const result = await placeOrder({ paymentType });
      if (result) {
        // Redirect ke halaman pesanan setelah checkout berhasil
        navigate("/pesanan", {
          state: {
            checkoutSuccess: true,
            orderNumber: result.orderNumber,
            louvinPayment: result.louvinPayment,
          },
        });
      }
    } catch (err) {
      console.error("Checkout gagal:", err);
      setCheckoutError(err.message ?? "Checkout gagal. Silakan coba lagi.");
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

        <div className="border-t border-coffee-200 pt-4 flex items-center justify-between mb-6">
          <p className="font-bold text-coffee-800">Total</p>
          <p className="font-extrabold text-xl text-coffee-800">
            {formatCurrency(cartTotal)}
          </p>
        </div>

        {/* Pilih Metode Pembayaran */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-coffee-700 mb-2">Metode Pembayaran</p>
          <div className="flex gap-2 flex-wrap">
            {["qris", "gopay", "shopeepay", "bni_va", "bri_va"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentType(method)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  paymentType === method
                    ? "bg-accent-600 text-white border-accent-600"
                    : "bg-white text-coffee-700 border-coffee-200 hover:border-coffee-400"
                }`}
              >
                {method.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {checkoutError && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {checkoutError}
          </div>
        )}

        <Button
          variant="primary"
          icon={isProcessing ? Loader2 : CreditCard}
          className={`w-full ${isProcessing ? "[&_svg]:animate-spin" : ""}`}
          onClick={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? "Memproses Pembayaran..." : "Bayar Sekarang"}
        </Button>

        <p className="text-xs text-center text-coffee-400 mt-3">
          Setelah pembayaran, pesananmu akan dikonfirmasi oleh Admin. Kamu bisa
          pantau progresnya di halaman Pesanan.
        </p>

        <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3">
          <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          Slot pengiriman dan metode pengiriman akan dipilih secara otomatis (slot pertama aktif, PICKUP).
          Untuk DELIVERY, tambahkan alamat di profil terlebih dahulu.
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;

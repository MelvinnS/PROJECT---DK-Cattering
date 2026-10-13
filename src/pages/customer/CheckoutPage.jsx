import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Loader2,
  ShoppingBag,
  AlertCircle,
  Truck,
  Store,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { getAddresses } from "../../services/userService";
import { getSlots } from "../../services/adminSlotService";
import { formatCurrency } from "../../utils/formatters";
import Button from "../../components/common/Button";

const CheckoutPage = () => {
  const { cartItems, cartTotal, placeOrder } = useOrder();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [paymentType, setPaymentType] = useState("qris");
  const [deliveryMethod, setDeliveryMethod] = useState("PICKUP");
  const [notes, setNotes] = useState("");

  // Alamat & Slot
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingMeta(true);
    Promise.all([
      getAddresses().catch(() => []),
      getSlots().catch(() => []),
    ]).then(([addrData, slotData]) => {
      if (!isMounted) return;
      const addrList = Array.isArray(addrData) ? addrData : addrData?.data ?? [];
      const slotList = (Array.isArray(slotData) ? slotData : slotData?.data ?? []).filter(
        (s) => s.isActive !== false
      );

      setAddresses(addrList);
      if (addrList.length > 0) {
        const primary = addrList.find((a) => a.isPrimary) || addrList[0];
        setSelectedAddressId(primary.id);
      }

      setSlots(slotList);
      if (slotList.length > 0) {
        setSelectedSlotId(slotList[0].id);
      }
    }).finally(() => {
      if (isMounted) setIsLoadingMeta(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    if (deliveryMethod === "DELIVERY" && !selectedAddressId) {
      setCheckoutError("Pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    setIsProcessing(true);
    setCheckoutError(null);
    try {
      const result = await placeOrder({
        paymentType,
        deliveryMethod,
        addressId: deliveryMethod === "DELIVERY" ? selectedAddressId : undefined,
        slotId: selectedSlotId || undefined,
        notes: notes.trim() || undefined,
      });
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

        <div className="border-t border-coffee-200 pt-4 flex items-center justify-between mb-8">
          <p className="font-bold text-coffee-800">Total Harga Menu</p>
          <p className="font-extrabold text-xl text-accent-700">
            {formatCurrency(cartTotal)}
          </p>
        </div>

        {/* 1. Metode Pengiriman */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-coffee-800 mb-2.5">
            Pilih Metode Pengambilan
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod("PICKUP")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                deliveryMethod === "PICKUP"
                  ? "bg-accent-600 text-white border-accent-600 shadow-sm"
                  : "bg-cream-50/60 text-coffee-700 border-coffee-200 hover:border-coffee-400"
              }`}
            >
              <Store size={16} /> Ambil Sendiri (Pickup)
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod("DELIVERY")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                deliveryMethod === "DELIVERY"
                  ? "bg-accent-600 text-white border-accent-600 shadow-sm"
                  : "bg-cream-50/60 text-coffee-700 border-coffee-200 hover:border-coffee-400"
              }`}
            >
              <Truck size={16} /> Antar ke Alamat (Delivery)
            </button>
          </div>
        </div>

        {/* 2. Pilih Alamat (hanya jika DELIVERY) */}
        {deliveryMethod === "DELIVERY" && (
          <div className="mb-6 bg-cream-50/50 rounded-2xl p-4 border border-coffee-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-coffee-800 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={14} className="text-accent-600" /> Alamat Pengantaran
              </p>
              <Link
                to="/profile"
                className="text-xs text-accent-600 hover:underline font-semibold"
              >
                + Kelola Alamat
              </Link>
            </div>

            {isLoadingMeta ? (
              <div className="py-3 text-center text-xs text-coffee-400">
                Memuat alamat...
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                Kamu belum memiliki alamat tersimpan. Silakan{" "}
                <Link to="/profile" className="underline font-bold">
                  tambahkan alamat di profil
                </Link>{" "}
                terlebih dahulu untuk pesanan Delivery.
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "bg-white border-accent-500 shadow-xs ring-1 ring-accent-500"
                        : "bg-white/60 border-coffee-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5 text-accent-600"
                    />
                    <div className="text-xs flex-1">
                      <div className="font-bold text-coffee-800 flex items-center gap-1.5">
                        {addr.label}
                        {addr.isPrimary && (
                          <span className="text-[10px] bg-accent-100 text-accent-700 font-semibold px-1.5 py-0.2 rounded">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="text-coffee-600 mt-0.5">{addr.fullAddress}</p>
                      {addr.note && (
                        <p className="text-coffee-400 text-[11px] italic mt-0.5">
                          Ket: {addr.note}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Slot Waktu */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-coffee-800 mb-2 flex items-center gap-1.5">
            <Clock size={15} className="text-accent-600" /> Slot Waktu
          </p>
          {slots.length === 0 ? (
            <p className="text-xs text-coffee-400">Memuat slot waktu...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`py-2 px-3 rounded-xl text-left border text-xs transition-all ${
                    selectedSlotId === slot.id
                      ? "bg-accent-50 border-accent-600 text-accent-800 font-bold"
                      : "bg-cream-50/40 border-coffee-200 text-coffee-700 hover:bg-white"
                  }`}
                >
                  <p className="font-semibold">{slot.name}</p>
                  <p className="text-[11px] opacity-80">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Catatan Khusus */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-coffee-800 mb-1.5 flex items-center gap-1.5">
            <FileText size={15} className="text-accent-600" /> Catatan Pesanan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Misal: Tanpa pedas, saus dipisah..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-cream-50/60 border border-coffee-200 rounded-xl px-3.5 py-2 text-xs text-coffee-800 outline-none focus:border-accent-500 focus:bg-white transition-colors"
          />
        </div>

        {/* 5. Pilih Metode Pembayaran */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-coffee-800 mb-2">
            Metode Pembayaran
          </p>
          <div className="flex gap-2 flex-wrap">
            {["qris", "gopay", "shopeepay", "bni_va", "bri_va"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentType(method)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  paymentType === method
                    ? "bg-accent-600 text-white border-accent-600 shadow-xs"
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
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{checkoutError}</span>
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
          Pesananmu akan langsung diteruskan ke tim Dapur & Driver setelah pembayaran terkonfirmasi.
        </p>
      </div>
    </section>
  );
};

export default CheckoutPage;


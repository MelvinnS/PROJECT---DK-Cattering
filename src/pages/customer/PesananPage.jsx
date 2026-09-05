import { useEffect } from "react";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";

const PesananPage = () => {
  const {
    activeOrders,
    isLoadingOrders,
    ordersError,
    fetchOrders,
    orderStatusLabel,
    orderStatusColor,
  } = useOrder();

  useEffect(() => {
    // Fetch pesanan aktif saat halaman dibuka
    fetchOrders({ status: "PAID,IN_KITCHEN,ON_DELIVERY,DELIVERED,PENDING_PAYMENT" });
  }, [fetchOrders]);

  return (
    <section className="max-w-4xl mx-auto px-6 lg:px-10 py-14">
      <h1 className="text-3xl md:text-4xl font-extrabold text-coffee-800 mb-2">
        Pesanan Saya
      </h1>
      <p className="text-coffee-500/90 mb-10 max-w-xl">
        Pantau progres pesanan yang sedang berjalan — mulai dari menunggu
        konfirmasi admin sampai diantar ke alamatmu.
      </p>

      {isLoadingOrders ? (
        <div className="flex items-center justify-center gap-3 py-16 text-coffee-500/70">
          <Loader2 size={24} className="animate-spin text-accent-600" />
          <span>Memuat pesanan...</span>
        </div>
      ) : ordersError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle size={28} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">Gagal memuat pesanan</p>
          <p className="text-red-400 text-sm mt-1">{ordersError}</p>
          <button
            onClick={() => fetchOrders({ status: "PAID,IN_KITCHEN,ON_DELIVERY,DELIVERED,PENDING_PAYMENT" })}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="bg-white border border-coffee-100/60 rounded-2xl p-10 text-center text-coffee-500/70">
          Belum ada pesanan yang sedang berjalan. Yuk pilih menu favoritmu dulu!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-coffee-100/60 rounded-2xl p-5 shadow-[0_12px_30px_-18px_rgba(42,33,24,0.3)] flex items-start gap-4"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-cream-100 text-accent-600 shrink-0">
                <Package size={20} />
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-coffee-800">
                    {order.orderNumber ?? order.id}
                  </p>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      orderStatusColor[order.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {orderStatusLabel[order.status] ?? order.status}
                  </span>
                </div>
                <p className="text-sm text-coffee-500/80 mt-1">
                  {order.items
                    ?.map((it) => `${it.menu?.name ?? it.name} ×${it.quantity ?? it.qty}`)
                    .join(", ")}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-coffee-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : order.date}
                  </p>
                  <p className="font-semibold text-coffee-700">
                    {formatCurrency(order.totalPrice ?? order.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PesananPage;

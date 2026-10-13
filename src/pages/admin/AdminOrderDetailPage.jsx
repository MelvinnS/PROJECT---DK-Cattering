import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useAdminOrders } from "../../context/AdminOrderContext";
import { orderStatusColor as dummyOrderStatusColor, orderStatusLabel as dummyOrderStatusLabel } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";
import RejectOrderModal from "../../components/admin/RejectOrderModal";
import OrderReceiptPrint from "../../components/admin/OrderReceiptPrint";

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { getOrderById, updateOrderStatus, rejectOrder } = useAdminOrders();

  const [order, setOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingOrder(true);
    getOrderById(id).then((data) => {
      if (isMounted) {
        setOrder(data);
        setIsLoadingOrder(false);
      }
    });
    return () => { isMounted = false; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3 text-coffee-500/70">
        <Loader2 size={24} className="animate-spin text-accent-600" />
        <span>Memuat detail pesanan...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white rounded-3xl border border-coffee-100">
        <AlertTriangle size={48} className="text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-coffee-800">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm text-coffee-500/80 mt-1 max-w-sm">
          Pesanan dengan nomor <strong>#{id}</strong> tidak ditemukan dalam sistem.
        </p>
        <Link
          to="/admin/orders"
          className="mt-5 inline-flex items-center gap-2 bg-coffee-800 hover:bg-coffee-900 text-cream-50 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Kelola Pesanan
        </Link>
      </div>
    );
  }

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleConfirmReject = (_, reason) => {
    rejectOrder(order.id, reason);
  };

  const formattedOrderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDeliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const waPhone = order.customerPhone?.replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Area Print Khusus (Hanya muncul saat dicetak lewat CSS @media print) */}
      <div className="hidden print:block">
        <OrderReceiptPrint order={order} />
      </div>

      {/* Breadcrumb & Navigation (Disembunyikan saat print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-coffee-100/60">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-coffee-600 hover:text-coffee-800 transition-colors"
        >
          <ArrowLeft size={18} /> Kembali ke Kelola Pesanan
        </Link>

        {/* Tombol Cetak Struk */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="inline-flex items-center gap-2 bg-white hover:bg-cream-100/80 text-coffee-800 border border-coffee-200/80 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-sm transition-colors active:scale-95"
          >
            <Printer size={16} className="text-coffee-600" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Order Header & Status Badge (Disembunyikan saat print) */}
      <div className="no-print bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-extrabold text-xl sm:text-2xl text-coffee-800">
              {order.id}
            </span>
            <span className="text-xs font-bold bg-accent-100 text-accent-800 px-2.5 py-1 rounded-md border border-accent-200">
              {order.customerId}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-coffee-400">
            Dibuat pada {formattedOrderDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-coffee-400">Status Pesanan Saat Ini</p>
            <p className="text-sm font-bold text-coffee-800">
              {dummyOrderStatusLabel[order.status] || order.status}
            </p>
          </div>
          <span
            className={`inline-flex items-center text-xs sm:text-sm font-bold px-4 py-2 rounded-full border ${
              dummyOrderStatusColor[order.status] || "bg-coffee-100 text-coffee-700"
            }`}
          >
            {dummyOrderStatusLabel[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Box Penolakan jika Status Dibatalkan */}
      {order.status === "CANCELLED" && order.rejectionReason && (
        <div className="no-print bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-red-800">
          <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Pesanan Dibatalkan / Ditolak</p>
            <p className="text-xs sm:text-sm text-red-700 mt-1">
              <span className="font-semibold">Alasan Penolakan: </span>
              {order.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Konten Utama Grid (Disembunyikan saat print) */}
      <div className="no-print grid lg:grid-cols-3 gap-5 md:gap-6 items-start">
        {/* Kolom Kiri: Detail Menu & Pengiriman */}
        <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
          {/* Card 1: Rincian Item Pesanan */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6">
            <h3 className="font-extrabold text-base sm:text-lg text-coffee-800 mb-4 pb-3 border-b border-coffee-100/60">
              Daftar Menu yang Dipesan
            </h3>

            <div className="divide-y divide-coffee-100/60">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-coffee-800 text-sm sm:text-base">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-coffee-500 mt-1">
                      <span>Harga: {formatCurrency(item.price)}</span>
                      <span>•</span>
                      <span className="font-semibold text-coffee-700">
                        Qty: {item.qty} porsi
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs bg-cream-50 text-coffee-600 px-2.5 py-1 rounded-lg border border-coffee-100/80 inline-block mt-2">
                        <span className="font-semibold">Catatan:</span> {item.notes}
                      </p>
                    )}
                  </div>
                  <p className="font-extrabold text-coffee-800 text-sm sm:text-base shrink-0">
                    {formatCurrency(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtotal & Total Breakdown */}
            <div className="mt-5 pt-4 border-t border-coffee-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-coffee-600">
                <span>Subtotal Menu</span>
                <span className="font-medium text-coffee-800">
                  {formatCurrency(order.subtotal || order.totalPrice)}
                </span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-coffee-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-medium text-coffee-800">
                    {formatCurrency(order.deliveryFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-black text-coffee-900 pt-3 border-t border-coffee-200">
                <span>Total Pembayaran</span>
                <span className="text-accent-700">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Jadwal & Alamat Pengantaran */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-base sm:text-lg text-coffee-800 pb-3 border-b border-coffee-100/60">
              Informasi Pengiriman & Alamat
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-cream-50/70 rounded-2xl p-4 border border-coffee-100/80">
                <div className="flex items-center gap-2 text-coffee-500 text-xs font-semibold uppercase mb-1.5">
                  <Calendar size={14} className="text-accent-600" />
                  Tanggal Pengiriman
                </div>
                <p className="font-bold text-sm sm:text-base text-coffee-800">
                  {formattedDeliveryDate}
                </p>
              </div>

              <div className="bg-cream-50/70 rounded-2xl p-4 border border-coffee-100/80">
                <div className="flex items-center gap-2 text-coffee-500 text-xs font-semibold uppercase mb-1.5">
                  <Clock size={14} className="text-accent-600" />
                  Slot Waktu Pengiriman
                </div>
                <p className="font-bold text-sm sm:text-base text-coffee-800">
                  {order.deliverySlot}
                </p>
              </div>
            </div>

            <div className="bg-cream-50/70 rounded-2xl p-4 border border-coffee-100/80">
              <div className="flex items-center gap-2 text-coffee-500 text-xs font-semibold uppercase mb-1.5">
                <MapPin size={14} className="text-accent-600" />
                Alamat Lengkap Pengantaran
              </div>
              <p className="font-semibold text-sm text-coffee-800 leading-relaxed">
                {order.deliveryAddress}
              </p>
            </div>

            {order.notes && (
              <div className="bg-cream-50/70 rounded-2xl p-4 border border-coffee-100/80">
                <div className="flex items-center gap-2 text-coffee-500 text-xs font-semibold uppercase mb-1.5">
                  <FileText size={14} className="text-accent-600" />
                  Catatan Khusus dari Customer
                </div>
                <p className="text-xs sm:text-sm text-coffee-700 italic">
                  "{order.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Info Customer & Aksi Kontrol Status */}
        <div className="flex flex-col gap-5 md:gap-6">
          {/* Card Customer Info */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-base sm:text-lg text-coffee-800 pb-3 border-b border-coffee-100/60">
              Identitas Pelanggan
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-800 flex items-center justify-center font-black text-sm shrink-0 border border-accent-200">
                {order.customerId}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-coffee-800 text-base truncate">
                  {order.customerName}
                </p>
                <p className="text-xs text-coffee-400">ID Customer: {order.customerId}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-coffee-700 border-t border-coffee-100/60">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-coffee-500">
                  <Phone size={14} /> Telepon:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-coffee-800">{order.customerPhone}</span>
                  {waPhone && (
                    <a
                      href={`https://wa.me/62${waPhone.startsWith("0") ? waPhone.slice(1) : waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                      title="Chat WhatsApp Customer"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}
                </div>
              </div>

              {order.customerEmail && (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-coffee-500">
                    <Mail size={14} /> Email:
                  </span>
                  <span className="font-semibold text-coffee-800 truncate max-w-[170px]">
                    {order.customerEmail}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-coffee-500">
                  <CreditCard size={14} /> Pembayaran:
                </span>
                <span className="font-semibold text-coffee-800">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Card Aksi Kontrol Status */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex flex-col gap-4">
            <h3 className="font-extrabold text-base sm:text-lg text-coffee-800 pb-3 border-b border-coffee-100/60">
              Alur & Aksi Pesanan
            </h3>

            <p className="text-xs text-coffee-500">
              Ubah status pesanan sesuai tahapan operasional catering saat ini:
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Tombol Terima (jika masih PAID) */}
              {order.status === "PAID" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("IN_KITCHEN")}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 size={18} />
                  Terima & Mulai Masak
                </button>
              )}

              {/* Tombol Mulai Kirim (jika IN_KITCHEN) */}
              {order.status === "IN_KITCHEN" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("ON_DELIVERY")}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <Truck size={18} />
                  Mulai Pengantaran
                </button>
              )}

              {/* Tombol Selesaikan (jika ON_DELIVERY) */}
              {order.status === "ON_DELIVERY" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("DELIVERED")}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 size={18} />
                  Selesaikan Pesanan (Terkirim)
                </button>
              )}

              {/* Tombol Status Selesai Info */}
              {["DELIVERED", "COMPLETED"].includes(order.status) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-xs font-bold text-green-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> Pesanan Telah Selesai
                </div>
              )}

              {/* Tombol Tolak Pesanan (bisa kapan saja jika belum selesai) */}
              {order.status !== "CANCELLED" && !["DELIVERED", "COMPLETED"].includes(order.status) && (
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors active:scale-[0.98]"
                >
                  <XCircle size={16} />
                  Tolak / Batalkan Pesanan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Wajib Alasan Tolak */}
      <RejectOrderModal
        isOpen={isRejectModalOpen}
        orderId={order.id}
        customerName={`${order.customerId} (${order.customerName})`}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default AdminOrderDetailPage;

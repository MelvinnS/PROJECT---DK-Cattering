import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  MapPin,
  ShoppingBag,
  Clock,
  ArrowRight,
  MessageCircle,
  Receipt,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

/**
 * Popup Modal Detail Customer.
 * Menampilkan detail lengkap customer tanpa berpindah halaman:
 * - Header: Detail Customer, Nama, ID Customer (Cust 1)
 * - Informasi Customer (Nama, No. HP, Username, Terdaftar)
 * - ALAMAT UTAMA
 * - RINGKASAN PESANAN (Jumlah pesanan, Total pengeluaran, Selesai, Berlangsung)
 * - PESANAN TERBARU
 * - Link "Lihat semua riwayat"
 */
const CustomerDetailModal = ({ isOpen, onClose, customer }) => {
  if (!isOpen || !customer) return null;

  const waPhone = customer.phone?.replace(/[^0-9]/g, "");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-coffee-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-7 border border-coffee-100 z-10 flex flex-col gap-5"
        >
          {/* Header Modal */}
          <div className="flex items-start justify-between pb-4 border-b border-coffee-100/70">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E2D8CC] text-[#5A4B3C] font-extrabold text-base flex items-center justify-center shrink-0 border border-coffee-200/60">
                {customer.id?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">
                  Detail Customer
                </p>
                <h3 className="font-extrabold text-lg sm:text-xl text-coffee-800 leading-tight">
                  {customer.fullName}
                </h3>
                <span className="inline-block mt-0.5 text-xs font-bold text-accent-700 bg-accent-50 px-2.5 py-0.5 rounded-md border border-accent-200/60">
                  {customer.id}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="w-8 h-8 flex items-center justify-center rounded-full text-coffee-400 hover:text-coffee-700 hover:bg-coffee-50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Bagian 1: Informasi Customer */}
          <div className="flex flex-col gap-2.5 bg-cream-50/70 p-4 rounded-2xl border border-coffee-100/80">
            <h4 className="text-xs font-bold text-coffee-600 uppercase tracking-wider mb-1">
              Informasi Customer
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                <span className="text-coffee-500 font-medium w-24">Nama:</span>
                <span className="font-bold text-coffee-800">{customer.fullName}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                <span className="text-coffee-500 font-medium w-24">No. HP:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-coffee-800">{customer.phone}</span>
                  {waPhone && (
                    <a
                      href={`https://wa.me/62${waPhone.startsWith("0") ? waPhone.slice(1) : waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                      title="Chat WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                <span className="text-coffee-500 font-medium w-24">Email:</span>
                <span className="font-semibold text-coffee-700">{customer.email || "-"}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                <span className="text-coffee-500 font-medium w-24">Terdaftar:</span>
                <span className="font-semibold text-coffee-700">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('id-ID') : '-'}</span>
              </div>
            </div>
          </div>

          {/* Bagian 2: ALAMAT UTAMA */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-coffee-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-accent-600" />
              Alamat Utama
            </h4>
            <div className="bg-white p-3.5 rounded-xl border border-coffee-200/80 text-xs sm:text-sm text-coffee-800 leading-relaxed font-medium">
              {customer.address || "Alamat tidak tersedia dalam ringkasan ini."}
            </div>
          </div>

          {/* Bagian 3: RINGKASAN PESANAN */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-coffee-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-accent-600" />
              Ringkasan Pesanan
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-50/80 p-3.5 rounded-xl border border-coffee-100/80">
                <p className="text-xs text-coffee-500 font-medium">Total Pesanan</p>
                <p className="font-black text-base sm:text-lg text-coffee-800 mt-0.5">
                  {customer.totalOrdersCount || 0} Pesanan
                </p>
                <p className="text-xs font-bold text-accent-700 mt-0.5">
                  {formatCurrency(customer.totalSpending || 0)}
                </p>
              </div>

              <div className="bg-cream-50/80 p-3.5 rounded-xl border border-coffee-100/80">
                <p className="text-xs text-coffee-500 font-medium">Status Pesanan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                    {customer.totalOrdersCount || 0} Total Selesai
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {customer.activeSubscriptionsCount || 0} Langganan Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 4: PESANAN TERBARU */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-coffee-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-accent-600" />
              Pesanan Terbaru
            </h4>

            <div className="bg-white rounded-xl border border-coffee-100 divide-y divide-coffee-100/70 overflow-hidden">
              {(!customer.recentOrders || customer.recentOrders.length === 0) ? (
                <div className="p-4 text-center text-coffee-400 text-xs">
                  Detail pesanan tidak dimuat dalam ringkasan ini.
                </div>
              ) : (
                customer.recentOrders.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Receipt size={14} className="text-coffee-400 shrink-0" />
                      <span className="font-semibold text-coffee-800 truncate">
                        {item.name} ×{item.qty}
                      </span>
                    </div>
                    <span className="font-bold text-coffee-800 shrink-0 ml-2">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer / Action Link */}
          <div className="pt-2 border-t border-coffee-100/70 flex items-center justify-between">
            <Link
              to={`/admin/orders?search=${encodeURIComponent(customer.email || customer.fullName)}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-600 hover:text-accent-700 transition-colors"
            >
              <span>Lihat semua riwayat</span>
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-coffee-800 hover:bg-coffee-900 text-cream-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerDetailModal;

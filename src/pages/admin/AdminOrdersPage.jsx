import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  ClipboardList,
  Clock,
  Check,
  RefreshCw,
} from "lucide-react";
import { useAdminOrders } from "../../context/AdminOrderContext";
import { dummyOrderStatusColor, dummyOrderStatusLabel } from "../../data/adminDummyData";
import { formatCurrency } from "../../utils/formatters";
import RejectOrderModal from "../../components/admin/RejectOrderModal";

const statusFilterTabs = [
  { id: "ALL", label: "Semua" },
  { id: "PAID", label: "Menunggu Konfirmasi" },
  { id: "IN_KITCHEN", label: "Sedang Dimasak" },
  { id: "ON_DELIVERY", label: "Sedang Diantar" },
  { id: "DELIVERED", label: "Selesai" },
  { id: "CANCELLED", label: "Dibatalkan" },
];

const AdminOrdersPage = () => {
  const { orders, loading, refreshOrders, acceptOrder, rejectOrder, batchAcceptOrders, batchRejectOrders } =
    useAdminOrders();

  // Auto-refresh setiap 30 detik supaya pesanan baru muncul otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State untuk Tolak Pesanan
  const [rejectModalState, setRejectModalState] = useState({
    isOpen: false,
    orderId: null,
    orderIds: [],
    customerName: "",
  });

  // Filter orders berdasarkan search dan status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone?.toLowerCase().includes(q) ||
        order.items?.some((it) => it.name.toLowerCase().includes(q));

      const matchStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "DELIVERED"
          ? ["DELIVERED", "COMPLETED"].includes(order.status)
          : order.status === selectedStatus);

      return matchSearch && matchStatus;
    });
  }, [orders, search, selectedStatus]);

  // Checkbox handlers
  const allFilteredIds = useMemo(
    () => filteredOrders.map((o) => o.id),
    [filteredOrders]
  );

  const isAllSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Aksi Tunggal
  const handleAcceptSingle = (orderId) => {
    acceptOrder(orderId);
  };

  const handleOpenRejectSingle = (order) => {
    setRejectModalState({
      isOpen: true,
      orderId: order.id,
      orderIds: [],
      customerName: `${order.customerId} (${order.customerName})`,
    });
  };

  // Aksi Batch
  const handleBatchAccept = () => {
    if (selectedIds.length === 0) return;
    batchAcceptOrders(selectedIds);
    setSelectedIds([]);
  };

  const handleOpenBatchReject = () => {
    if (selectedIds.length === 0) return;
    setRejectModalState({
      isOpen: true,
      orderId: null,
      orderIds: selectedIds,
      customerName: "",
    });
  };

  const handleConfirmReject = (targetIdOrIds, reason) => {
    if (Array.isArray(targetIdOrIds)) {
      batchRejectOrders(targetIdOrIds, reason);
      setSelectedIds([]);
    } else {
      rejectOrder(targetIdOrIds, reason);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Header Halaman */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-800">
            Kelola Pesanan
          </h1>
          <p className="text-coffee-500/80 mt-1 text-sm md:text-base">
            Pantau, konfirmasi penerimaan, dan kelola seluruh alur pesanan pelanggan katering.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshOrders}
          disabled={loading}
          title="Refresh data pesanan"
          className="shrink-0 inline-flex items-center gap-2 bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filter Status Tabs & Pencarian */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID Cust (Cust 1), Nama, No. Pesanan..."
            className="w-full rounded-full pl-11 pr-4 py-2.5 bg-white border border-coffee-200/80 shadow-sm focus:border-coffee-500 focus:ring-2 focus:ring-coffee-500/20 outline-none text-sm text-coffee-800 transition-all placeholder:text-coffee-400"
          />
        </div>

        {/* Status Filter Tabs (Scrollable on small screens) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {statusFilterTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-coffee-800 text-cream-50 shadow-sm"
                    : "bg-white text-coffee-600 hover:bg-cream-100/80 border border-coffee-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch Action Bar (Muncul saat ada pesanan dipilih) */}
      {selectedIds.length > 0 && (
        <div className="bg-coffee-800 text-cream-50 px-4 sm:px-6 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-500 text-cream-50 font-bold text-xs">
              {selectedIds.length}
            </span>
            <p className="text-xs sm:text-sm font-semibold">
              {selectedIds.length} pesanan dipilih
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchAccept}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors active:scale-95 shadow-sm"
            >
              <CheckCircle2 size={16} />
              Terima Terpilih
            </button>
            <button
              onClick={handleOpenBatchReject}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors active:scale-95 shadow-sm"
            >
              <XCircle size={16} />
              Tolak Terpilih
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-cream-50/70 hover:text-cream-50 px-2 py-1 ml-1"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Daftar Pesanan */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-coffee-100/80 rounded-2xl md:rounded-3xl p-12 text-center text-coffee-500/70 flex flex-col items-center gap-3">
          <ClipboardList size={36} className="text-coffee-300" />
          <p className="font-bold text-base text-coffee-700">Pesanan tidak ditemukan</p>
          <p className="text-xs sm:text-sm max-w-sm text-coffee-400">
            {search
              ? `Tidak ada pesanan yang sesuai dengan kata kunci "${search}".`
              : "Belum ada pesanan dengan status yang dipilih."}
          </p>
        </div>
      ) : (
        <>
          {/* Tampilan Desktop & Tablet: Table View */}
          <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl border border-coffee-100/80 shadow-[0_16px_40px_-24px_rgba(42,33,24,0.2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream-100/50 border-b border-coffee-100 text-xs font-bold text-coffee-700 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        aria-label="Pilih semua pesanan"
                        className="w-4 h-4 rounded text-coffee-800 focus:ring-coffee-500 cursor-pointer accent-coffee-800"
                      />
                    </th>
                    <th className="py-3.5 px-4">No. Pesanan</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Menu & Porsi</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Jadwal Pengiriman</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100/60 text-sm">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);
                    const isPaid = order.status === "PAID";

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-cream-50/70 transition-colors ${
                          isSelected ? "bg-cream-100/30" : ""
                        }`}
                      >
                        {/* Checkbox Pilih */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(order.id)}
                            aria-label={`Pilih pesanan ${order.id}`}
                            className="w-4 h-4 rounded text-coffee-800 focus:ring-coffee-500 cursor-pointer accent-coffee-800"
                          />
                        </td>

                        {/* ID Pesanan */}
                        <td className="py-3.5 px-4 font-bold text-coffee-800 whitespace-nowrap">
                          {order.id}
                        </td>

                        {/* Customer ID & Nama */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center font-bold text-xs bg-coffee-100 text-coffee-800 px-2 py-0.5 rounded-md shrink-0">
                              {order.customerId}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-coffee-800 truncate">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-coffee-400 truncate">
                                {order.customerPhone}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Menu & Porsi */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-coffee-700 font-medium truncate">
                            {order.items?.map((it) => `${it.name} ×${it.qty}`).join(", ")}
                          </p>
                          {order.notes && (
                            <p className="text-xs text-coffee-400 italic truncate mt-0.5">
                              Catatan: {order.notes}
                            </p>
                          )}
                        </td>

                        {/* Total Harga */}
                        <td className="py-3.5 px-4 font-bold text-coffee-800 whitespace-nowrap">
                          {formatCurrency(order.totalPrice)}
                        </td>

                        {/* Jadwal Pengiriman */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-coffee-600">
                            <Clock size={14} className="text-coffee-400 shrink-0" />
                            <span>{order.deliverySlot}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                              dummyOrderStatusColor[order.status] ||
                              "bg-coffee-100 text-coffee-700"
                            }`}
                          >
                            {dummyOrderStatusLabel[order.status] || order.status}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {isPaid && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAcceptSingle(order.id)}
                                  title="Terima Pesanan (Mulai Masak)"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenRejectSingle(order)}
                                  title="Tolak Pesanan"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            <Link
                              to={`/admin/orders/${order.id}`}
                              title="Lihat Detail Pesanan"
                              className="inline-flex items-center gap-1 bg-cream-100/80 hover:bg-cream-200 text-coffee-800 font-semibold text-xs px-3 py-1.5 rounded-full transition-colors"
                            >
                              <Eye size={14} />
                              <span>Detail</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tampilan Mobile: Card View */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredOrders.map((order) => {
              const isSelected = selectedIds.includes(order.id);
              const isPaid = order.status === "PAID";

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-3 transition-colors ${
                    isSelected
                      ? "border-coffee-500 bg-cream-50/40"
                      : "border-coffee-100/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-coffee-100/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(order.id)}
                        aria-label={`Pilih ${order.id}`}
                        className="w-4 h-4 rounded text-coffee-800 focus:ring-coffee-500 cursor-pointer accent-coffee-800"
                      />
                      <span className="text-xs font-bold text-coffee-800">
                        {order.id}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        dummyOrderStatusColor[order.status] ||
                        "bg-coffee-100 text-coffee-700"
                      }`}
                    >
                      {dummyOrderStatusLabel[order.status] || order.status}
                    </span>
                  </div>

                  {/* Info Customer & Menu */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold bg-coffee-100 text-coffee-800 px-2 py-0.5 rounded">
                        {order.customerId}
                      </span>
                      <p className="text-sm font-bold text-coffee-800">
                        {order.customerName}
                      </p>
                    </div>
                    <p className="text-xs text-coffee-600">
                      {order.items?.map((it) => `${it.name} ×${it.qty}`).join(", ")}
                    </p>
                    <div className="flex items-center justify-between text-xs text-coffee-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {order.deliverySlot}
                      </span>
                      <span className="font-bold text-sm text-coffee-800">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi Mobile */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-coffee-100/60">
                    <div className="flex items-center gap-2">
                      {isPaid && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAcceptSingle(order.id)}
                            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors active:scale-95"
                          >
                            <Check size={14} /> Terima
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRejectSingle(order)}
                            className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors active:scale-95"
                          >
                            <XCircle size={14} /> Tolak
                          </button>
                        </>
                      )}
                    </div>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 bg-coffee-800 hover:bg-coffee-900 text-cream-50 text-xs font-semibold px-3.5 py-1.5 rounded-full ml-auto transition-colors"
                    >
                      <Eye size={14} /> Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal Wajib Alasan Penolakan */}
      <RejectOrderModal
        isOpen={rejectModalState.isOpen}
        orderId={rejectModalState.orderId}
        orderIds={rejectModalState.orderIds}
        customerName={rejectModalState.customerName}
        onClose={() =>
          setRejectModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default AdminOrdersPage;

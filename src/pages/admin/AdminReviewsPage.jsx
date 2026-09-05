import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
  Quote,
  CheckCircle2,
  Clock,
  Utensils,
  Eye,
} from "lucide-react";

  // Data reviews akan diambil dari BE

const ROWS_PER_PAGE = 5;

// ─── STAR RATING COMPONENT ───────────────────────────────────────────────────

const StarRating = ({ rating, max = 5, size = 15 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, idx) => {
        const isFilled = idx < rating;
        return (
          <Star
            key={idx}
            size={size}
            className={`${
              isFilled
                ? "text-[#F5A623] fill-[#F5A623]"
                : "text-[#D3BFA6] stroke-[#D3BFA6]"
            }`}
          />
        );
      })}
    </div>
  );
};

// ─── POPUP DETAIL ULASAN (MODAL) ─────────────────────────────────────────────

const ReviewDetailModal = ({ review, onClose, onToggleRead }) => {
  if (!review) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-coffee-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-slide-up border border-coffee-100/80">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-coffee-100/70 shrink-0">
          <h2 id="review-modal-title" className="font-extrabold text-base sm:text-lg text-coffee-800">
            Detail Masukan Pelanggan
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-100 text-coffee-500 hover:text-coffee-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5 no-scrollbar">
          {/* Header Customer Info */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${review.avatarBg} border border-coffee-200/50 flex items-center justify-center font-extrabold text-xs ${review.avatarText} shrink-0`}
              >
                {review.customerId.replace("Cust ", "C")}
              </div>
              <div>
                <p className="font-extrabold text-sm text-coffee-800">{review.customerId}</p>
                <p className="text-xs text-coffee-500">{review.customerName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-coffee-400 font-medium uppercase tracking-wider">
                No. Pesanan
              </p>
              <p className="font-bold text-xs text-coffee-800 tracking-tight">#{review.orderId}</p>
            </div>
          </div>

          {/* Section: Penilaian & Status */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-coffee-100/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-coffee-500 mb-1">Rating yang Diberikan</p>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size={18} />
                <span className="font-extrabold text-sm text-coffee-800">
                  {review.rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Status Badge & Toggle Action */}
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  review.isRead
                    ? "bg-[#EAF6ED] text-[#2D7A4D] border-[#C6E7CE]"
                    : "bg-[#FDF0E2] text-[#C2671A] border-[#F5D8B8]"
                }`}
              >
                {review.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
              </span>
              <button
                type="button"
                onClick={() => onToggleRead(review.id)}
                className="text-[11px] text-coffee-600 hover:text-coffee-800 underline transition-colors mt-0.5"
              >
                {review.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
              </button>
            </div>
          </div>

          {/* Section: Ulasan / Pesan Customer */}
          <div>
            <p className="text-xs font-bold text-coffee-800 mb-2">
              Isi Saran & Ulasan
            </p>
            <div className="relative bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-coffee-100/60">
              <p className="text-xs sm:text-sm text-coffee-700 italic leading-relaxed pr-6 font-medium">
                "{review.comment}"
              </p>
              <Quote
                size={22}
                className="absolute bottom-3 right-3 text-[#D3BFA6] rotate-180"
              />
            </div>
          </div>

          {/* Section: Rincian Pesanan Terkait */}
          <div>
            <p className="text-xs font-bold text-coffee-800 mb-2">
              Informasi Pesanan
            </p>
            <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-coffee-100/60 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-coffee-600">
                <span className="flex items-center gap-1.5">
                  <Utensils size={14} className="text-coffee-400" /> Menu Dipesan
                </span>
                <span className="font-semibold text-coffee-800">{review.orderedItems}</span>
              </div>
              <div className="flex items-center justify-between text-coffee-600">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-coffee-400" /> Jadwal Pengantaran
                </span>
                <span className="font-semibold text-coffee-800">{review.deliverySlot}</span>
              </div>
              <div className="flex items-center justify-between text-coffee-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-coffee-400" /> Tanggal Ulasan
                </span>
                <span className="font-semibold text-coffee-800">{review.dateLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal: Tombol Tutup */}
        <div className="shrink-0 px-6 py-3.5 border-t border-coffee-100/70 flex justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white border border-coffee-300 hover:bg-cream-100 text-coffee-800 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── KOMPONEN UTAMA: ADMIN REVIEWS PAGE ───────────────────────────────────────

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch ulasan dari backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    import("../../services/reviewService")
      .then(({ getAdminReviews }) => getAdminReviews({ limit: 100 }))
      .then((result) => {
        if (!isMounted) return;
        const items = Array.isArray(result) ? result : result?.data ?? [];
        const normalized = items.map((r) => ({
          id: r.id,
          customerId: r.user?.email ?? "Cust",
          customerName: r.user?.fullName ?? "Customer",
          date: r.createdAt?.slice(0, 10) ?? "",
          dateLabel: r.createdAt ? new Date(r.createdAt).toLocaleDateString("id-ID") : "",
          orderId: r.order?.orderNumber ?? "-",
          rating: r.rating ?? 0,
          comment: r.comment ?? "-",
          orderedItems: "-", // Belum didukung API
          avatarBg: "bg-[#FDE8D0]",
          avatarText: "text-[#8C4A26]",
        }));
        setReviews(normalized);
      })
      .catch((err) => console.error("Gagal memuat reviews:", err))
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const totalMasukan = reviews.length;
  // `isRead` tidak ada di BE, sembunyikan nilai unread
  const belumDibaca = 0; 
  const avgNum = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : "0.0";
  const averageRating = avgNum;

  // Toggle status read (Hanya dummy di state lokal)
  const handleToggleRead = (id) => {
      // Tidak diimplementasikan ke BE
  };

  // Filter list
  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      const matchSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerId.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);

      const matchRating =
        ratingFilter === "ALL" || r.rating === parseInt(ratingFilter, 10);

      return matchSearch && matchRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  // Pagination (5 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ROWS_PER_PAGE));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredReviews.slice(start, start + ROWS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const goToPage = (p) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, p)));
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-7">
        {/* ── Header Halaman */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-800 tracking-tight">
            Saran & Masukan
          </h1>
          <p className="text-coffee-500/90 mt-1 text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Dengarkan masukan dari pelanggan untuk terus meningkatkan layanan.</span>
            <span className="sm:hidden">Dengarkan masukan dari pelanggan.</span>
          </p>
        </div>

        {/* ── 3 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Card 1: Total Masukan */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#F5EADB] flex items-center justify-center shrink-0 border border-[#EBDDC8]">
              <MessageSquare size={22} className="text-[#8C4A26]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-coffee-500 font-medium">Total Masukan</p>
              <p className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-coffee-800 leading-tight mt-0.5">
                {totalMasukan}
              </p>
              <p className="text-[10px] sm:text-[11px] text-coffee-400 mt-0.5">
                Semua masukan
              </p>
            </div>
          </div>

          {/* Card 2: Belum Dibaca */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#F5EADB] flex items-center justify-center shrink-0 border border-[#EBDDC8]">
              <Mail size={22} className="text-[#8C4A26]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-coffee-500 font-medium">Belum Dibaca</p>
              <p className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-coffee-800 leading-tight mt-0.5">
                {belumDibaca}
              </p>
              <p className="text-[10px] sm:text-[11px] text-coffee-400 mt-0.5">
                Masukan baru
              </p>
            </div>
          </div>

          {/* Card 3: Rating Rata-rata (Col-span 2 on mobile, 1 on desktop) */}
          <div className="col-span-2 md:col-span-1 bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#EAF4E8] flex items-center justify-center shrink-0 border border-[#D5E8D2]">
              <Star size={22} className="text-[#4A7C44] fill-[#4A7C44]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs text-coffee-500 font-medium">Rating Rata-rata</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-coffee-800 leading-tight">
                  {averageRating}
                </span>
                <span className="text-xs sm:text-sm text-coffee-400 font-semibold">/ 5</span>
              </div>
              <div className="mt-1">
                <StarRating rating={5} size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari nama customer atau ID..."
              className="w-full rounded-xl pl-9 pr-4 py-2.5 bg-white border border-coffee-200/80 shadow-2xs focus:border-coffee-500 focus:ring-2 focus:ring-coffee-500/20 outline-none text-xs sm:text-sm text-coffee-800 transition-all placeholder:text-coffee-400"
            />
          </div>

          {/* Filter Status Tabs & Rating Dropdown */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-coffee-200/80 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("ALL");
                  setCurrentPage(1);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "ALL"
                    ? "bg-[#2A2118] text-white shadow-xs"
                    : "text-coffee-600 hover:text-coffee-800 hover:bg-cream-100"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("UNREAD");
                  setCurrentPage(1);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "UNREAD"
                    ? "bg-[#2A2118] text-white shadow-xs"
                    : "text-coffee-600 hover:text-coffee-800 hover:bg-cream-100"
                }`}
              >
                Belum Dibaca
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("READ");
                  setCurrentPage(1);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "READ"
                    ? "bg-[#2A2118] text-white shadow-xs"
                    : "text-coffee-600 hover:text-coffee-800 hover:bg-cream-100"
                }`}
              >
                Sudah Dibaca
              </button>
            </div>

            {/* Rating Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                className="inline-flex items-center gap-2 bg-white border border-coffee-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-coffee-800 shadow-2xs hover:border-coffee-400 transition-colors"
              >
                <Filter size={14} className="text-[#8C4A26]" />
                <span>
                  {ratingFilter === "ALL" ? "Semua Rating" : `${ratingFilter} Bintang`}
                </span>
                <ChevronDown size={14} className="text-coffee-400" />
              </button>

              {isRatingDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsRatingDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-coffee-200/80 py-1 z-30 animate-fade-slide-up">
                    {[
                      { id: "ALL", label: "Semua Rating" },
                      { id: "5", label: "5 Bintang ★" },
                      { id: "4", label: "4 Bintang ★" },
                      { id: "3", label: "3 Bintang ★" },
                      { id: "2", label: "2 Bintang ★" },
                      { id: "1", label: "1 Bintang ★" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRatingFilter(item.id);
                          setIsRatingDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                          ratingFilter === item.id
                            ? "bg-cream-100 text-coffee-800 font-bold"
                            : "text-coffee-700 hover:bg-cream-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── List Saran & Masukan (Desktop & Mobile) */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] overflow-hidden">
          {paginatedList.length === 0 ? (
            <div className="py-16 text-center text-coffee-400 text-sm">
              Tidak ada masukan yang sesuai dengan filter pencarian.
            </div>
          ) : (
            <div className="divide-y divide-coffee-100/60">
              {paginatedList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 md:p-6 hover:bg-[#FAF8F5]/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Bagian Kiri: Info Customer */}
                  <div className="flex items-start gap-3.5 md:w-[32%] shrink-0">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${rev.avatarBg} border border-coffee-200/50 flex items-center justify-center font-extrabold text-xs ${rev.avatarText} shrink-0 mt-0.5`}
                    >
                      {rev.customerId.replace("Cust ", "C")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-coffee-800 leading-tight">
                        {rev.customerId}
                      </p>
                      <p className="text-xs text-coffee-500 mt-0.5 truncate">
                        {rev.customerName}
                      </p>
                      <p className="text-[11px] text-coffee-400 mt-1 truncate">
                        {rev.dateLabel} • Order #{rev.orderId}
                      </p>
                    </div>
                  </div>

                  {/* Bagian Tengah: Stars, Comment & Status Badge */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 md:px-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={rev.rating} size={14} />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border md:hidden ${
                          rev.isRead
                            ? "bg-[#EAF6ED] text-[#2D7A4D] border-[#C6E7CE]"
                            : "bg-[#FDF0E2] text-[#C2671A] border-[#F5D8B8]"
                        }`}
                      >
                        {rev.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-coffee-700 font-medium leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="hidden md:block mt-0.5">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          rev.isRead
                            ? "bg-[#EAF6ED] text-[#2D7A4D] border-[#C6E7CE]"
                            : "bg-[#FDF0E2] text-[#C2671A] border-[#F5D8B8]"
                        }`}
                      >
                        {rev.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
                      </span>
                    </div>
                  </div>

                  {/* Bagian Kanan: Tombol Lihat Detail */}
                  <div className="flex justify-end md:justify-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReview(rev)}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF8F5] border border-coffee-200 text-coffee-800 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight size={14} className="text-coffee-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Footer Paginasi */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-coffee-100/70 bg-white">
            <p className="text-xs text-coffee-500 order-2 sm:order-1">
              Menampilkan {paginatedList.length > 0 ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0} –{" "}
              {Math.min(currentPage * ROWS_PER_PAGE, filteredReviews.length)} dari{" "}
              {totalMasukan} masukan
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page 1 */}
              <button
                type="button"
                onClick={() => goToPage(1)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === 1
                    ? "bg-[#2A2118] text-white"
                    : "border border-coffee-200 text-coffee-700 hover:bg-cream-100"
                }`}
              >
                1
              </button>

              {/* Page 2 */}
              <button
                type="button"
                onClick={() => goToPage(2)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === 2
                    ? "bg-[#2A2118] text-white"
                    : "border border-coffee-200 text-coffee-700 hover:bg-cream-100"
                }`}
              >
                2
              </button>

              {/* Page 3 */}
              <button
                type="button"
                onClick={() => goToPage(3)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === 3
                    ? "bg-[#2A2118] text-white"
                    : "border border-coffee-200 text-coffee-700 hover:bg-cream-100"
                }`}
              >
                3
              </button>

              {/* Ellipsis */}
              <span className="px-1 text-xs text-coffee-400 font-bold">...</span>

              {/* Last Page (18) */}
              <button
                type="button"
                onClick={() => goToPage(18)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === 18
                    ? "bg-[#2A2118] text-white"
                    : "border border-coffee-200 text-coffee-700 hover:bg-cream-100"
                }`}
              >
                18
              </button>

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Popup Detail Ulasan Modal */}
      <ReviewDetailModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onToggleRead={handleToggleRead}
      />
    </>
  );
};

export default AdminReviewsPage;

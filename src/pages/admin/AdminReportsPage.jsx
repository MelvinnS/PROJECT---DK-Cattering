import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  FileText,
  CalendarDays,
  Clock,
  CreditCard,
  CheckCircle2,
  Eye,
  Quote,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

// ─── MOCK DATA TRANSAKSI ──────────────────────────────────────────────────────

const DUMMY_TRANSACTIONS = [
  {
    id: "TRX-03092026-001",
    customerId: "Cust 1",
    customerName: "Melvin Alio",
    date: "2026-09-03",
    dateLabel: "3 Sep 2026",
    deliverySlot: "Siang (12:00 - 14:00)",
    paymentMethod: "QRIS",
    status: "DELIVERED",
    subtotal: 36000,
    deliveryFee: 0,
    total: 36000,
    notes: "Tolong taruh di pagar ya, terima kasih!",
    items: [
      {
        id: "m-1",
        name: "Nasi Ayam Katsu",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=300&q=80",
        qty: 2,
        price: 18000,
        options: [
          { label: "Porsi", value: "" },
          { label: "Level Pedas", value: "Tidak Pedas" },
        ],
      },
    ],
  },
  {
    id: "TRX-03092026-002",
    customerId: "Cust 2",
    customerName: "Dita Rahmawati",
    date: "2026-09-03",
    dateLabel: "3 Sep 2026",
    deliverySlot: "Siang (12:00 - 14:00)",
    paymentMethod: "QRIS",
    status: "DELIVERED",
    subtotal: 20000,
    deliveryFee: 0,
    total: 20000,
    notes: "Titip di security lobby utama.",
    items: [
      {
        id: "m-2",
        name: "Nasi Yakiniku",
        image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=300&q=80",
        qty: 1,
        price: 20000,
        options: [
          { label: "Porsi", value: "Normal" },
          { label: "Level Pedas", value: "Sedang" },
        ],
      },
    ],
  },
  {
    id: "TRX-02092026-001",
    customerId: "Cust 3",
    customerName: "Budi Santoso",
    date: "2026-09-02",
    dateLabel: "2 Sep 2026",
    deliverySlot: "Pagi (08:00 - 10:00)",
    paymentMethod: "Transfer Bank BCA",
    status: "DELIVERED",
    subtotal: 18000,
    deliveryFee: 0,
    total: 18000,
    notes: "Pintu pagar warna hitam, bell 2x.",
    items: [
      {
        id: "m-3",
        name: "Nasi Chicken Teriyaki",
        image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=300&q=80",
        qty: 1,
        price: 18000,
        options: [
          { label: "Porsi", value: "Normal" },
          { label: "Level Pedas", value: "Sedang" },
        ],
      },
    ],
  },
  {
    id: "TRX-02092026-002",
    customerId: "Cust 4",
    customerName: "Sri Wulandari",
    date: "2026-09-02",
    dateLabel: "2 Sep 2026",
    deliverySlot: "Pagi (08:00 - 10:00)",
    paymentMethod: "Transfer Bank Mandiri",
    status: "DELIVERED",
    subtotal: 40000,
    deliveryFee: 0,
    total: 40000,
    notes: "Mohon diantar sebelum jam 09.30.",
    items: [
      {
        id: "m-1",
        name: "Nasi Ayam Katsu",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=300&q=80",
        qty: 2,
        price: 20000,
        options: [
          { label: "Porsi", value: "Kenyang" },
          { label: "Level Pedas", value: "Pedas" },
        ],
      },
    ],
  },
  {
    id: "TRX-01092026-001",
    customerId: "Cust 5",
    customerName: "Andi Prasetyo",
    date: "2026-09-01",
    dateLabel: "1 Sep 2026",
    deliverySlot: "Siang (12:00 - 14:00)",
    paymentMethod: "QRIS",
    status: "DELIVERED",
    subtotal: 27000,
    deliveryFee: 0,
    total: 27000,
    notes: "Hubungi via WA jika sudah sampai depan rumah.",
    items: [
      {
        id: "m-4",
        name: "Nasi Chicken Karaage",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=300&q=80",
        qty: 1,
        price: 27000,
        options: [
          { label: "Porsi", value: "Normal" },
          { label: "Level Pedas", value: "Extra Pedas" },
        ],
      },
    ],
  },
  // Tambahan dummy untuk 25 total records pagination
  ...Array.from({ length: 20 }, (_, idx) => {
    const num = idx + 6;
    return {
      id: `TRX-${String(30 - idx).padStart(2, "0")}082026-${String(num).padStart(3, "0")}`,
      customerId: `Cust ${num}`,
      customerName: [
        "Rina Kusuma",
        "Hendra Wijaya",
        "Maya Safitri",
        "Bambang Pamungkas",
        "Siti Nurhaliza",
        "Fajar Pratama",
        "Dewi Lestari",
        "Eko Prasetyo",
        "Lestari Putri",
        "Agus Salim",
      ][idx % 10],
      date: `2026-08-${String(30 - (idx % 20)).padStart(2, "0")}`,
      dateLabel: `${30 - (idx % 20)} Agu 2026`,
      deliverySlot: idx % 2 === 0 ? "Siang (12:00 - 14:00)" : "Pagi (08:00 - 10:00)",
      paymentMethod: idx % 3 === 0 ? "Transfer Bank BCA" : "QRIS",
      status: "DELIVERED",
      subtotal: (18 + (idx % 4) * 5) * 1000,
      deliveryFee: 0,
      total: (18 + (idx % 4) * 5) * 1000,
      notes: "Makanan diterima dalam kondisi baik.",
      items: [
        {
          id: `m-${(idx % 4) + 1}`,
          name: ["Nasi Ayam Katsu", "Nasi Yakiniku", "Nasi Chicken Teriyaki", "Nasi Chicken Karaage"][idx % 4],
          image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=300&q=80",
          qty: 1,
          price: (18 + (idx % 4) * 5) * 1000,
          options: [{ label: "Porsi", value: "Normal" }],
        },
      ],
    };
  }),
];

// Data titik grafik pendapatan sesuai desain (September 2026)
const CHART_POINTS = [
  { xLabel: "1 Sep", val: 400000 },
  { xLabel: "", val: 410000 },
  { xLabel: "", val: 550000 },
  { xLabel: "", val: 720000 },
  { xLabel: "5 Sep", val: 650000 },
  { xLabel: "", val: 490000 },
  { xLabel: "", val: 450000 },
  { xLabel: "", val: 560000 },
  { xLabel: "10 Sep", val: 590000 },
  { xLabel: "", val: 680000 },
  { xLabel: "", val: 820000 },
  { xLabel: "", val: 990000 },
  { xLabel: "15 Sep", val: 980000 },
  { xLabel: "", val: 1200000 },
  { xLabel: "", val: 1350000 },
  { xLabel: "20 Sep", val: 1300000 },
  { xLabel: "", val: 1100000 },
  { xLabel: "", val: 1080000 },
  { xLabel: "25 Sep", val: 950000 },
  { xLabel: "", val: 990000 },
  { xLabel: "", val: 1100000 },
  { xLabel: "30 Sep", val: 1250000 },
];

const ROWS_PER_PAGE = 5;

// ─── GRAFIK PENDAPATAN SVG ────────────────────────────────────────────────────

const RevenueLineChart = () => {
  const W = 700;
  const H = 220;
  const PAD = { top: 20, right: 25, bottom: 45, left: 85 };

  const maxVal = 2000000;
  const count = CHART_POINTS.length;

  const points = CHART_POINTS.map((pt, i) => {
    const x = PAD.left + (i / (count - 1)) * (W - PAD.left - PAD.right);
    const y = PAD.top + (1 - pt.val / maxVal) * (H - PAD.top - PAD.bottom);
    return { ...pt, x, y };
  });

  // Path SVG garis kurva mulus
  const pathData = points.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, "");

  // Area dengan gradient di bawah kurva
  const areaData = `${pathData} L ${points[points.length - 1].x} ${H - PAD.bottom} L ${points[0].x} ${H - PAD.bottom} Z`;

  // Grid Horizontal Y-Axis
  const yAxisTicks = [
    { val: 2000000, label: "Rp2.000.000" },
    { val: 1500000, label: "Rp1.500.000" },
    { val: 1000000, label: "Rp1.000.000" },
    { val: 500000, label: "Rp500.000" },
    { val: 0, label: "Rp0" },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[540px] h-[180px] sm:h-[220px]"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C4A26" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#C17F45" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FAF4EA" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid Garis Horizontal & Label Nilai */}
        {yAxisTicks.map((tick) => {
          const y = PAD.top + (1 - tick.val / maxVal) * (H - PAD.top - PAD.bottom);
          return (
            <g key={tick.val}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="#EDE4D8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={PAD.left - 10}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="#8C7660"
                fontFamily="sans-serif"
              >
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Fill Area Gradient */}
        <path d={areaData} fill="url(#chartGradient)" />

        {/* Garis Kurva Utama */}
        <path
          d={pathData}
          fill="none"
          stroke="#7A3D1E"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Titik Point Lingkaran */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill="#7A3D1E"
            stroke="#FFF"
            strokeWidth="1.8"
            className="transition-transform hover:scale-150"
          />
        ))}

        {/* Label X-Axis (Tanggal) */}
        {points
          .filter((pt) => Boolean(pt.xLabel))
          .map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              fontSize="10"
              fill="#8C7660"
              fontFamily="sans-serif"
            >
              {pt.xLabel}
            </text>
          ))}
      </svg>
    </div>
  );
};

// ─── MODAL DETAIL TRANSAKSI (POPUP) ───────────────────────────────────────────

const TransactionDetailModal = ({ trx, onClose }) => {
  if (!trx) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
          <h2 id="modal-title" className="font-extrabold text-base sm:text-lg text-coffee-800">
            Detail Transaksi
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
              <div className="w-11 h-11 rounded-full bg-[#F5EADB] border border-[#E4D5C3] flex items-center justify-center font-extrabold text-xs text-coffee-800 shrink-0">
                {trx.customerId.replace("Cust ", "C")}
              </div>
              <div>
                <p className="font-extrabold text-sm text-coffee-800">{trx.customerId}</p>
                <p className="text-xs text-coffee-500">{trx.customerName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-coffee-400 font-medium uppercase tracking-wider">
                ID Transaksi
              </p>
              <p className="font-bold text-xs text-coffee-800 tracking-tight">{trx.id}</p>
            </div>
          </div>

          {/* Section: Informasi Transaksi */}
          <div>
            <p className="text-xs font-bold text-coffee-800 mb-2.5">
              Informasi Transaksi
            </p>
            <div className="bg-[#FAF8F5] rounded-2xl p-3.5 sm:p-4 border border-coffee-100/60 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-coffee-600">
                  <CalendarDays size={15} className="text-coffee-400 shrink-0" />
                  <span>Tanggal Transaksi</span>
                </div>
                <span className="font-semibold text-coffee-800">{trx.dateLabel}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-coffee-600">
                  <Clock size={15} className="text-coffee-400 shrink-0" />
                  <span>Jadwal Pengiriman</span>
                </div>
                <span className="font-semibold text-coffee-800">{trx.deliverySlot}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-coffee-600">
                  <CreditCard size={15} className="text-coffee-400 shrink-0" />
                  <span>Metode Pembayaran</span>
                </div>
                <span className="font-semibold text-coffee-800">{trx.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-coffee-600">
                  <CheckCircle2 size={15} className="text-coffee-400 shrink-0" />
                  <span>Status Transaksi</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Selesai
                </span>
              </div>
            </div>
          </div>

          {/* Section: Rincian Pesanan */}
          <div>
            <p className="text-xs font-bold text-coffee-800 mb-2.5">
              Rincian Pesanan
            </p>
            <div className="flex flex-col gap-3">
              {trx.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-coffee-100/60 flex items-start gap-3.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-coffee-200/60 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm text-coffee-800 leading-tight">{item.name}</p>
                      <span className="text-xs font-semibold text-coffee-600 shrink-0">× {item.qty}</span>
                      <p className="font-bold text-sm text-coffee-800 whitespace-nowrap ml-auto">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>

                    {item.options && (
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-coffee-500">
                        {item.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span>• {opt.label}</span>
                            {opt.value && <span className="text-coffee-700 font-medium">{opt.value}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-3 bg-[#FAF8F5] rounded-2xl p-3.5 sm:p-4 border border-coffee-100/60 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-coffee-600">
                <span>Subtotal</span>
                <span className="font-semibold text-coffee-800">{formatCurrency(trx.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-coffee-600">
                <span>Ongkir</span>
                <span className="font-semibold text-coffee-800">{formatCurrency(trx.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-coffee-200/60">
                <span className="font-extrabold text-sm text-coffee-800">Total Pembayaran</span>
                <span className="font-extrabold text-base text-[#8C4A26]">{formatCurrency(trx.total)}</span>
              </div>
            </div>
          </div>

          {/* Section: Catatan Customer */}
          {trx.notes && (
            <div>
              <p className="text-xs font-bold text-coffee-800 mb-2">
                Catatan Customer
              </p>
              <div className="relative bg-[#FAF8F5] rounded-2xl p-4 border border-coffee-100/60">
                <p className="text-xs sm:text-sm text-coffee-700 italic leading-relaxed pr-6">
                  "{trx.notes}"
                </p>
                <Quote
                  size={20}
                  className="absolute bottom-3 right-3 text-[#D3BFA6] rotate-180"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal: Tombol Tutup */}
        <div className="shrink-0 px-6 py-3.5 border-t border-coffee-100/70 flex justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white border border-coffee-300 hover:bg-cream-100 text-coffee-800 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── KOMPONEN UTAMA: HALAMAN LAPORAN TRANSAKSI ─────────────────────────────────

const AdminReportsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrx, setSelectedTrx] = useState(null);

  // Fetch transaksi dari BE — orders yang completed/delivered
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    import("../../services/adminOrderService")
      .then(({ getAdminOrders }) =>
        getAdminOrders({ limit: 200, status: "COMPLETED,DELIVERED" })
      )
      .then((result) => {
        if (!isMounted) return;
        const items = Array.isArray(result) ? result : result?.data ?? [];
        // Normalize BE fields → fields yang dipakai komponen
        const normalized = items.map((o) => ({
          id: o.orderNumber ?? o.id,
          customerId: o.user?.id ?? "-",
          customerName: o.user?.fullName ?? "Customer",
          date: o.createdAt?.slice(0, 10) ?? "",
          dateLabel: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "-",
          deliverySlot: o.slot ? `${o.slot.name} (${o.slot.startTime} - ${o.slot.endTime})` : "-",
          paymentMethod: o.payment?.louvinInvoiceId ? "QRIS/Transfer" : "-",
          status: o.status,
          subtotal: Number(o.subtotal),
          deliveryFee: Number(o.deliveryFee),
          total: Number(o.totalPrice),
          notes: o.notes ?? "",
          items: o.items?.map((i) => ({
            id: i.id,
            name: i.menu?.name ?? "Menu",
            image: i.menu?.imageUrl ?? "",
            qty: i.quantity,
            price: Number(i.price),
          })) ?? [],
        }));
        setTransactions(normalized);
      })
      .catch((err) => console.error("Gagal memuat transaksi:", err))
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  // Stats dari data real
  const totalPendapatanDisplay = transactions.length
    ? "Rp" + transactions.reduce((s, t) => s + t.total, 0).toLocaleString("id-ID")
    : "Rp0";
  const totalTransaksiDisplay = transactions.length;

  // Filter pencarian
  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        t.customerName.toLowerCase().includes(q) ||
        t.customerId.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [search, transactions]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ROWS_PER_PAGE));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredTransactions.slice(start, start + ROWS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const goToPage = (p) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, p)));
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-7">
        {/* ── Header Halaman */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-800 tracking-tight">
            Laporan Transaksi
          </h1>
          <p className="text-coffee-500/90 mt-1 text-xs sm:text-sm md:text-base">
            Pantau ringkasan dan riwayat transaksi catering.
          </p>
        </div>

        {/* ── 2 Summary Cards (Total Pendapatan & Total Transaksi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card Total Pendapatan */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#F5EADB] flex items-center justify-center shrink-0 border border-[#EBDDC8]">
              <Wallet size={24} className="text-[#8C4A26]" />
            </div>
            <div>
              <p className="text-xs text-coffee-500 font-medium">Total Pendapatan</p>
              <p className="text-2xl sm:text-[28px] font-extrabold text-coffee-800 leading-tight mt-0.5">
                {totalPendapatanDisplay}
              </p>
              <p className="text-[11px] text-coffee-400 mt-1">
                Periode: 1 – 30 September 2026
              </p>
            </div>
          </div>

          {/* Card Total Transaksi */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#F5EADB] flex items-center justify-center shrink-0 border border-[#EBDDC8]">
              <FileText size={24} className="text-[#8C4A26]" />
            </div>
            <div>
              <p className="text-xs text-coffee-500 font-medium">Total Transaksi</p>
              <p className="text-2xl sm:text-[28px] font-extrabold text-coffee-800 leading-tight mt-0.5">
                {totalTransaksiDisplay}
              </p>
              <p className="text-[11px] text-coffee-400 mt-1">
                Periode: 1 – 30 September 2026
              </p>
            </div>
          </div>
        </div>

        {/* ── Filter Periode */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-coffee-800">Periode</span>
          <div className="inline-flex items-center gap-2 bg-white border border-coffee-200/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-coffee-700 shadow-2xs select-none cursor-pointer hover:border-coffee-400 transition-colors">
            <CalendarDays size={15} className="text-[#C17F45]" />
            <span className="font-semibold text-coffee-800">Bulan Ini</span>
            <ChevronRight size={14} className="text-coffee-400 rotate-90" />
          </div>
        </div>

        {/* ── Card Grafik Pendapatan */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base sm:text-lg text-coffee-800">
              Grafik Pendapatan
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-white border border-coffee-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-coffee-700 shadow-2xs select-none cursor-pointer hover:border-coffee-400 transition-colors">
              <span>September 2026</span>
              <ChevronRight size={13} className="text-coffee-400 rotate-90" />
            </div>
          </div>

          <RevenueLineChart />
        </div>

        {/* ── Card Riwayat Transaksi */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/70 shadow-[0_12px_36px_-20px_rgba(42,33,24,0.15)] overflow-hidden">
          {/* Header Card Riwayat */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-coffee-100/70">
            <h2 className="font-bold text-base sm:text-lg text-coffee-800">
              Riwayat Transaksi
            </h2>
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Cari customer..."
                className="w-full rounded-full pl-9 pr-4 py-2 bg-white border border-coffee-200/80 shadow-2xs focus:border-coffee-500 focus:ring-2 focus:ring-coffee-500/20 outline-none text-xs sm:text-sm text-coffee-800 transition-all placeholder:text-coffee-400"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-coffee-100 text-xs font-bold text-coffee-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12" />
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100/60 text-sm">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-coffee-400 text-sm">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Avatar Circle */}
                      <td className="py-3.5 px-4">
                        <div className="w-9 h-9 rounded-full bg-[#F5EADB] border border-[#E4D5C3] flex items-center justify-center font-extrabold text-xs text-coffee-800">
                          {trx.customerId.replace("Cust ", "C")}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-sm text-coffee-800 leading-tight">
                          {trx.customerId}
                        </p>
                        <p className="text-xs text-coffee-500 mt-0.5">{trx.customerName}</p>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3.5 px-4 text-xs font-medium text-coffee-700 whitespace-nowrap">
                        {trx.dateLabel}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-bold text-sm text-coffee-800 whitespace-nowrap">
                        {formatCurrency(trx.total)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                          Selesai
                        </span>
                      </td>

                      {/* Aksi Button */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedTrx(trx)}
                          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF8F5] border border-coffee-200 text-coffee-800 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Eye size={13} className="text-coffee-600" />
                          <span>Lihat Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (Tampilan Mobile) */}
          <div className="flex flex-col divide-y divide-coffee-100/60 sm:hidden">
            {paginatedList.length === 0 ? (
              <p className="py-12 text-center text-coffee-400 text-sm">
                Tidak ada transaksi ditemukan.
              </p>
            ) : (
              paginatedList.map((trx) => (
                <div key={trx.id} className="flex items-center gap-3 px-4 py-3.5">
                  {/* Avatar Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#F5EADB] border border-[#E4D5C3] flex items-center justify-center font-extrabold text-xs text-coffee-800 shrink-0">
                    {trx.customerId.replace("Cust ", "C")}
                  </div>

                  {/* Customer Info & Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-extrabold text-xs text-coffee-800 truncate">
                        {trx.customerId}
                      </p>
                      <p className="text-[11px] text-coffee-500 whitespace-nowrap">
                        {trx.dateLabel}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[11px] text-coffee-500 truncate">{trx.customerName}</p>
                      <p className="font-bold text-xs text-coffee-800 whitespace-nowrap">
                        {formatCurrency(trx.total)}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator Dot & Eye Button */}
                  <div className="flex items-center gap-2.5 shrink-0 pl-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <button
                      type="button"
                      onClick={() => setSelectedTrx(trx)}
                      aria-label="Lihat Detail Transaksi"
                      className="w-8 h-8 rounded-lg border border-coffee-200 flex items-center justify-center text-coffee-700 hover:bg-cream-100 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-coffee-100/70 bg-white">
            <p className="text-xs text-coffee-500 order-2 sm:order-1">
              Menampilkan {paginatedList.length > 0 ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0} –{" "}
              {Math.min(currentPage * ROWS_PER_PAGE, filteredTransactions.length)} dari{" "}
              {filteredTransactions.length} transaksi
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    p === currentPage
                      ? "bg-[#2A2118] text-white"
                      : "border border-coffee-200 text-coffee-700 hover:bg-cream-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Popup Detail Transaksi */}
      <TransactionDetailModal
        trx={selectedTrx}
        onClose={() => setSelectedTrx(null)}
      />
    </>
  );
};

export default AdminReportsPage;

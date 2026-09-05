import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  SlidersHorizontal,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getAdminCustomers } from "../../services/adminCustomerService";
import CustomerDetailModal from "../../components/admin/CustomerDetailModal";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch dari BE
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getAdminCustomers({ page: currentPage, limit: 20, search })
      .then((result) => {
        if (!isMounted) return;
        const items = Array.isArray(result) ? result : result?.data ?? [];
        setCustomers(items);
        setTotal(result?.meta?.total ?? items.length);
      })
      .catch((err) => console.error("Gagal memuat customers:", err))
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [currentPage, search]);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.customerId.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };

  const handleExport = () => {
    // Export simple CSV of customers
    const headers = "ID Customer,Nama Lengkap,No HP,Username,Terdaftar\n";
    const rows = filteredCustomers
      .map(
        (c) =>
          `"${c.customerId}","${c.fullName}","${c.phone}","${c.username}","${c.registeredDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Customer_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7 max-w-5xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-coffee-800">
          Kelola Customer
        </h1>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-coffee-400 mt-1">
          <Link to="/admin" className="hover:text-coffee-700 transition-colors">
            Dashboard
          </Link>
          <span>&gt;</span>
          <span className="text-coffee-600 font-semibold">Kelola Customer</span>
        </div>
      </div>

      {/* Stat Card: Total Customer 128 */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/90 shadow-[0_10px_30px_-15px_rgba(42,33,24,0.12)] p-5 sm:p-6 flex items-center gap-4 max-w-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cream-100/80 text-coffee-700 flex items-center justify-center shrink-0">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-coffee-500">Total Customer</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-coffee-800 leading-tight mt-0.5">
            128
          </p>
          <p className="text-xs text-coffee-400 mt-0.5">Semua Customer</p>
        </div>
      </div>

      {/* Toolbar: Search, Filter, Export */}
      <div className="flex items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / ID customer..."
            className="w-full rounded-full pl-11 pr-4 py-2.5 bg-white border border-coffee-200/80 shadow-sm focus:border-coffee-500 focus:ring-2 focus:ring-coffee-500/20 outline-none text-xs sm:text-sm text-coffee-800 transition-all placeholder:text-coffee-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-full border border-coffee-200/90 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-full border border-coffee-200/90 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Tabel Customer (Desktop & Tablet) & Card List (Mobile) */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/90 shadow-[0_10px_30px_-15px_rgba(42,33,24,0.12)] overflow-hidden">
        {/* Table Header Desktop */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-cream-100/40 border-b border-coffee-100 text-xs font-bold text-coffee-700 uppercase tracking-wider">
          <div className="col-span-4">ID Customer</div>
          <div className="col-span-5">Nama Lengkap</div>
          <div className="col-span-3 text-right pr-3">Aksi</div>
        </div>

        {/* Content Rows */}
        <div className="divide-y divide-coffee-100/70">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-coffee-400 text-sm">
              Customer tidak ditemukan.
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-cream-50/50 transition-colors"
              >
                {/* Desktop View: ID Customer & Avatar */}
                <div className="hidden md:flex items-center gap-3 col-span-4">
                  <div className="w-8 h-8 rounded-full bg-[#E2D8CC] text-[#5A4B3C] font-bold text-xs flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-coffee-400/40 inline-block" />
                  </div>
                  <span className="font-bold text-sm text-coffee-800">
                    {customer.customerId}
                  </span>
                </div>

                {/* Desktop View: Nama Lengkap */}
                <div className="hidden md:block col-span-5 font-semibold text-sm text-coffee-800">
                  {customer.fullName}
                </div>

                {/* Mobile View: Avatar + ID Customer (Top) & Nama (Bottom) */}
                <div className="flex md:hidden items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#E2D8CC] text-[#5A4B3C] font-bold text-xs flex items-center justify-center shrink-0">
                      <span className="w-3 h-3 rounded-full bg-coffee-400/40 inline-block" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-coffee-800">
                        {customer.customerId}
                      </p>
                      <p className="font-semibold text-sm text-coffee-700 truncate">
                        {customer.fullName}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(customer)}
                      className="px-3.5 py-1.5 rounded-full border border-coffee-200 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-800 text-xs font-semibold transition-all shadow-sm active:scale-95"
                    >
                      Lihat Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(customer)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-coffee-400 hover:text-coffee-700 hover:bg-cream-100 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Desktop View: Actions */}
                <div className="hidden md:flex items-center justify-end gap-2 col-span-3">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(customer)}
                    className="px-4 py-1.5 rounded-full border border-coffee-200/90 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-800 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
                  >
                    Lihat Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(customer)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-coffee-400 hover:text-coffee-700 hover:bg-cream-100 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-coffee-500 py-1">
        <p className="font-medium">
          Menampilkan 1 – {filteredCustomers.length} dari 128 customer
        </p>

        {/* Desktop Pagination */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-xs transition-colors ${
                currentPage === page
                  ? "bg-cream-200 text-coffee-900 border border-coffee-300"
                  : "border border-coffee-200 text-coffee-600 hover:bg-cream-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === 5}
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile Pagination Button */}
        <div className="sm:hidden w-full flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-cream-100/90 text-coffee-800 text-xs font-bold border border-coffee-200"
          >
            <span>Selanjutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Popup Modal Detail Customer (Tidak Berpindah Halaman) */}
      <CustomerDetailModal
        isOpen={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default AdminCustomersPage;

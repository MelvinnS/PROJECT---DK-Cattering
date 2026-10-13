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
<<<<<<< HEAD
=======
import { getAdminCustomers } from "../../services/adminCustomerService";
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
import CustomerDetailModal from "../../components/admin/CustomerDetailModal";
import { getAdminCustomers, getAdminCustomerById } from "../../services/adminService";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
=======
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

<<<<<<< HEAD
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getAdminCustomers({
        search: search.trim() || undefined,
        page: currentPage,
        limit: 10,
      });
      // response: { data: [...], meta: { total, page, limit, totalPages } }
      const items = (response.data || []).map((u, index) => ({
        id: u.id,
        customerId: `Cust ${index + 1 + (currentPage - 1) * 10}`,
        fullName: u.fullName || "Tanpa Nama",
        phone: u.phone || "-",
        username: u.email?.split("@")[0] || "-",
        email: u.email,
        registeredDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "-",
        primaryAddress: "-",
        stats: {
          totalOrders: u.totalOrdersCount || 0,
          totalSpent: u.totalSpending || 0,
          completedOrders: u.totalOrdersCount || 0,
          ongoingOrders: u.activeSubscriptionsCount || 0,
        },
        recentOrders: [],
      }));
      setCustomers(items);
      setTotalCount(response.meta?.total || items.length);
    } catch (err) {
      console.error("Gagal memuat data pelanggan:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };
=======
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
        c.id.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, search]);
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  // Handle Search with debounce or enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const handleOpenDetail = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const fullDetail = await getAdminCustomerById(customer.id);
      if (fullDetail) {
        const primaryAddr = fullDetail.addresses?.find((a) => a.isPrimary) || fullDetail.addresses?.[0];
        const addrString = primaryAddr
          ? `${primaryAddr.streetName || ""}, ${primaryAddr.detailNotes || ""}`.trim()
          : "Belum mengatur alamat";

        const recentOrdersFormatted = (fullDetail.orders || []).slice(0, 3).map((o) => ({
          id: o.orderNumber,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("id-ID") : "-",
          total: Number(o.totalPrice) || 0,
          status: o.status,
        }));

        setSelectedCustomer((prev) => ({
          ...prev,
          primaryAddress: addrString,
          recentOrders: recentOrdersFormatted,
          stats: {
            ...prev.stats,
            totalOrders: fullDetail.orders?.length || 0,
          },
        }));
      }
    } catch (err) {
      console.error("Gagal mengambil detail customer:", err);
    }
  };

  const handleCloseDetail = () => {
    setSelectedCustomer(null);
  };

  const handleExport = () => {
<<<<<<< HEAD
    const headers = "ID Customer,Nama Lengkap,No HP,Email,Terdaftar\n";
    const rows = customers
      .map(
        (c) =>
          `"${c.customerId}","${c.fullName}","${c.phone}","${c.email}","${c.registeredDate}"`
=======
    // Export simple CSV of customers
    const headers = "ID Customer,Nama Lengkap,No HP,Email,Terdaftar\n";
    const rows = filteredCustomers
      .map(
        (c) =>
          `"${c.id}","${c.fullName}","${c.phone || '-'}","${c.email || '-'}","${c.createdAt ? new Date(c.createdAt).toLocaleDateString('id-ID') : '-'}"`
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
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
    <div className="space-y-6">
      {/* Detail Customer Modal */}
      <CustomerDetailModal
        isOpen={!!selectedCustomer}
        onClose={handleCloseDetail}
        customer={selectedCustomer}
      />

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-coffee-800 tracking-tight">
              Kelola Pelanggan
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E2D8CC] text-[#5A4B3C]">
              <Users size={13} />
              {totalCount} Customer
            </span>
          </div>
          <p className="text-coffee-500 text-sm mt-1">
            Pantau dan kelola seluruh data customer yang terdaftar di sistem.
          </p>
        </div>

        {/* Action Header */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-coffee-200 hover:border-coffee-400 bg-white hover:bg-cream-50 text-coffee-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no HP..."
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-coffee-200/90 text-coffee-800 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-all shadow-sm"
          />
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100 shadow-[0_4px_24px_-4px_rgba(42,33,24,0.06)] overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 px-6 py-4 bg-cream-50/70 border-b border-coffee-100 text-xs font-bold text-coffee-500 uppercase tracking-wider">
          <div className="col-span-4">ID Customer</div>
          <div className="col-span-5">Nama Lengkap & Kontak</div>
          <div className="col-span-3 text-right">Aksi</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-coffee-100/60">
          {loading ? (
            <div className="py-16 text-center text-coffee-400 text-sm flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-accent-600" size={24} />
              <span>Memuat data pelanggan...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="py-16 text-center text-coffee-400 text-sm">
              Customer tidak ditemukan.
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-cream-50/50 transition-colors"
              >
                {/* Desktop View: ID Customer & Avatar */}
                <div className="hidden md:flex items-center gap-3 col-span-4">
                  <div className="w-8 h-8 rounded-full bg-[#E2D8CC] text-[#5A4B3C] font-bold text-xs flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-coffee-400/40 inline-block" />
                  </div>
<<<<<<< HEAD
                  <div>
                    <span className="font-bold text-sm text-coffee-800 block">
                      {customer.customerId}
                    </span>
                    <span className="text-[11px] text-coffee-400 block truncate">
                      {customer.email}
                    </span>
                  </div>
=======
                  <span className="font-bold text-sm text-coffee-800">
                    {customer.id.substring(0, 8)}...
                  </span>
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
                </div>

                {/* Desktop View: Nama Lengkap */}
                <div className="hidden md:block col-span-5">
                  <p className="font-semibold text-sm text-coffee-800">
                    {customer.fullName}
                  </p>
                  <p className="text-xs text-coffee-500">
                    {customer.phone}
                  </p>
                </div>

                {/* Mobile View */}
                <div className="flex md:hidden items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#E2D8CC] text-[#5A4B3C] font-bold text-xs flex items-center justify-center shrink-0">
                      <span className="w-3 h-3 rounded-full bg-coffee-400/40 inline-block" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-coffee-800">
                        {customer.id.substring(0, 8)}...
                      </p>
                      <p className="font-semibold text-sm text-coffee-700 truncate">
                        {customer.fullName}
                      </p>
                      <p className="text-xs text-coffee-400 truncate">
                        {customer.email}
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
          Menampilkan {customers.length} dari {totalCount} customer
        </p>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 py-1 text-xs font-bold text-coffee-700">
            Halaman {currentPage}
          </span>
          <button
            type="button"
            disabled={customers.length < 10}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-coffee-200 text-coffee-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;

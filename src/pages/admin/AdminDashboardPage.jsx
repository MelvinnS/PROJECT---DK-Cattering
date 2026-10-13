import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, ChefHat, Truck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import RecentOrderRow from "../../components/admin/RecentOrderRow";
import AlertPanel from "../../components/admin/AlertPanel";
import { useAuth } from "../../context/AuthContext";
import { useAdminOrders } from "../../context/AdminOrderContext";
import { getAnalyticsOverview } from "../../services/adminService";

const todayLabel = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { orders, statusCounts, fetchOrders } = useAdminOrders();

  // Ambil 5 pesanan terbaru
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  // urgentAlertsCount dan statusCounts dari backend
  const [urgentCount, setUrgentCount] = useState(null);
  const [overviewCounts, setOverviewCounts] = useState(null);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

  useEffect(() => {
    // Fetch pesanan terbaru untuk dashboard
    fetchOrders({ limit: 20 });

    let isMounted = true;
    getAnalyticsOverview("daily")
      .then((data) => {
        if (isMounted) {
          setUrgentCount(data.urgentAlertsCount ?? 0);
          if (data.statusCounts) {
            setOverviewCounts(data.statusCounts);
          }
        }
      })
      .catch(() => {
        // Abaikan error jika backend belum berjalan
      })
      .finally(() => {
        if (isMounted) setIsLoadingAlerts(false);
      });
    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayCounts = overviewCounts || statusCounts;

  const alertItems = [];
  if (urgentCount > 0) {
    alertItems.push({
      id: "urgent-delivery",
      text: `${urgentCount} pesanan dijadwalkan diantar hari ini tapi belum mulai dimasak — segera diproses.`,
    });
  }
  if (displayCounts.new > 0) {
    alertItems.push({
      id: "new-orders",
      text: `Ada ${displayCounts.new} pesanan baru menunggu konfirmasi penerimaan dari kamu.`,
    });
  }
  if (displayCounts.inKitchen > 0) {
    alertItems.push({
      id: "kitchen-orders",
      text: `${displayCounts.inKitchen} pesanan sedang dalam proses memasak di dapur.`,
    });
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-800">
            Halo, {user?.fullName?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-coffee-500/80 mt-1 capitalize text-sm md:text-base">
            {todayLabel}
          </p>
        </div>
      </div>

      {/* 4 Status Card — Hanya di Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <StatCard
          icon={Bell}
          label="Pesanan Baru"
          value={displayCounts.new}
          tone="amber"
        />
        <StatCard
          icon={ChefHat}
          label="Sedang Dimasak"
          value={displayCounts.inKitchen}
          tone="blue"
        />
        <StatCard
          icon={Truck}
          label="Sedang Diantar"
          value={displayCounts.onDelivery}
          tone="purple"
        />
        <StatCard
          icon={CheckCircle2}
          label="Selesai Hari Ini"
          value={displayCounts.done}
          tone="green"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:gap-6 items-start">
        {/* Daftar pesanan terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-3xl border border-coffee-100/60 shadow-[0_16px_40px_-24px_rgba(42,33,24,0.25)] p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 border-b border-coffee-100/60">
            <div>
              <h2 className="font-bold text-base sm:text-lg text-coffee-800">
                Pesanan Terbaru
              </h2>
              <p className="text-xs text-coffee-400 mt-0.5">
                5 aktivitas transaksi terakhir
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-full transition-colors shrink-0"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-coffee-400">
                Belum ada pesanan masuk.
              </p>
            ) : (
              recentOrders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))
            )}
          </div>
        </div>

        {/* Informasi penting */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-coffee-100/60 shadow-[0_16px_40px_-24px_rgba(42,33,24,0.25)] p-5 sm:p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-coffee-800">
              Informasi Penting
            </h2>
            <p className="text-xs text-coffee-400 mt-0.5">
              Notifikasi & hal yang perlu dipantau
            </p>
          </div>

          {isLoadingAlerts ? (
            <div className="flex items-center gap-2 text-sm text-coffee-500/70 py-4">
              <Loader2 size={16} className="animate-spin text-accent-600" />
              Memuat informasi...
            </div>
          ) : (
            <AlertPanel items={alertItems} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;


import { Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { orderStatusLabel, orderStatusColor } from "../../context/OrderContext";
import { formatCurrency } from "../../utils/formatters";

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const RecentOrderRow = ({ order }) => {
  return (
    <Link
      to={`/admin/orders/${order.id}`}
      className="group flex items-center gap-3 sm:gap-4 py-3.5 px-2.5 sm:px-3 -mx-2.5 sm:-mx-3 rounded-xl hover:bg-cream-50/80 border-b border-coffee-100/60 last:border-b-0 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          {order.customerId && (
            <span className="text-xs font-bold text-accent-700 bg-accent-50 px-2 py-0.5 rounded-md border border-accent-200/60">
              {order.customerId}
            </span>
          )}
          <p className="font-bold text-coffee-800 text-sm group-hover:text-accent-700 transition-colors">
            {order.customerName}
          </p>
          <span className="text-xs text-coffee-400">#{order.id}</span>
        </div>
        <p className="text-xs sm:text-sm text-coffee-500/80 truncate">
          {order.items?.map((it) => `${it.name} ×${it.qty}`).join(", ")}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-xs text-coffee-400 shrink-0">
        <Clock size={13} />
        {formatTime(order.createdAt)}
      </div>

      <p className="font-semibold text-coffee-700 text-sm shrink-0 w-24 text-right hidden md:block">
        {formatCurrency(order.totalPrice)}
      </p>

      <span
        className={`text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full shrink-0 ${
          orderStatusColor[order.status] || "bg-coffee-100 text-coffee-700"
        }`}
      >
        {orderStatusLabel[order.status] || order.status}
      </span>

      <ChevronRight
        size={16}
        className="text-coffee-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block"
      />
    </Link>
  );
};

export default RecentOrderRow;


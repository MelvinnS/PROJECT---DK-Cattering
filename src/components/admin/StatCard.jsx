/**
 * Kartu ringkasan angka (jumlah pesanan per status) di Dashboard Admin.
 * Dibuat besar & jelas — prioritas keterbacaan, bukan gaya SaaS yang padat.
 */
const StatCard = ({ icon: Icon, label, value, tone = "coffee" }) => {
  const tones = {
    coffee: "bg-coffee-50 text-coffee-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-coffee-100/60 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.25)] p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <span
        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 ${tones[tone]}`}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl sm:text-3xl font-extrabold text-coffee-800 leading-none">
          {value}
        </p>
        <p className="text-xs sm:text-sm text-coffee-500/80 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

import { AlertTriangle } from "lucide-react";

/**
 * Panel "Informasi Penting" — daftar hal yang perlu segera diperhatikan Admin.
 * items: [{ id, text, tone: 'warning' | 'info' }]
 */
const AlertPanel = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-700">
        Semua aman — tidak ada yang perlu diperhatikan khusus saat ini. 🎉
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4"
        >
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;

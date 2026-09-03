import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "../../data/menuData";

/**
 * Kartu 1 menu di halaman Kelola Menu (Admin). Toggle "Tersedia" langsung
 * menentukan apakah menu ini tampil di halaman Menu Guest/Customer.
 */
const AdminMenuCard = ({ menu, onEdit, onDelete, onToggleAvailability }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-coffee-100/60 shadow-[0_12px_30px_-20px_rgba(42,33,24,0.25)] flex flex-col">
      <div className="relative h-36">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            menu.isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-coffee-800/80 text-cream-50"
          }`}
        >
          {menu.isAvailable ? "Tersedia" : "Tidak Tersedia"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-coffee-800 text-sm leading-snug line-clamp-1">
          {menu.name}
        </h3>
        <p className="text-accent-600 font-semibold text-sm">
          {formatPrice(menu.price)}
        </p>
        <p className="text-xs text-coffee-500/80 line-clamp-2 flex-1">
          {menu.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-coffee-100">
          <button
            type="button"
            onClick={onToggleAvailability}
            aria-pressed={menu.isAvailable}
            aria-label="Ubah status tersedia"
            className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
              menu.isAvailable ? "bg-accent-600" : "bg-coffee-200"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                menu.isAvailable ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${menu.name}`}
              className="w-8 h-8 rounded-full bg-cream-100 text-coffee-700 flex items-center justify-center hover:bg-cream-200 transition-colors"
            >
              <Pencil size={14} />
            </button>

            {confirmingDelete ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-xs font-semibold text-red-600 px-2 py-1.5 rounded-full hover:bg-red-50"
                >
                  Ya, hapus
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="text-xs font-semibold text-coffee-400 px-2 py-1.5 rounded-full hover:bg-coffee-50"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                aria-label={`Hapus ${menu.name}`}
                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuCard;

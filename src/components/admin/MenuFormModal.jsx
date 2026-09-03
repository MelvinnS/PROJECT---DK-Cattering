import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImagePlus, RotateCcw } from "lucide-react";
import { formatPrice } from "../../data/menuData";
import Button from "../common/Button";

const emptyForm = { name: "", price: "", description: "", image: "", isAvailable: true };

/**
 * Modal Tambah/Edit Menu (Admin — Kelola Menu).
 *
 * mode="add"  -> ada 2 tab: "Menu Baru" (form kosong) & "Menu Sebelumnya"
 *                (daftar menu yang pernah dibuat tapi lagi nonaktif —
 *                admin tinggal aktifkan lagi tanpa isi ulang dari 0).
 * mode="edit" -> form terisi data menu yang mau diubah.
 */
const MenuFormModal = ({
  isOpen,
  mode = "add",
  initialMenu,
  inactiveMenus = [],
  onClose,
  onSubmit,
  onReuse,
}) => {
  const [tab, setTab] = useState("new"); // "new" | "reuse" — hanya relevan saat mode="add"
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      initialMenu
        ? {
            name: initialMenu.name || "",
            price: String(initialMenu.price ?? ""),
            description: initialMenu.description || "",
            image: initialMenu.image || "",
            isAvailable: initialMenu.isAvailable ?? true,
          }
        : emptyForm
    );
    setTab("new");
  }, [isOpen, initialMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSubmit({
      name: form.name.trim(),
      price: Number(form.price) || 0,
      description: form.description.trim(),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      isAvailable: form.isAvailable,
    });
  };

  const showReuseTab = mode === "add" && tab === "reuse";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[80] bg-coffee-900/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full sm:max-w-lg bg-cream-50 rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_20px_60px_-20px_rgba(28,22,15,0.5)] max-h-[88vh] sm:max-h-[85vh] flex flex-col sm:m-6"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-coffee-100 shrink-0">
                <h3 className="font-bold text-coffee-800 text-lg">
                  {mode === "edit" ? "Edit Menu" : "Tambah Menu"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className="w-8 h-8 rounded-full bg-coffee-100/70 text-coffee-600 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {mode === "add" && (
                <div className="px-6 pt-4 flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab("new")}
                    className={`flex-1 text-sm font-semibold py-2 rounded-full transition-colors ${
                      tab === "new"
                        ? "bg-accent-600 text-cream-50"
                        : "bg-cream-100 text-coffee-600"
                    }`}
                  >
                    Menu Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("reuse")}
                    className={`flex-1 text-sm font-semibold py-2 rounded-full transition-colors ${
                      tab === "reuse"
                        ? "bg-accent-600 text-cream-50"
                        : "bg-cream-100 text-coffee-600"
                    }`}
                  >
                    Menu Sebelumnya
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
                {showReuseTab ? (
                  inactiveMenus.length === 0 ? (
                    <p className="text-sm text-coffee-500/70 text-center py-10">
                      Belum ada menu nonaktif yang bisa dipakai ulang.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {inactiveMenus.map((menu) => (
                        <div
                          key={menu.id}
                          className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-coffee-100/60"
                        >
                          <img
                            src={menu.image}
                            alt={menu.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-coffee-800 text-sm truncate">
                              {menu.name}
                            </p>
                            <p className="text-xs text-accent-600 font-semibold">
                              {formatPrice(menu.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onReuse(menu.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600 bg-accent-300/20 hover:bg-accent-300/30 px-3 py-2 rounded-full shrink-0 transition-colors"
                          >
                            <RotateCcw size={13} /> Tambahkan
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <form
                    id="menu-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-100 border border-coffee-100 shrink-0 flex items-center justify-center">
                        {form.image ? (
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImagePlus size={22} className="text-coffee-300" />
                        )}
                      </div>
                      <label className="flex-1 flex flex-col gap-1 text-sm font-medium text-coffee-700">
                        URL Foto Menu
                        <input
                          type="url"
                          name="image"
                          value={form.image}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="rounded-xl px-3 py-2.5 bg-white border border-coffee-100 outline-none text-coffee-800 text-sm"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
                      Nama Menu
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nasi Ayam Katsu"
                        className="rounded-xl px-4 py-3 bg-white border border-coffee-100 outline-none text-coffee-800"
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
                      Harga
                      <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-white border border-coffee-100">
                        <span className="text-coffee-400 text-sm">Rp</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          name="price"
                          required
                          value={form.price}
                          onChange={handleChange}
                          placeholder="18000"
                          className="w-full outline-none text-coffee-800 bg-transparent"
                        />
                      </div>
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
                      Deskripsi
                      <textarea
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Ayam katsu crispy dengan saus spesial."
                        className="rounded-xl px-4 py-3 bg-white border border-coffee-100 outline-none text-coffee-800 resize-none"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-xl px-4 py-3 bg-white border border-coffee-100">
                      <span className="text-sm font-medium text-coffee-700">
                        Status Tersedia
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }))
                        }
                        aria-pressed={form.isAvailable}
                        className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                          form.isAvailable ? "bg-accent-600" : "bg-coffee-200"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                            form.isAvailable ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>
                  </form>
                )}
              </div>

              {!showReuseTab && (
                <div className="px-6 py-4 border-t border-coffee-100 bg-cream-50 rounded-b-[1.75rem] shrink-0">
                  <Button type="submit" form="menu-form" variant="primary" className="w-full">
                    {mode === "edit" ? "Simpan Perubahan" : "Tambah Menu"}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuFormModal;

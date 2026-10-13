import { useMemo, useState, useEffect } from "react";
import { Plus, Search, UtensilsCrossed, Loader2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import AdminMenuCard from "../../components/admin/AdminMenuCard";
import MenuFormModal from "../../components/admin/MenuFormModal";

/**
 * Kelola Menu (Admin) — CRUD penuh atas katalog menu via BE API.
 */
const AdminMenuPage = () => {
<<<<<<< HEAD
  const { catalog, loading: catalogLoading, addMenu, updateMenu, deleteMenu, toggleAvailability } = useMenu();
=======
  const { catalog, isLoading, addMenu, updateMenu, deleteMenu, toggleAvailability, loadAdminCatalog } = useMenu();
>>>>>>> d283d255bd34efc2c42ac002f008ca58ff7eb67e
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "add", menu: null });

  // Load katalog admin saat halaman dibuka
  useEffect(() => {
    loadAdminCatalog();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((menu) => menu.name.toLowerCase().includes(q));
  }, [catalog, search]);

  const inactiveMenus = useMemo(
    () => catalog.filter((menu) => !menu.isAvailable),
    [catalog]
  );

  const openAdd = () => setModalState({ open: true, mode: "add", menu: null });
  const openEdit = (menu) => setModalState({ open: true, mode: "edit", menu });
  const closeModal = () => setModalState((prev) => ({ ...prev, open: false }));

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (modalState.mode === "edit" && modalState.menu) {
        await updateMenu(modalState.menu.id, formData);
      } else {
        await addMenu(formData);
      }
      closeModal();
    } catch (err) {
      console.error("Gagal menyimpan menu:", err);
      alert("Gagal menyimpan menu. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleReuse = async (id) => {
    setSaving(true);
    try {
      await toggleAvailability(id);
      closeModal();
    } catch (err) {
      console.error("Gagal mengaktifkan menu:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
    } catch (err) {
      console.error("Gagal menghapus menu:", err);
      alert("Gagal menghapus menu. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-800">
            Kelola Menu
          </h1>
          <p className="text-coffee-500/80 mt-1 text-sm md:text-base">
            Menu berstatus "Tersedia" otomatis tampil di halaman Menu pelanggan.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-cream-50 font-semibold text-sm px-5 py-3 rounded-full shadow-[0_10px_24px_-8px_rgba(130,76,37,0.55)] transition-colors shrink-0 active:scale-[0.97]"
        >
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {/* Pencarian */}
      <div className="relative max-w-sm w-full">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari menu..."
          className="w-full rounded-full pl-10 pr-4 py-2.5 bg-white border border-coffee-100 outline-none text-sm text-coffee-800"
        />
      </div>

      {/* Grid menu */}
      {catalogLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-coffee-100/60">
              <div className="h-36 bg-cream-100" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-cream-100 rounded w-3/4" />
                <div className="h-3 bg-cream-100 rounded w-full" />
                <div className="h-3 bg-cream-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-coffee-100/60 rounded-2xl p-12 text-center text-coffee-500/70 flex flex-col items-center gap-3">
          <UtensilsCrossed size={28} className="text-coffee-300" />
          {catalog.length === 0
            ? "Belum ada menu. Yuk tambah menu pertama kamu."
            : "Menu tidak ditemukan."}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((menu) => (
            <AdminMenuCard
              key={menu.id}
              menu={menu}
              onEdit={() => openEdit(menu)}
              onDelete={() => handleDelete(menu.id)}
              onToggleAvailability={() => toggleAvailability(menu.id)}
            />
          ))}
        </div>
      )}

      <MenuFormModal
        isOpen={modalState.open}
        mode={modalState.mode}
        initialMenu={modalState.menu}
        inactiveMenus={inactiveMenus}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onReuse={handleReuse}
      />
    </div>
  );
};

export default AdminMenuPage;

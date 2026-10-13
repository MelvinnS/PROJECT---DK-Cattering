import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getPublicMenus,
  getAdminMenus,
  createMenu,
  updateMenuApi,
  deleteMenuApi,
} from "../services/menuService";
import { USE_MOCK_BACKEND } from "../config/appConfig";
import seedMenuData from "../data/menuData";

const MenuContext = createContext(undefined);

/**
 * Konversi object menu dari backend ke format yang dipakai frontend.
 * Backend: { id, name, description, imageUrl, price, isActive, dietaryTags, ... }
 * Frontend: { id, name, description, image, price, isAvailable, tags, ... }
 */
const mapFromBackend = (m) => ({
  id: String(m.id),
  name: m.name,
  description: m.description || "",
  image:
    m.imageUrl ||
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  price: Number(m.price) || 0,
  isAvailable: m.isActive ?? true,
  tags: Array.isArray(m.dietaryTags) ? m.dietaryTags : [],
  calories: m.calories || null,
});

/**
 * Konversi object frontend ke payload yang diterima backend.
 */
const mapToBackend = (m) => ({
  name: m.name,
  description: m.description || "",
  imageUrl: m.image || undefined,
  price: Number(m.price) || 0,
  isActive: m.isAvailable ?? true,
  dietaryTags: m.tags || [],
  calories: m.calories || undefined,
});

export const MenuProvider = ({ children }) => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Muat semua menu dari backend saat pertama render.
  // - Admin → GET /admin/menus (semua menu, termasuk nonaktif)
  // - Customer/Guest → GET /public/menus/active (hanya yang aktif)
  const fetchCatalog = useCallback(async () => {
    if (USE_MOCK_BACKEND) {
      setCatalog(seedMenuData.map((m) => ({ isAvailable: true, ...m })));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Deteksi role dari localStorage tanpa import AuthContext
      let userRole = null;
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) userRole = JSON.parse(storedUser)?.role;
      } catch { /* abaikan */ }

      let items = [];
      if (userRole === "ADMIN" || userRole === "KITCHEN") {
        // Admin butuh semua menu (aktif + nonaktif) untuk pengelolaan
        const data = await getAdminMenus();
        items = Array.isArray(data) ? data : (data?.data || []);
      } else {
        // Customer/Guest: hanya menu aktif, tidak perlu token
        const data = await getPublicMenus();
        items = Array.isArray(data) ? data : (data?.data || []);
      }
      setCatalog(items.map(mapFromBackend));
    } catch (err) {
      console.error("Gagal memuat katalog menu:", err);
      // Fallback ke data seed supaya halaman tidak blank
      setCatalog(seedMenuData.map((m) => ({ isAvailable: true, ...m })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // ── CRUD ────────────────────────────────────────────────────────────────────

  /** Tambah menu baru via backend, lalu refresh katalog. */
  const addMenu = async (menu) => {
    if (USE_MOCK_BACKEND) {
      const newMenu = { id: `mock-${Date.now()}`, isAvailable: true, tags: [], ...menu };
      setCatalog((prev) => [newMenu, ...prev]);
      return newMenu;
    }
    const created = await createMenu(mapToBackend({ isAvailable: true, ...menu }));
    // Refresh supaya ID dari backend tersimpan dengan benar
    await fetchCatalog();
    return created;
  };

  /** Update menu yang sudah ada via backend. */
  const updateMenu = async (id, updates) => {
    if (USE_MOCK_BACKEND) {
      setCatalog((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
      );
      return;
    }
    await updateMenuApi(id, mapToBackend({ ...catalog.find((m) => m.id === id), ...updates }));
    await fetchCatalog();
  };

  /** Hapus (soft delete) menu via backend. */
  const deleteMenu = async (id) => {
    if (USE_MOCK_BACKEND) {
      setCatalog((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    await deleteMenuApi(id);
    await fetchCatalog();
  };

  /** Toggle ketersediaan menu (aktif/nonaktif) via backend. */
  const toggleAvailability = async (id) => {
    const target = catalog.find((m) => m.id === id);
    if (!target) return;
    const newAvailable = !target.isAvailable;
    if (USE_MOCK_BACKEND) {
      setCatalog((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isAvailable: newAvailable } : m))
      );
      return;
    }
    await updateMenuApi(id, { isActive: newAvailable });
    await fetchCatalog();
  };

  // Hanya menu aktif yang tampil di sisi customer/guest
  const availableMenus = catalog.filter((m) => m.isAvailable);

  const value = {
    catalog,
    availableMenus,
    loading,
    refreshCatalog: fetchCatalog,
    addMenu,
    updateMenu,
    deleteMenu,
    toggleAvailability,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getActiveMenus,
  getAdminMenus,
  createMenu as apiCreateMenu,
  updateMenu as apiUpdateMenu,
  deleteMenu as apiDeleteMenu,
} from "../services/menuService";

const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  // Katalog lengkap (untuk Admin)
  const [catalog, setCatalog] = useState([]);
  // Menu aktif saja (untuk Customer & Public)
  const [availableMenus, setAvailableMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Muat menu publik (aktif) saat pertama kali render
  const loadPublicMenus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getActiveMenus({ limit: 50 });
      // result bisa array langsung atau { data: [...], meta: {...} }
      const items = Array.isArray(result) ? result : result?.data ?? [];
      setAvailableMenus(items);
    } catch (err) {
      console.error("Gagal memuat menu:", err);
      setError(err.message ?? "Gagal memuat menu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Muat katalog lengkap (untuk Admin)
  const loadAdminCatalog = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminMenus({ limit: 100, ...params });
      const items = Array.isArray(result) ? result : result?.data ?? [];
      setCatalog(items);
    } catch (err) {
      console.error("Gagal memuat katalog menu admin:", err);
      setError(err.message ?? "Gagal memuat menu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicMenus();
  }, [loadPublicMenus]);

  // Admin: tambah menu baru
  const addMenu = async (menuData) => {
    const newMenu = await apiCreateMenu(menuData);
    setCatalog((prev) => [newMenu, ...prev]);
    if (newMenu.isActive) {
      setAvailableMenus((prev) => [newMenu, ...prev]);
    }
    return newMenu;
  };

  // Admin: update menu
  const updateMenu = async (id, updates) => {
    const updated = await apiUpdateMenu(id, updates);
    setCatalog((prev) => prev.map((m) => (m.id === id ? updated : m)));
    setAvailableMenus((prev) =>
      updated.isActive
        ? prev.map((m) => (m.id === id ? updated : m))
        : prev.filter((m) => m.id !== id)
    );
    return updated;
  };

  // Admin: hapus menu (soft delete — set isActive false)
  const deleteMenu = async (id) => {
    await apiDeleteMenu(id);
    setCatalog((prev) => prev.filter((m) => m.id !== id));
    setAvailableMenus((prev) => prev.filter((m) => m.id !== id));
  };

  // Admin: toggle available (update isActive via PATCH)
  const toggleAvailability = async (id) => {
    const menu = catalog.find((m) => m.id === id);
    if (!menu) return;
    const updated = await apiUpdateMenu(id, { isActive: !menu.isActive });
    setCatalog((prev) => prev.map((m) => (m.id === id ? updated : m)));
    setAvailableMenus((prev) =>
      updated.isActive
        ? [...prev, updated]
        : prev.filter((m) => m.id !== id)
    );
  };

  const value = {
    catalog,
    availableMenus,
    isLoading,
    error,
    loadPublicMenus,
    loadAdminCatalog,
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

import { createContext, useContext, useEffect, useState } from "react";
import seedMenuData from "../data/menuData";

const MenuContext = createContext(undefined);

const STORAGE_KEY = "dk_menu_catalog_v1";

let menuUidCounter = 0;

const withDefaults = (menu) => ({
  isAvailable: true,
  ...menu,
});

/**
 * Sumber data Menu terpusat (katalog) — dipakai bareng oleh halaman
 * Kelola Menu (Admin) dan halaman Menu Guest/Customer, supaya begitu Admin
 * ubah/tambah/hapus menu, otomatis kepakai juga di sisi Customer.
 *
 * ⚠️ MASIH MOCK — belum ada endpoint backend untuk CRUD menu. Data
 * disimpan di localStorage supaya tidak hilang saat refresh/besok admin
 * buka lagi (jadi tidak perlu input dari 0 tiap hari). Begitu backend
 * sudah punya endpoint (GET/POST/PATCH/DELETE /menu), tinggal ganti
 * implementasi addMenu/updateMenu/deleteMenu/toggleAvailability di bawah
 * ini dengan panggilan API asli (pola sama seperti authService.js).
 */
const loadInitialCatalog = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // localStorage tidak tersedia/rusak -> fallback ke data seed di bawah.
  }
  return seedMenuData.map((menu) => withDefaults({ ...menu }));
};

export const MenuProvider = ({ children }) => {
  const [catalog, setCatalog] = useState(loadInitialCatalog);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    } catch {
      // Storage penuh/tidak tersedia — abaikan, state React tetap jalan.
    }
  }, [catalog]);

  // Tambah menu baru ke katalog (dari form "Menu Baru").
  const addMenu = (menu) => {
    const newMenu = withDefaults({
      id: `menu-${Date.now()}-${++menuUidCounter}`,
      ...menu,
    });
    setCatalog((prev) => [newMenu, ...prev]);
    return newMenu;
  };

  // Ubah data menu yang sudah ada (dari form "Edit Menu").
  const updateMenu = (id, updates) => {
    setCatalog((prev) =>
      prev.map((menu) => (menu.id === id ? { ...menu, ...updates } : menu))
    );
  };

  // Hapus menu permanen dari katalog.
  const deleteMenu = (id) => {
    setCatalog((prev) => prev.filter((menu) => menu.id !== id));
  };

  // Nyalakan/matikan status "tersedia" — dipakai juga untuk fitur
  // "tambah menu sebelumnya" (tinggal aktifkan lagi, tidak perlu isi ulang).
  const toggleAvailability = (id) => {
    setCatalog((prev) =>
      prev.map((menu) =>
        menu.id === id ? { ...menu, isAvailable: !menu.isAvailable } : menu
      )
    );
  };

  // Hanya menu yang isAvailable=true yang tampil di halaman Guest/Customer.
  const availableMenus = catalog.filter((menu) => menu.isAvailable);

  const value = {
    catalog,
    availableMenus,
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

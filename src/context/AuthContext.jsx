import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { USE_MOCK_BACKEND } from "../config/appConfig";

const AuthContext = createContext(undefined);

/* ------------------------------------------------------------------ */
/*  MODE MOCK — backend diputus                                        */
/*  Tidak ada request ke server. User selalu "sudah masuk" sebagai     */
/*  Customer atau Admin (bisa dipindah kapan saja lewat switchRole).   */
/* ------------------------------------------------------------------ */
const MOCK_ROLE_KEY = "dk_mock_role";

const buildMockUser = (role) =>
  role === "ADMIN"
    ? {
        id: "mock-admin",
        fullName: "Admin DK",
        email: "admin@dkcattering.id",
        phone: "0812-0000-0000",
        role: "ADMIN",
      }
    : {
        id: "mock-customer",
        fullName: "Melvin Alio",
        email: "melvin@example.com",
        phone: "0822-3125-8463",
        role: "CUSTOMER",
      };

const loadMockRole = () => {
  try {
    return localStorage.getItem(MOCK_ROLE_KEY) === "ADMIN" ? "ADMIN" : "CUSTOMER";
  } catch {
    return "CUSTOMER";
  }
};

const MockAuthProvider = ({ children }) => {
  const [role, setRole] = useState(loadMockRole);

  const switchRole = (nextRole) => {
    const safeRole = nextRole === "ADMIN" ? "ADMIN" : "CUSTOMER";
    try {
      localStorage.setItem(MOCK_ROLE_KEY, safeRole);
    } catch {
      // localStorage tidak tersedia -> role tetap berubah selama sesi berjalan.
    }
    setRole(safeRole);
  };

  // Halaman Login/Register masih bisa dipakai: kredensial apa pun diterima.
  // Email yang mengandung "admin" otomatis masuk sebagai Admin.
  const login = async ({ email = "" }) => {
    const nextRole = email.toLowerCase().includes("admin") ? "ADMIN" : "CUSTOMER";
    switchRole(nextRole);
    return { user: buildMockUser(nextRole) };
  };

  const register = async () => ({ success: true });

  // Di mode mock tidak ada kondisi "keluar" — kembali ke Customer saja.
  const logout = () => switchRole("CUSTOMER");

  const value = {
    user: buildMockUser(role),
    login,
    register,
    logout,
    switchRole,
    isAuthenticated: true,
    isReady: true,
    isMock: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ------------------------------------------------------------------ */
/*  MODE REAL — tersambung ke backend NestJS (VITE_USE_MOCK_BACKEND=   */
/*  false). Logika di bawah ini sama persis dengan versi sebelumnya.   */
/* ------------------------------------------------------------------ */
const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "authUser",
};

const RealAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // selesai baca localStorage saat pertama load

  // Muat session yang tersimpan (kalau ada) saat aplikasi pertama kali dibuka.
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    const storedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsReady(true);
  }, []);

  const persistSession = ({ user: userData, accessToken, refreshToken }) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    }
    setUser(userData);
  };

  const login = async ({ email, password }) => {
    const result = await loginUser({ email, password });
    persistSession(result);
    return result;
  };

  const register = async (payload) => {
    // Endpoint register tidak mengembalikan token, jadi user diarahkan
    // untuk login setelah akun berhasil dibuat.
    return registerUser(payload);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    switchRole: () => {}, // hanya berlaku di mode mock
    isAuthenticated: !!user,
    isReady,
    isMock: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = USE_MOCK_BACKEND ? MockAuthProvider : RealAuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

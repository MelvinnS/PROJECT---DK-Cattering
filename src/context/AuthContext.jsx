import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(undefined);

const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "authUser",
};

export const AuthProvider = ({ children }) => {
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
    isAuthenticated: !!user,
    isReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

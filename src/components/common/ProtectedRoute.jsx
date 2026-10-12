import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USE_MOCK_BACKEND } from "../../config/appConfig";

/**
 * Bungkus halaman yang butuh login (Customer/Admin) dengan komponen ini.
 * Kalau belum login, otomatis diarahkan ke /login dan dikembalikan
 * ke halaman semula setelah login berhasil.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  // Backend diputus (mode mock) -> semua halaman terbuka tanpa login.
  if (USE_MOCK_BACKEND) return children;

  if (!isReady) return null; // tunggu AuthContext selesai baca localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USE_MOCK_BACKEND } from "../../config/appConfig";

/**
 * Bungkus halaman Admin dengan komponen ini. Beda dari ProtectedRoute biasa:
 * selain harus login, role user juga harus ADMIN — kalau bukan, dilempar
 * ke Beranda (bukan ke /login, supaya Customer yang nyasar ke /admin tidak
 * bingung diminta login ulang).
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  // Backend diputus (mode mock) -> area Admin terbuka tanpa login.
  if (USE_MOCK_BACKEND) return children;

  if (!isReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

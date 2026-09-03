import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Bungkus halaman Admin dengan komponen ini. Beda dari ProtectedRoute biasa:
 * selain harus login, role user juga harus ADMIN — kalau bukan, dilempar
 * ke Beranda (bukan ke /login, supaya Customer yang nyasar ke /admin tidak
 * bingung diminta login ulang).
 */
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isReady } = useAuth();
  const location = useLocation();

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

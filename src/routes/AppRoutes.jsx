import { Routes, Route } from "react-router-dom";

import GuestLayout from "../layouts/GuestLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";

import LandingPage from "../pages/guest/LandingPage";
import MenuPage from "../pages/guest/MenuPage";
import LoginPage from "../pages/guest/LoginPage";
import RegisterPage from "../pages/guest/RegisterPage";

import PesananPage from "../pages/customer/PesananPage";
import RiwayatPage from "../pages/customer/RiwayatPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import ProfilePage from "../pages/customer/ProfilePage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminMenuPage from "../pages/admin/AdminMenuPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminSlotsPage from "../pages/admin/AdminSlotsPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest & Customer pakai layout (Navbar/Footer) yang SAMA. */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Butuh login — Guest yang klik otomatis dilempar ke /login
            (lihat components/common/ProtectedRoute.jsx). */}
        <Route
          path="/pesanan"
          element={
            <ProtectedRoute>
              <PesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <RiwayatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes — hanya bisa diakses role ADMIN (lihat AdminRoute.jsx). */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="slots" element={<AdminSlotsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="feedback" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

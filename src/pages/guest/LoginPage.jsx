import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const justRegistered = location.state?.justRegistered;
  // Kalau user diarahkan ke /login dari halaman lain (mis. tombol "Tambah Menu"),
  // setelah login berhasil kita kembalikan ke halaman itu.
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await login(form);
      // Admin punya area sendiri (/admin) — role lain (Customer) tetap
      // pakai alur redirect yang sudah ada (balik ke halaman asal / Beranda).
      if (result?.user?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Email atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-coffee-800 mb-2 text-center">
        Masuk
      </h1>
      <p className="text-coffee-500/90 text-center mb-8">
        Masuk untuk melanjutkan pemesanan cateringmu.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-coffee-100/60 rounded-[1.75rem] p-8 flex flex-col gap-4 shadow-[0_24px_60px_-24px_rgba(42,33,24,0.28)]"
      >
        {justRegistered && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
            Akun berhasil dibuat! Silakan masuk dengan email & password kamu.
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {errorMessage}
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
          Email
          <div className="flex items-center gap-2 bg-cream-50 rounded-xl px-4 py-3 border border-coffee-100">
            <Mail size={16} className="text-coffee-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className="w-full outline-none text-coffee-800 bg-transparent"
              required
            />
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
          Password
          <div className="flex items-center gap-2 bg-cream-50 rounded-xl px-4 py-3 border border-coffee-100">
            <Lock size={16} className="text-coffee-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full outline-none text-coffee-800 bg-transparent"
              required
            />
          </div>
        </label>

        <Button
          type="submit"
          variant="primary"
          className="mt-4 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>

        <p className="text-center text-sm text-coffee-500/80 mt-2">
          Belum punya akun?{" "}
          <Link to="/register" className="text-coffee-700 font-semibold underline">
            Daftar Sekarang
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;

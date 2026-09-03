import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Loader2 } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
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
      await register(form);
      // Register tidak langsung memberi token, jadi arahkan ke Login
      // dengan pesan sukses supaya user login manual.
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setErrorMessage(err.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "fullName", label: "Nama Lengkap", type: "text", icon: User, placeholder: "Nama kamu" },
    { name: "email", label: "Email", type: "email", icon: Mail, placeholder: "nama@email.com" },
    { name: "phone", label: "No. HP / WhatsApp", type: "tel", icon: Phone, placeholder: "08xxxxxxxxxx" },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "Minimal 6 karakter" },
  ];

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-coffee-800 mb-2 text-center">
        Daftar Sekarang
      </h1>
      <p className="text-coffee-500/90 text-center mb-8">
        Buat akun untuk mulai berlangganan catering harianmu.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-coffee-100/60 rounded-[1.75rem] p-8 flex flex-col gap-4 shadow-[0_24px_60px_-24px_rgba(42,33,24,0.28)]"
      >
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {errorMessage}
          </div>
        )}

        {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
          <label
            key={name}
            className="flex flex-col gap-1 text-sm font-medium text-coffee-700"
          >
            {label}
            <div className="flex items-center gap-2 bg-cream-50 rounded-xl px-4 py-3 border border-coffee-100">
              <Icon size={16} className="text-coffee-400" />
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                minLength={name === "password" ? 6 : undefined}
                className="w-full outline-none text-coffee-800 bg-transparent"
                required
              />
            </div>
          </label>
        ))}

        <Button
          type="submit"
          variant="primary"
          className="mt-4 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Memproses..." : "Daftar"}
        </Button>

        <p className="text-center text-sm text-coffee-500/80 mt-2">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-coffee-700 font-semibold underline">
            Masuk
          </Link>
        </p>

        <p className="text-center text-xs text-coffee-400/80 mt-1">
          Alamat pengantaran bisa ditambahkan setelah kamu login.
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;

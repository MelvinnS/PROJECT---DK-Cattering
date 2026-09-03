import { useState } from "react";
import { Pencil, Mail, Phone, MapPin, Check, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { dummyProfileExtra } from "../../data/profileDummyData";
import Button from "../../components/common/Button";

/**
 * ⚠️ DUMMY — belum terhubung ke endpoint update profil di backend (belum
 * ada). Perubahan cuma tersimpan di state lokal halaman ini (hilang kalau
 * refresh). Nanti tinggal ganti handleSave() dengan panggilan API asli.
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const { orders } = useOrder();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: dummyProfileExtra.phone,
    address: dummyProfileExtra.address,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Dummy — belum ada API update profil, jadi cuma disimpan di state lokal.
    setIsEditing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const initials = (form.fullName || "U")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Email sengaja tidak masuk daftar ini — read-only, ditampilkan terpisah
  // di bawah nama (backend belum sediakan endpoint ubah email).
  const contactFields = [
    { name: "phone", label: "No. HP / WhatsApp", icon: Phone, type: "tel" },
    { name: "address", label: "Alamat Pengantaran", icon: MapPin, type: "text" },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {showSaved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
          <Check size={16} /> Perubahan berhasil disimpan.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-[1.75rem] md:rounded-[2rem] overflow-hidden shadow-[0_24px_60px_-24px_rgba(42,33,24,0.28)] border border-coffee-100/60"
      >
        {/* Cover */}
        <div className="relative h-28 md:h-36 bg-gradient-to-br from-accent-400 via-accent-500 to-coffee-800">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur text-coffee-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Pencil size={14} /> Edit Profil
            </button>
          )}
        </div>

        <div className="px-6 md:px-10">
          {/* Avatar overlap */}
          <div className="-mt-11 md:-mt-12 mb-4">
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              <div className="w-full h-full rounded-full bg-coffee-700 text-cream-50 flex items-center justify-center text-2xl md:text-3xl font-bold border-4 border-white shadow-md">
                {initials}
              </div>
              {isEditing && (
                <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent-600 text-cream-50 flex items-center justify-center border-2 border-white">
                  <Camera size={14} />
                </span>
              )}
            </div>
          </div>

          {/* Nama & email */}
          {isEditing ? (
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="text-xl md:text-2xl font-extrabold text-coffee-800 bg-cream-50 rounded-xl px-3 py-1.5 border border-coffee-100 outline-none w-full max-w-xs mb-1"
            />
          ) : (
            <h1 className="text-xl md:text-2xl font-extrabold text-coffee-800 mb-1">
              {form.fullName}
            </h1>
          )}
          <p className="text-sm text-coffee-500/80 flex items-center gap-1.5">
            <Mail size={13} /> {form.email}
            <span className="text-coffee-400">· tidak bisa diubah</span>
          </p>

          {/* Statistik singkat — angka nyata dari data pesanan */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-cream-100/70 rounded-2xl px-4 py-3 text-center">
              <p className="text-lg font-extrabold text-coffee-800">
                {orders.length}
              </p>
              <p className="text-xs text-coffee-500/80">Total Pesanan</p>
            </div>
            <div className="bg-cream-100/70 rounded-2xl px-4 py-3 text-center">
              <p className="text-lg font-extrabold text-coffee-800">Member</p>
              <p className="text-xs text-coffee-500/80">Sejak 2026</p>
            </div>
          </div>

          {/* Informasi kontak — bisa diedit */}
          <div className="mt-8 mb-8 flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.16em] text-coffee-400 uppercase">
              Informasi Kontak
            </p>
            {contactFields.map(({ name, label, icon: Icon, type }) => (
              <label
                key={name}
                className="flex flex-col gap-1 text-sm font-medium text-coffee-700"
              >
                {label}
                <div
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors ${
                    isEditing
                      ? "bg-cream-50 border-coffee-200"
                      : "bg-cream-50/60 border-transparent"
                  }`}
                >
                  <Icon size={16} className="text-accent-600 shrink-0" />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full outline-none text-coffee-800 bg-transparent"
                  />
                </div>
              </label>
            ))}
          </div>

          {isEditing ? (
            <div className="flex gap-3 pb-8">
              <Button type="submit" variant="primary" className="flex-1">
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </Button>
            </div>
          ) : (
            <div className="pb-8" />
          )}
        </div>
      </form>
    </section>
  );
};

export default ProfilePage;

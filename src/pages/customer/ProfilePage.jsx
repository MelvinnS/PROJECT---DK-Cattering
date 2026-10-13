import { useState, useEffect } from "react";
import {
  Pencil,
  Mail,
  Phone,
  Check,
  Loader2,
  AlertCircle,
  MapPin,
  Plus,
  Trash2,
  Star,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  deleteAddress,
  setPrimaryAddress,
} from "../../services/userService";
import Button from "../../components/common/Button";

const ProfilePage = () => {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // State untuk alamat pengiriman
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Rumah",
    fullAddress: "",
    note: "",
    latitude: -6.2,
    longitude: 106.816666,
    isPrimary: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState(null);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await getAddresses();
      setAddresses(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      console.error("Gagal memuat alamat:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullAddress.trim()) {
      setAddressError("Alamat lengkap wajib diisi");
      return;
    }
    setIsSavingAddress(true);
    setAddressError(null);
    try {
      await createAddress({
        label: addressForm.label.trim() || "Rumah",
        fullAddress: addressForm.fullAddress.trim(),
        note: addressForm.note.trim() || undefined,
        latitude: Number(addressForm.latitude) || -6.2,
        longitude: Number(addressForm.longitude) || 106.816666,
        isPrimary: addressForm.isPrimary,
      });
      setAddressModalOpen(false);
      setAddressForm({
        label: "Rumah",
        fullAddress: "",
        note: "",
        latitude: -6.2,
        longitude: 106.816666,
        isPrimary: false,
      });
      await loadAddresses();
    } catch (err) {
      setAddressError(err.message || "Gagal menambahkan alamat");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryAddress(id);
      await loadAddresses();
    } catch (err) {
      alert(err.message || "Gagal mengubah alamat utama");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Hapus alamat ini?")) return;
    try {
      await deleteAddress(id);
      await loadAddresses();
    } catch (err) {
      alert(err.message || "Gagal menghapus alamat");
    }
  };

  // Muat profil dari BE saat halaman dibuka
  useEffect(() => {
    const load = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const data = await getProfile();
        setProfile(data);
        setForm({ fullName: data.fullName ?? "", phone: data.phone ?? "" });
      } catch (err) {
        console.error("Gagal memuat profil:", err);
        setProfileError(err.message ?? "Gagal memuat profil");
        // Fallback ke data dari AuthContext
        if (authUser) {
          setForm({ fullName: authUser.fullName ?? "", phone: "" });
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };
    load();
  }, [authUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateProfile({
        fullName: form.fullName,
        phone: form.phone,
      });
      setProfile(updated);
      setIsEditing(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2500);
    } catch (err) {
      console.error("Gagal simpan profil:", err);
      setSaveError(err.message ?? "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = form.fullName || authUser?.fullName || "U";
  const initials = displayName
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const email = profile?.email ?? authUser?.email ?? "";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {showSaved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
          <Check size={16} /> Perubahan berhasil disimpan.
        </div>
      )}

      {isLoadingProfile ? (
        <div className="flex items-center justify-center gap-3 py-20 text-coffee-500/70">
          <Loader2 size={24} className="animate-spin text-accent-600" />
          <span>Memuat profil...</span>
        </div>
      ) : (
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
            {/* Avatar */}
            <div className="-mt-11 md:-mt-12 mb-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-coffee-700 text-cream-50 flex items-center justify-center text-2xl md:text-3xl font-bold border-4 border-white shadow-md">
                {initials}
              </div>
            </div>

            {/* Error banner profil */}
            {profileError && (
              <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                Gagal memuat data terkini. Menampilkan data terakhir yang tersimpan.
              </div>
            )}

            {/* Nama */}
            {isEditing ? (
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="text-xl md:text-2xl font-extrabold text-coffee-800 bg-cream-50 rounded-xl px-3 py-1.5 border border-coffee-100 outline-none w-full max-w-xs mb-1"
              />
            ) : (
              <h1 className="text-xl md:text-2xl font-extrabold text-coffee-800 mb-1">
                {form.fullName || "(Nama belum diisi)"}
              </h1>
            )}

            <p className="text-sm text-coffee-500/80 flex items-center gap-1.5 mb-6">
              <Mail size={13} /> {email}
              <span className="text-coffee-400">· tidak bisa diubah</span>
            </p>

            {/* Field: No HP */}
            <div className="mb-8 flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-coffee-400 uppercase">
                Informasi Kontak
              </p>
              <label className="flex flex-col gap-1 text-sm font-medium text-coffee-700">
                No. HP / WhatsApp
                <div
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors ${
                    isEditing
                      ? "bg-cream-50 border-coffee-200"
                      : "bg-cream-50/60 border-transparent"
                  }`}
                >
                  <Phone size={16} className="text-accent-600 shrink-0" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    placeholder="08xxxxxxxxxx"
                    className="w-full outline-none text-coffee-800 bg-transparent"
                  />
                </div>
              </label>
            </div>

            {/* Save Error */}
            {saveError && (
              <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                {saveError}
              </div>
            )}

            {isEditing ? (
              <div className="flex gap-3 pb-8">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  icon={isSaving ? Loader2 : undefined}
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setSaveError(null);
                    // Reset form ke data profil terakhir
                    if (profile) {
                      setForm({ fullName: profile.fullName ?? "", phone: profile.phone ?? "" });
                    }
                  }}
                >
                  Batal
                </Button>
              </div>
            ) : (
              <div className="pb-8" />
            )}
          </div>
        </form>
      )}

      {/* ── BAGIAN ALAMAT PENGIRIMAN ── */}
      <div className="mt-8 bg-white rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 shadow-[0_24px_60px_-24px_rgba(42,33,24,0.28)] border border-coffee-100/60">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-coffee-100">
          <div>
            <h2 className="text-xl font-extrabold text-coffee-800 flex items-center gap-2">
              <MapPin size={20} className="text-accent-600" />
              Alamat Pengiriman
            </h2>
            <p className="text-xs text-coffee-500 mt-0.5">
              Kelola alamat tujuan untuk pesanan catering harianmu
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAddressError(null);
              setAddressModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
          >
            <Plus size={14} /> Tambah Alamat
          </button>
        </div>

        {isLoadingAddresses ? (
          <div className="flex items-center justify-center gap-2 py-8 text-coffee-400 text-sm">
            <Loader2 size={18} className="animate-spin text-accent-600" />
            <span>Memuat daftar alamat...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-coffee-400 text-sm bg-cream-50/50 rounded-2xl border border-dashed border-coffee-200">
            Belum ada alamat tersimpan. Klik "Tambah Alamat" untuk menambahkan alamat pengiriman.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  addr.isPrimary
                    ? "bg-accent-50/40 border-accent-300 shadow-xs"
                    : "bg-cream-50/30 border-coffee-100/70 hover:border-coffee-200"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-coffee-800 text-sm">
                      {addr.label}
                    </span>
                    {addr.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-accent-600 text-white px-2 py-0.5 rounded-full">
                        <Star size={10} className="fill-white" /> Utama
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-coffee-600 leading-relaxed">
                    {addr.fullAddress}
                  </p>
                  {addr.note && (
                    <p className="text-[11px] text-coffee-400 mt-0.5 italic">
                      Catatan: {addr.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!addr.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(addr.id)}
                      className="text-xs text-coffee-600 hover:text-accent-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors"
                    >
                      Jadikan Utama
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-coffee-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                    title="Hapus Alamat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL TAMBAH ALAMAT ── */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-coffee-100 animate-fade-slide-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-coffee-100">
              <h3 className="font-extrabold text-lg text-coffee-800">
                Tambah Alamat Baru
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="p-1 text-coffee-400 hover:text-coffee-700 rounded-full hover:bg-cream-100"
              >
                <X size={20} />
              </button>
            </div>

            {addressError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{addressError}</span>
              </div>
            )}

            <form onSubmit={handleAddAddress} className="flex flex-col gap-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Label Alamat
                </label>
                <input
                  type="text"
                  placeholder="Rumah, Kantor, Kost..."
                  value={addressForm.label}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, label: e.target.value })
                  }
                  required
                  className="w-full bg-cream-50 border border-coffee-200 rounded-xl px-3 py-2 text-coffee-800 outline-none focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..."
                  value={addressForm.fullAddress}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullAddress: e.target.value })
                  }
                  required
                  className="w-full bg-cream-50 border border-coffee-200 rounded-xl px-3 py-2 text-coffee-800 outline-none focus:border-accent-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Catatan untuk Kurir (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Pagar warna hitam, titip satpam..."
                  value={addressForm.note}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, note: e.target.value })
                  }
                  className="w-full bg-cream-50 border border-coffee-200 rounded-xl px-3 py-2 text-coffee-800 outline-none focus:border-accent-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrimaryCheckbox"
                  checked={addressForm.isPrimary}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, isPrimary: e.target.checked })
                  }
                  className="rounded border-coffee-300 text-accent-600 focus:ring-accent-500"
                />
                <label
                  htmlFor="isPrimaryCheckbox"
                  className="text-xs font-medium text-coffee-700 cursor-pointer select-none"
                >
                  Jadikan sebagai alamat utama
                </label>
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSavingAddress}
                  icon={isSavingAddress ? Loader2 : undefined}
                >
                  {isSavingAddress ? "Menyimpan..." : "Simpan Alamat"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setAddressModalOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;


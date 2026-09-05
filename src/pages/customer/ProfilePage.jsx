import { useState, useEffect } from "react";
import { Pencil, Mail, Phone, Check, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../services/userService";
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
    </section>
  );
};

export default ProfilePage;

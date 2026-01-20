import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import api from "../services/api";
import { User as UserIcon } from "lucide-react"; // Ikon user sebagai pengganti avatar
import { User, Mail, Phone, MapPin, Lock, LogOut, Camera } from "lucide-react"; // Ikon dari lucide-react

const Akun = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    no_telpon: "",
    alamat: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Mode edit untuk informasi pribadi
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        no_telpon: parsedUser.no_telpon || "",
        alamat: parsedUser.alamat || "",
      }));
    } else {
      // Jika tidak ada data user di localStorage, redirect ke halaman login
      navigate("/login");
    }
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Kembalikan nilai awal dari user
    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      no_telpon: user.no_telpon || "",
      alamat: user.alamat || "",
    }));
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Tampilkan notifikasi
    toast.success('Anda telah berhasil logout.');

    // Beri jeda sebelum membersihkan data dan redirect
    setTimeout(() => {
      // Hapus data dari localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Arahkan ke halaman login
      navigate("/login");
    }, 1500); // Tunggu 1.5 detik
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        no_telpon: formData.no_telpon,
        alamat: formData.alamat,
      };

      // Cek apakah ada field password yang diisi
      const hasPasswordFields = formData.current_password || formData.password || formData.password_confirmation;

      // Jika ada field password yang diisi, pastikan semuanya diisi
      if (hasPasswordFields) {
        if (!formData.current_password || !formData.password || !formData.password_confirmation) {
          toast.error("Mohon lengkapi semua field password (lama, baru, dan konfirmasi).");
          setSaving(false);
          return;
        }

        // Validasi bahwa password baru dan konfirmasi cocok
        if (formData.password !== formData.password_confirmation) {
          toast.error("Password baru dan konfirmasi password harus sama.");
          setSaving(false);
          return;
        }

        payload.current_password = formData.current_password;
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      const response = await api.put("/user/profile", payload);
      const updatedUser = response.data.user || {};
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));

      // Reset form password setelah berhasil
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));

      // Tutup form edit jika sedang dalam mode edit
      if (isEditing) {
        setIsEditing(false);
      }

      // Tutup form password jika sedang dalam mode ubah password
      if (showPasswordFields) {
        setShowPasswordFields(false);
      }

      toast.success(hasPasswordFields ? "Profil dan password berhasil diperbarui." : "Profil berhasil diperbarui.");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Gagal memperbarui profil.";
      toast.error(message);
      console.error("Update profile error:", error.response || error);
    } finally {
      setSaving(false);
    }
  };

  // Menampilkan pesan loading jika data user belum siap
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-74px)] flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-[calc(100vh-74px)] py-8 sm:py-12 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header dengan warna navbar */}
        <div className="bg-[#010E31] p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar pengguna */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-[#010E31] rounded-full p-2 shadow-md hover:bg-[#0B1535] transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{user.name || "Pengguna"}</h1>
              <p className="text-blue-200 mt-1">{user.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="bg-blue-500/20 text-blue-100 text-xs px-3 py-1 rounded-full">Pelanggan Setia</span>
                <span className="bg-indigo-500/20 text-indigo-100 text-xs px-3 py-1 rounded-full">Member Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Informasi Pribadi */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informasi Pribadi
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  ) : (
                    <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-default">
                      {formData.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Alamat Email
                  </label>
                  <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed">
                    {formData.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Nomor Telepon
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.no_telpon}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, no_telpon: event.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  ) : (
                    <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-default">
                      {formData.no_telpon}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Alamat
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.alamat}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, alamat: event.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={2}
                      required
                    />
                  ) : (
                    <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-default resize-none">
                      {formData.alamat}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 h-10 rounded-lg bg-gray-300 text-gray-700 font-medium shadow hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow hover:from-blue-700 hover:to-blue-800 transition-all"
                    disabled={saving}
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}
            </div>

            {/* Ubah Kata Sandi */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Ubah Kata Sandi
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (showPasswordFields) {
                      // Jika form sedang terbuka, tutup form dan kosongkan field
                      setFormData(prev => ({
                        ...prev,
                        current_password: "",
                        password: "",
                        password_confirmation: ""
                      }));
                    }
                    setShowPasswordFields(!showPasswordFields);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showPasswordFields ? "Batal" : "Ubah Password"}
                </button>
              </div>

              {showPasswordFields && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Password Lama</label>
                      <input
                        type="password"
                        placeholder="Masukkan password lama"
                        value={formData.current_password}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, current_password: event.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Password Baru</label>
                      <input
                        type="password"
                        placeholder="Masukkan password baru"
                        value={formData.password}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, password: event.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Konfirmasi Password</label>
                      <input
                        type="password"
                        placeholder="Ulangi password baru"
                        value={formData.password_confirmation}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            password_confirmation: event.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Pastikan password memiliki minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="flex-1 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow hover:from-blue-700 hover:to-blue-800 transition-all"
                      disabled={saving}
                    >
                      {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <div className="border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] border border-red-600 hover:border-red-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout dari Akun</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Akun;

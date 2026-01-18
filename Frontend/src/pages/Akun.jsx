import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // Import toast
import api from "../services/api";

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

      if (formData.password) {
        payload.current_password = formData.current_password;
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      const response = await api.put("/user/profile", payload);
      const updatedUser = response.data.user || {};
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));
      toast.success("Profil berhasil diperbarui.");
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 min-h-[calc(100vh-74px)] py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-6">
          PROFIL PENGGUNA
        </h1>

        <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Alamat Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50"
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Nomor Telepon
            </label>
            <input
              type="text"
              value={formData.no_telpon}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, no_telpon: event.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Alamat
            </label>
            <textarea
              value={formData.alamat}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, alamat: event.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
              rows={2}
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-500">Ubah Password</p>
            <input
              type="password"
              placeholder="Password lama"
              value={formData.current_password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, current_password: event.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
            />
            <input
              type="password"
              placeholder="Password baru"
              value={formData.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.target.value }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
            />
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={formData.password_confirmation}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  password_confirmation: event.target.value,
                }))
              }
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-2 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md hover:bg-[#326188] transition-colors"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full h-11 mt-8 rounded-full bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default Akun;

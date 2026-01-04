import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // Import toast

const Akun = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
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

  // Menampilkan pesan loading jika data user belum siap
  if (!user) {
    return (
      <div className="h-[calc(100vh-74px)] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 h-[calc(100vh-74px)] py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-6">
          PROFIL PENGGUNA
        </h1>

        <div className="space-y-4 text-gray-700">
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Nama Lengkap
            </label>
            <p className="text-base">{user.name}</p>
          </div>
          <hr />
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Alamat Email
            </label>
            <p className="text-base">{user.email}</p>
          </div>
          <hr />
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Nomor Telepon
            </label>
            <p className="text-base">{user.no_telpon || "-"}</p>
          </div>
          <hr />
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-gray-500">
              Alamat
            </label>
            <p className="text-base">{user.alamat || "-"}</p>
          </div>
        </div>

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

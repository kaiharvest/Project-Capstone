// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Biar yang bisa scroll cuma kolom kanan (bukan halaman)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  return (
   
      <div className="h-[calc(100vh-74px)] w-full flex overflow-hidden">
      {/* LEFT SIDE (FIX / TIDAK SCROLL) */}
      <div className="w-1/2 h-full bg-[#010E31] px-20 py-10 flex flex-col justify-center overflow-hidden">
        <div className="leading-none">
          <div className="text-white font-extrabold text-6xl tracking-tight flex items-center gap-2">
            <span>JA</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#F17300] inline-block translate-y-2" />
          </div>
          <div className="text-white font-extrabold text-6xl tracking-tight -mt-2">
            Bordir
          </div>
        </div>

        <p className="text-[#B9C6DA] text-[14px] leading-5 mt-6 max-w-xs">
          JA Bordir, tempat di mana kualitas dan ketelitian menjadi prioritas
          utama dalam setiap hasil karya. Kami hadir untuk memenuhi kebutuhan
          bordir Anda dengan layanan yang profesional, mulai dari bordir
          seragam, logo, nama, hingga desain khusus sesuai permintaan. Dengan
          dukungan pengalaman dan peralatan yang memadai, JA Bordir berkomitmen
          memberikan hasil yang rapi, kuat, dan estetik. Setiap pesanan bagi
          kami adalah amanah, sehingga kami selalu mengerjakannya dengan penuh
          perhatian serta tanggung jawab.
        </p>
      </div>

      {/* RIGHT SIDE (SEMUA ISI KANAN BISA SCROLL) */}
      <div className="flex-1 h-full bg-[#F7F7F7] overflow-hidden">
        {/* ini yang scroll */}
        <div className="h-full overflow-y-auto px-20 py-10 pb-24">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-center text-[#010E31] font-extrabold text-2xl tracking-widest mb-10">
              REGISTER
            </h1>

            <form className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Nama:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Nomor Telepon:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor telepon anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Alamat:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan alamat anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan username anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Password:
                </label>
                <div className="w-full h-10 rounded-full bg-white px-5 shadow-md border border-gray-200 flex items-center">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Masukkan password anda"
                    className="flex-1 text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="ml-3 opacity-60 hover:opacity-90"
                    aria-label="Toggle password"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12C3.6 7.6 7.4 5 12 5C16.6 5 20.4 7.6 22 12C20.4 16.4 16.6 19 12 19C7.4 19 3.6 16.4 2 12Z"
                        stroke="#6B7280"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z"
                        stroke="#6B7280"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Konfirmasi Password:
                </label>
                <div className="w-full h-10 rounded-full bg-white px-5 shadow-md border border-gray-200 flex items-center">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Masukkan password anda"
                    className="flex-1 text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="ml-3 opacity-60 hover:opacity-90"
                    aria-label="Toggle confirm password"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12C3.6 7.6 7.4 5 12 5C16.6 5 20.4 7.6 22 12C20.4 16.4 16.6 19 12 19C7.4 19 3.6 16.4 2 12Z"
                        stroke="#6B7280"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z"
                        stroke="#6B7280"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md mt-2"
              >
                Register
              </button>
            </form>

            <div className="text-center text-[12px] mt-6">
              <span className="font-bold text-gray-700">Sudah punya akun?</span>{" "}
              <Link to="/login" className="text-[#3E78A9] font-bold">
                Login sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

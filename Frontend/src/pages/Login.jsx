// src/pages/Login.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    // NOTE: 60px = tinggi navbar kamu (sesuaikan kalau beda)
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

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-[#F7F7F7] px-20 py-10 flex flex-col justify-center overflow-hidden">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-10">
            LOGIN
          </h1>

          <form className="space-y-5">
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

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                Password:
              </label>
              <input
                type="password"
                placeholder="Masukkan password anda"
                className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md mt-2"
            >
              Login
            </button>
          </form>

          {/* FOOTER TEXT */}
          <div className="text-center text-[12px] mt-6">
            <span className="font-bold text-gray-700">
              Anda belum punya akun?
            </span>{" "}
            <Link to="/register" className="text-[#3E7CB1] font-bold">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

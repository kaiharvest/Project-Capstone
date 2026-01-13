// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login berhasil!");

      if (user.role === "admin") {
        navigate("/admin/beranda"); // Arahkan admin ke halaman utama admin
      } else {
        navigate("/akun");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login gagal. Periksa kembali email dan password Anda.";
      toast.error(errorMessage);
      console.error("Login error:", err.response || err);
    }
  };

  return (
    <>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#010E31]/90 text-white text-xl shadow-lg hover:bg-[#010E31] cursor-pointer"
      >
        &lt;
      </button>

      <div className="h-screen w-full flex overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 h-full bg-[#010E31] p-12 flex-col justify-center">
          <div className="max-w-md mx-auto text-left">
            <div className="text-white font-black tracking-wider text-7xl leading-none">
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">JA</span>
              <span className="text-[#F17300] mx-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">•</span>
              <br />
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Bordir</span>
            </div>

            <h2 className="text-[#B9C6DA] font-medium text-lg mt-4 mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
              Kualitas dan Ketelitian dalam Setiap Jahitan
            </h2>

            <p className="text-[#B9C6DA]/80 text-base leading-relaxed">
              Dari seragam hingga desain custom, kami hadir untuk memberikan hasil
              bordir yang rapi, kuat, dan estetik. Setiap pesanan adalah amanah
              yang kami kerjakan dengan penuh tanggung jawab.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 bg-[#F7F7F7] px-20 py-10 flex flex-col justify-center overflow-hidden">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-10">
              LOGIN
            </h1>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#3E7CB1] hover:underline cursor-pointer"
                >
                  Lupa Password?
                </Link>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md cursor-pointer"
              >
                Login
              </button>
            </form>

            <div className="text-center text-[12px] mt-6">
              <span className="font-bold text-gray-700">
                Anda belum punya akun?
              </span>{" "}
              <Link
                to="/register"
                className="text-[#3E7CB1] font-bold cursor-pointer"
              >
                Daftar sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [no_telpon, setNoTelpon] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password_confirmation) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await api.post("/register", {
        name,
        no_telpon,
        email,
        alamat,
        username,
        password,
        password_confirmation,
      });

      toast.success("Registrasi berhasil! Anda akan diarahkan ke halaman login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        toast.error(errorMessages.join("\n"));
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error("Registration error:", err.response || err);
    }
  };

  return (
    <>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#010E31]/90 text-white shadow-lg hover:bg-[#010E31] hover:scale-105 transition-all cursor-pointer"
        aria-label="Kembali"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
      </button>

      <div className="h-screen w-full flex overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 h-full bg-[#010E31] p-12 flex-col justify-center">
          <div className="max-w-md mx-auto text-left">
            <div className="text-white font-black tracking-wider text-7xl leading-none">
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                JA
              </span>
              <span className="text-[#F17300] mx-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                •
              </span>
              <br />
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                Bordir
              </span>
            </div>

            <h2 className="text-[#B9C6DA] font-medium text-lg mt-4 mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
              Kualitas dan Ketelitian dalam Setiap Jahitan
            </h2>

            <p className="text-[#B9C6DA]/80 text-base leading-relaxed">
              Dari seragam hingga desain custom, kami hadir untuk memberikan
              hasil bordir yang rapi, kuat, dan estetik. Setiap pesanan adalah
              amanah yang kami kerjakan dengan penuh tanggung jawab.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (SCROLL DI KANAN SAJA) */}
        <div className="flex-1 h-full bg-[#F7F7F7] overflow-hidden">
          <div className="h-full overflow-y-auto px-20 py-10 pb-24">
            <div className="max-w-md w-full mx-auto">
              <h1 className="text-center text-[#010E31] font-extrabold text-2xl tracking-widest mb-10">
                REGISTER
              </h1>

              <form className="space-y-4" onSubmit={handleRegister}>
                {/* Nama */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                    Nama:
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama anda"
                    className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
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
                    value={no_telpon}
                    onChange={(e) => setNoTelpon(e.target.value)}
                    required
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    required
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="ml-3 opacity-60 hover:opacity-90 cursor-pointer"
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
                      value={password_confirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="ml-3 opacity-60 hover:opacity-90 cursor-pointer"
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
                  className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md mt-2 cursor-pointer"
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
    </>
  );
}

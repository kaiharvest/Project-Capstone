// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Mengirim instruksi reset password...');

    try {
      const response = await api.post('/forgot-password', { email });
      
      toast.success(response.data.message || 'Instruksi telah dikirim!', { id: toastId });

      // Di environment development, kita bisa langsung arahkan dengan OTP
      const otp = response.data.otp; // Hanya ada di development
      
      // Arahkan ke halaman reset password setelah 2 detik
      setTimeout(() => {
        // Kita teruskan email ke halaman berikutnya via state
        navigate('/reset-password', { state: { email, otp } }); 
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mengirim instruksi. Periksa kembali email Anda.';
      toast.error(errorMessage, { id: toastId });
      console.error("Forgot password error:", err.response || err);
    }
  };

  return (
    <div className="h-screen  w-full flex bg-[#F7F7F7] items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-6">
          LUPA PASSWORD
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan kode OTP untuk mereset password Anda.
        </p>

        <form className="space-y-5" onSubmit={handleForgotPassword}>
          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-2">
              Email:
            </label>
            <input
              type="email"
              placeholder="Masukkan email terdaftar anda"
              className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md mt-2"
          >
            Kirim Kode OTP
          </button>
        </form>

        <div className="text-center text-[12px] mt-6">
          <Link to="/login" className="text-[#3E7CB1] font-bold">
            &larr; Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

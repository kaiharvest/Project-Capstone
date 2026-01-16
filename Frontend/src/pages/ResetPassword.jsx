// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil email dari state yang dikirim dari halaman forgot-password
  const email = location.state?.email;

  // Jika tidak ada email, user tidak seharusnya ada di sini. Redirect.
  useEffect(() => {
    if (!email) {
      toast.error("Sesi tidak valid. Silakan ulangi dari awal.");
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== password_confirmation) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    const toastId = toast.loading('Mereset password...');

    try {
      const response = await api.post('/reset-password', {
        email,
        otp,
        password,
        password_confirmation
      });
      
      toast.success(response.data.message || 'Password berhasil direset!', { id: toastId });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal mereset password. Periksa kembali data Anda.';
      toast.error(errorMessage, { id: toastId });
      console.error("Reset password error:", err.response || err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] w-full flex bg-[#F7F7F7] items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-center text-[#001243] font-extrabold text-2xl tracking-widest mb-6">
          RESET PASSWORD
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Masukkan kode OTP yang dikirim ke <strong>{email}</strong> dan password baru Anda.
        </p>

        <form className="space-y-5" onSubmit={handleResetPassword}>
          {/* OTP */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-2">
              Kode OTP:
            </label>
            <input
              type="text"
              placeholder="Masukkan kode OTP 6 digit"
              className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-2">
              Password Baru:
            </label>
            <input
              type="password"
              placeholder="Masukkan password baru"
              className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Konfirmasi Password Baru */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-2">
              Konfirmasi Password Baru:
            </label>
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              className="w-full h-10 rounded-full bg-white px-5 text-sm text-gray-700 placeholder:text-gray-300 shadow-md border border-gray-200 outline-none"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#3E78A9] text-white font-semibold shadow-md mt-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

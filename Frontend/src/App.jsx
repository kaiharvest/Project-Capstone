import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// USER PAGES
import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Portofolio from "./pages/Portofolio";
import Pesan from "./pages/Pesan";
import Pembayaran from "./pages/Pembayaran"; // <-- TAMBAH (buat file Pembayaran.jsx)
import Pesanan from "./pages/Pesanan";
import Keranjang from "./pages/Keranjang";
import Akun from "./pages/Akun";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ADMIN
import BerandaAdmin from "./pages/Admin/BerandaAdmin";
import EditProduk from "./pages/Admin/EditProduk";
import KelolaUser from "./pages/Admin/KelolaUser";
import LaporanPenjualan from "./pages/Admin/LaporanPenjualan";
import StatusBarang from "./pages/Admin/StatusBarang";
import StatusTransaksi from "./pages/Admin/StatusTransaksi";
import EditProfil from "./pages/Admin/EditProfil";

// OPTIONAL: 404 sederhana (boleh kamu pindah ke pages/NotFound.jsx)
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-gray-600 mt-2">Halaman tidak ditemukan.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ===== USER LAYOUT ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/portofolio" element={<Portofolio />} />
          <Route path="/pesan" element={<Pesan />} />
          <Route path="/pembayaran" element={<Pembayaran />} /> {/* <-- TAMBAH */}
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/akun" element={<Akun />} />
        </Route>

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== ADMIN LAYOUT ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* default admin route */}
          <Route index element={<Navigate to="beranda" replace />} />
          <Route path="beranda" element={<BerandaAdmin />} />
          <Route path="produk" element={<EditProduk />} />
          <Route path="users" element={<KelolaUser />} />
          <Route path="laporan" element={<LaporanPenjualan />} />
          <Route path="status-barang" element={<StatusBarang />} />
          <Route path="status-transaksi" element={<StatusTransaksi />} />
          <Route path="edit-profil" element={<EditProfil />} />
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

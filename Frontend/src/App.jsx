import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/MainLayout";
import AdminLayout from "./layouts/AdminLayout";


// USER PAGES
import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Portofolio from "./pages/Portofolio";
import Pesan from "./pages/Pesan";
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

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* ===== USER LAYOUT ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/portofolio" element={<Portofolio />} />
          <Route path="/pesan" element={<Pesan />} />
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/akun" element={<Akun />} />
        </Route>

        {/* ===== AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== ADMIN ===== */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/beranda" element={<BerandaAdmin />} />
          <Route path="/admin/produk" element={<EditProduk />} />
          <Route path="/admin/users" element={<KelolaUser />} />
          <Route path="/admin/laporan" element={<LaporanPenjualan />} />
          <Route path="/admin/status-barang" element={<StatusBarang />} />
          <Route path="/admin/status-transaksi" element={<StatusTransaksi />} />
          <Route path="/admin/edit-profil" element={<EditProfil />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

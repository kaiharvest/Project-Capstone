import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  ShoppingCart,
  Box,
  FileText,
  LogOut
} from "lucide-react";

const menuItems = [
  { label: "Beranda", icon: LayoutDashboard, to: "/admin/beranda" },
  { label: "Kelola User", icon: Users, to: "/admin/users" },
  { label: "Edit Profil", icon: UserCircle, to: "/admin/edit-profil" },
  { label: "Edit Produk", icon: Package, to: "/admin/produk" },
  { label: "Status Transaksi", icon: ShoppingCart, to: "/admin/status-transaksi" },
  { label: "Status Barang", icon: Box, to: "/admin/status-barang" },
  { label: "Laporan Penjualan", icon: FileText, to: "/admin/laporan" }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[280px] bg-gradient-to-b from-[#0B1A3A] to-[#06122B] h-screen px-5 py-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-white text-2xl font-extrabold leading-none tracking-wide">
          JA<span className="text-red-500">.</span>
        </h1>
        <p className="text-white text-xl font-semibold">Bordir</p>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={i}
              to={item.to}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all
                ${
                  isActive
                    ? "bg-white text-[#0B1A3A] shadow-sm ring-1 ring-white"
                    : "text-white hover:bg-white/5 ring-1 ring-white/30 hover:ring-white/60"
                }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors mt-8 w-[120px]">
        <LogOut size={18} />
        <span className="text-sm font-semibold">Keluar</span>
      </button>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

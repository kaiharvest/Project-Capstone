import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  ShoppingCart,
  Box,
  FileText,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active menu based on current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes('/admin/beranda')) return 'beranda';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/produk')) return 'products';
    if (path.includes('/admin/status-transaksi')) return 'transactions';
    if (path.includes('/admin/status-barang')) return 'orders';
    if (path.includes('/admin/laporan')) return 'reports';
    if (path.includes('/admin/edit-profil')) return 'profile';
    return 'beranda'; // default
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard, path: '/admin/beranda' },
    { id: 'users', label: 'Kelola User', icon: Users, path: '/admin/users' },
    { id: 'profile', label: 'Edit Profil', icon: UserCircle, path: '/admin/edit-profil' },
    { id: 'products', label: 'Edit Produk', icon: Package, path: '/admin/produk' },
    { id: 'transactions', label: 'Status Transaksi', icon: ShoppingCart, path: '/admin/status-transaksi' },
    { id: 'orders', label: 'Status Barang', icon: Box, path: '/admin/status-barang' },
    { id: 'reports', label: 'Laporan Penjualan', icon: FileText, path: '/admin/laporan' }
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 min-h-screen p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">
            JA<span className="text-red-500">.</span>
          </h1>
          <p className="text-white text-xl">Bordir</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors mt-4"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
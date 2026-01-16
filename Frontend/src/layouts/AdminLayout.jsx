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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3">
        <div>
          <h1 className="text-white text-2xl font-bold">
            JA<span className="text-red-500">.</span>
          </h1>
          <p className="text-white text-sm">Bordir</p>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="text-white px-3 py-2 rounded-md border border-slate-700 hover:bg-slate-800"
        >
          Menu
        </button>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-slate-900 p-4 flex flex-col transform transition-transform md:static md:translate-x-0 md:w-64 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between md:block">
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold">
              JA<span className="text-red-500">.</span>
            </h1>
            <p className="text-white text-xl">Bordir</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white px-3 py-2 rounded-md border border-slate-700 hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                navigate(item.path);
                setIsSidebarOpen(false);
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
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

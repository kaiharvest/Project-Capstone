import React from 'react';
import {
  Users,
  Box,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

// Mock data - nanti ganti dengan axios call ke Laravel backend
const mockStats = {
  totalTransactions: 67,
  totalProducts: 500,
  totalRevenue: 200000000,
  totalUsers: 257
};

const mockSalesData = [
  { month: 'Jan', sales: 45 },
  { month: 'Feb', sales: 35 },
  { month: 'Mar', sales: 60 },
  { month: 'Apr', sales: 50 },
  { month: 'Mei', sales: 40 },
  { month: 'Jun', sales: 65 },
  { month: 'Jul', sales: 55 },
  { month: 'Agu', sales: 45 },
  { month: 'Sep', sales: 70 },
  { month: 'Okt', sales: 60 },
  { month: 'Nov', sales: 50 },
  { month: 'Des', sales: 75 }
];

const BerandaAdmin = () => {
  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Selamat Datang Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-200 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-blue-600">Pengguna Terdaftar</p>
          </div>
          <p className="text-4xl font-bold text-blue-900">{mockStats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-cyan-200 p-3 rounded-full">
              <Box className="text-cyan-600" size={24} />
            </div>
            <p className="text-sm text-cyan-600">Kategori Bordir</p>
          </div>
          <p className="text-4xl font-bold text-cyan-900">5</p>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-sky-200 p-3 rounded-full">
              <ShoppingCart className="text-sky-600" size={24} />
            </div>
            <p className="text-sm text-sky-600">Total Transaksi</p>
          </div>
          <p className="text-4xl font-bold text-sky-900">{mockStats.totalTransactions}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-200 p-3 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-blue-600">Pemasukan Total (Rp)</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">{mockStats.totalRevenue.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Grafik Penjualan</h2>
          <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm">
            <option>2026-2027</option>
          </select>
        </div>
        <div className="flex items-end justify-around h-48 sm:h-64 gap-2">
          {mockSalesData.map((data, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-amber-400 to-amber-500 rounded-t-lg transition-all hover:from-amber-500 hover:to-amber-600"
                style={{ height: `${(data.sales / 75) * 100}%` }}
              />
              <p className="text-xs text-slate-600 mt-2">{data.month}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BerandaAdmin;

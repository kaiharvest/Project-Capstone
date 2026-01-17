import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Package, 
  ShoppingCart, 
  Box,
  FileText,
  LogOut,
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  FileCheck,
  Trash2,
  Download
} from 'lucide-react';
import api from '../../services/api';

const formatOrderDetail = (order) => {
  const parts = [
    order?.service_type,
    order?.embroidery_type,
    order?.size_cm ? `${order.size_cm} cm` : null,
    order?.quantity ? `${order.quantity} pcs` : null,
    order?.shipping_method
  ];
  return parts.filter(Boolean).join(', ');
};

// Sidebar Component
const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
    { id: 'users', label: 'Kelola User', icon: Users },
    { id: 'profile', label: 'Edit Profil', icon: UserCircle },
    { id: 'products', label: 'Edit Produk', icon: Package },
    { id: 'transactions', label: 'Status Transaksi', icon: ShoppingCart },
    { id: 'orders', label: 'Status Barang', icon: Box },
    { id: 'reports', label: 'Laporan Penjualan', icon: FileText }
  ];

  return (
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
            onClick={() => setActiveMenu(item.id)}
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

      <button className="flex items-center gap-3 px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors mt-4">
        <LogOut size={20} />
        <span>Keluar</span>
      </button>
    </div>
  );
};

// Dashboard/Beranda Component
const BerandaPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Selamat Datang Admin</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
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

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Grafik Penjualan</h2>
          <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm">
            <option>2026-2027</option>
          </select>
        </div>
        <div className="flex items-end justify-around h-64 gap-2">
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

// Laporan Penjualan Component
const LaporanPage = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Laporan Penjualan</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <select className="border border-slate-300 rounded-lg px-4 py-2">
            <option>Desember</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-4 py-2">
            <option>2025</option>
          </select>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Terapkan
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="text-blue-600" size={32} />
            </div>
            <p className="text-sm text-blue-600 mb-1">Total Transaksi</p>
            <p className="text-4xl font-bold text-blue-900">257 <span className="text-lg">Transaksi</span></p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Package className="text-blue-600" size={32} />
            </div>
            <p className="text-sm text-blue-600 mb-1">Produk Terjual</p>
            <p className="text-4xl font-bold text-blue-900">500 <span className="text-lg">Produk</span></p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-sm text-blue-600 mb-1">Total Pendapatan</p>
            <p className="text-3xl font-bold text-blue-900">Rp100.000.000,-</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">Grafik Penjualan</h3>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-sm text-slate-600">Jumlah Penjualan</span>
            </div>
          </div>
          <div className="flex items-end justify-around h-48 gap-2">
            {mockSalesData.map((data, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-amber-400 to-amber-500 rounded-t-lg"
                  style={{ height: `${(data.sales / 75) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Penjualan</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Produk Terlaris</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1. Bordir Seragam</span>
                <span className="font-semibold">58 Transaksi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2. Bordir Emblem</span>
                <span className="font-semibold">45 Transaksi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>3. Bordir Topi</span>
                <span className="font-semibold">23 Transaksi</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Jenis Bordir Terlaris</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1. Bordir Biasa</span>
                <span className="font-semibold">40 Transaksi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2. Bordir 3D</span>
                <span className="font-semibold">30 Transaksi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>3. Bordir 5 Warna</span>
                <span className="font-semibold">23 Transaksi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Barang Component
const StatusBarangPage = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Box className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Status Barang</h1>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">No. Pemesanan:</span> {order.id}</p>
                <p><span className="font-semibold">Nama Pelanggan:</span> {order.customer}</p>
                <p><span className="font-semibold">Alamat:</span> {order.address}</p>
                <p><span className="font-semibold">Nomor HP:</span> {order.phone}</p>
                <p><span className="font-semibold">Kategori Bordir:</span> {order.category}</p>
                <p><span className="font-semibold">Jenis Bordir:</span> {order.type}</p>
                <p><span className="font-semibold">Ukuran:</span> {order.size}</p>
                <p><span className="font-semibold">Jumlah:</span> {order.quantity}</p>
                <p><span className="font-semibold">Metode Pengiriman:</span> {order.method}</p>
                <p><span className="font-semibold">Metode pembayaran:</span> {order.payment}</p>
                <p><span className="font-semibold">Total Pembayaran:</span> Rp{order.total.toLocaleString('id-ID')}</p>
              </div>

              <div className="flex flex-col gap-4">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Eye size={18} />
                  Lihat File
                </button>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <FileCheck size={18} />
                  Bukti Pembayaran
                </button>
                
                <div className="mt-4">
                  <p className="text-sm text-slate-600 mb-2">Masukkan Estimasi Waktu Selesai</p>
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      className="border border-slate-300 rounded-lg px-4 py-2 flex-1"
                      defaultValue="2025-12-25"
                    />
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Simpan
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
                    Proses
                  </button>
                  <button className="flex-1 bg-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-400 transition-colors">
                    Finishing
                  </button>
                  <button className="flex-1 bg-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-400 transition-colors">
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Status Transaksi Component
const StatusTransaksiPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/admin/transactions');
        const items = response.data.data || [];
        if (!isMounted) return;
        setTransactions(items);
      } catch (error) {
        console.error('Gagal memuat transaksi:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (transactionId, status) => {
    try {
      await api.post(`/admin/transactions/${transactionId}/status`, { status });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === transactionId ? { ...transaction, status } : transaction
        )
      );
    } catch (error) {
      console.error('Gagal update status transaksi:', error);
      alert('Gagal update status transaksi.');
    }
  };

  const handleOpenProof = async (orderId) => {
    if (!orderId) return;
    try {
      const response = await api.get(`/admin/orders/${orderId}/proof`, {
        responseType: 'blob'
      });
      const fileUrl = URL.createObjectURL(response.data);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Gagal membuka bukti pembayaran:', error);
      alert('Bukti pembayaran belum tersedia.');
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="text-blue-800" size={26} />
        <h1 className="text-2xl font-bold text-blue-900">Status Transaksi</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">No. Pemesanan</th>
              <th className="px-4 py-3 text-left font-semibold">Pelanggan</th>
              <th className="px-4 py-3 text-left font-semibold">No. HP</th>
              <th className="px-4 py-3 text-left font-semibold">Alamat</th>
              <th className="px-4 py-3 text-left font-semibold">Detail</th>
              <th className="px-4 py-3 text-left font-semibold">Pembayaran</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={8}>
                  Memuat data...
                </td>
              </tr>
            )}
            {!loading && transactions.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={8}>
                  Belum ada transaksi.
                </td>
              </tr>
            )}
            {transactions.map((transaction) => {
              const order = transaction.order;
              return (
                <tr key={transaction.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3">{order?.order_number || `#${order?.id}`}</td>
                  <td className="px-4 py-3">{order?.user?.name || '-'}</td>
                  <td className="px-4 py-3">{order?.user?.no_telpon || '-'}</td>
                  <td className="px-4 py-3">{order?.shipping_address || order?.user?.alamat || '-'}</td>
                  <td className="px-4 py-3">{formatOrderDetail(order) || '-'}</td>
                  <td className="px-4 py-3">{transaction.payment_method || '-'}</td>
                  <td className="px-4 py-3">
                    Rp{Number(order?.total_price || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-6 h-6 rounded bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600"
                        onClick={() => handleOpenProof(order?.id)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                        onClick={() => handleUpdateStatus(transaction.id, 'paid')}
                      >
                        <FileCheck size={14} />
                      </button>
                      <button
                        className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
                        onClick={() => handleUpdateStatus(transaction.id, 'failed')}
                      >
                        <FileCheck size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Edit Produk Component
const EditProdukPage = () => {
  const [formData, setFormData] = useState({
    jenisBordir: 'Bordir 10 warna, Bordir biasa, Bordir 5 warna',
    ukuranBordir: '25-30 CM'
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Edit Produk</h1>
        <p className="text-slate-500">Update Produk Anda</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FileCheck className="text-green-600" size={24} />
          <p className="text-green-800 font-medium">Produk Anda Berhasil Diupdate</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Jenis Bordir</label>
            <input 
              type="text"
              value={formData.jenisBordir}
              onChange={(e) => setFormData({...formData, jenisBordir: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Ukuran Bordir</label>
            <input 
              type="text"
              value={formData.ukuranBordir}
              onChange={(e) => setFormData({...formData, ukuranBordir: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Tambah Foto Portofolio</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <Download className="mx-auto text-slate-400 mb-3" size={48} />
              <p className="text-slate-700 font-medium mb-1">Unggah Gambar Produk</p>
              <p className="text-slate-500 text-sm mb-1">PNG, JPG maksimal 5MB</p>
              <p className="text-slate-500 text-sm mb-4">Rekomendasi ukuran foto 800x600 pixel (4:3)</p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Pilih File
              </button>
            </div>
          </div>

          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// Kelola User Component
const KelolaUserPage = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="text-slate-700" size={32} />
          <h1 className="text-3xl font-bold text-slate-900">Data User</h1>
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          257 Pengguna Terdaftar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Nama Lengkap</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">No. HP</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Password</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-blue-600">{user.username}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.name}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-blue-600">{user.password}</td>
                <td className="px-6 py-4">
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Edit Profil Component
const EditProfilPage = () => {
  const [profile, setProfile] = useState({
    description: 'JA Bordir adalah usaha bordir yang mengutamakan kualitas, ketelitian, dan hasil akhir yang rap. Kami melayani berbagai kebutuhan bordir mulai dari seragam, logo, nama, hingga desain custom sesuai permintaan. Dengan didukung oleh tenaga profesional dan berpengalaman dan teknologi tinggi, JA Bordir berkomitmen memberikan hasil bordir yang kuat, detail, dan bernilai estetik tinggi. Kami juga bahwa setiap jahitan memiliki makna, dan setiap pesanan adalah kepercayaan. Karena itu, kami selalu mengutamakan kepuasan pelanggan melalui layanan cepat, ramah, dan hasil terbaik di setiap produk yang kami kerjakan.',
    address: 'Purwodadi, Jawa Tengah',
    mapsLink: 'https://googlemaps.com',
    phone: '082010203020'
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="text-slate-700" size={32} />
        <h1 className="text-3xl font-bold text-slate-900">Edit Profil Perusahaan</h1>
        <p className="text-slate-500">Update Profil Perusahaan Anda</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FileCheck className="text-green-600" size={24} />
          <p className="text-green-800 font-medium">Profil Perusahaan Anda Berhasil Diupdate</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Deskripsi Perusahaan</label>
            <textarea 
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 h-48"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Alamat</label>
            <input 
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Link Google Maps</label>
            <input 
              type="text"
              value={profile.mapsLink}
              onChange={(e) => setProfile({...profile, mapsLink: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">Nomor Telepon</label>
            <input 
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusTransaksiPage;

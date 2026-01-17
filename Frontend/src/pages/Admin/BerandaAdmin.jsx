import React, { useEffect, useMemo, useState } from "react";
import { Users, Box, ShoppingCart, DollarSign } from "lucide-react";
import api from "../../services/api";

const BerandaAdmin = () => {
  const [stats, setStats] = useState({
    users_count: 0,
    transactions_count: 0,
    revenue_total: 0,
    categories: [],
    sales_chart: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        if (!isMounted) return;
        setStats({
          users_count: response.data.users_count ?? 0,
          transactions_count: response.data.transactions_count ?? 0,
          revenue_total: response.data.revenue_total ?? 0,
          categories: response.data.categories ?? [],
          sales_chart: response.data.sales_chart ?? [],
        });
      } catch (error) {
        console.error("Gagal memuat dashboard admin:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => {
    return (stats.sales_chart || []).map((item) => {
      const date = new Date(item.date);
      const label = date.toLocaleDateString("id-ID", {
        month: "short",
        day: "2-digit",
      });
      return {
        label,
        total: Number(item.total) || 0,
      };
    });
  }, [stats.sales_chart]);

  const maxChartValue = useMemo(() => {
    return chartData.reduce((max, item) => Math.max(max, item.total), 0) || 1;
  }, [chartData]);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
        Selamat Datang Admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-200 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-blue-600">Pengguna Terdaftar</p>
          </div>
          <p className="text-4xl font-bold text-blue-900">
            {loading ? "..." : stats.users_count}
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-cyan-200 p-3 rounded-full">
              <Box className="text-cyan-600" size={24} />
            </div>
            <p className="text-sm text-cyan-600">Kategori Bordir</p>
          </div>
          <p className="text-4xl font-bold text-cyan-900">
            {loading ? "..." : stats.categories.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-sky-200 p-3 rounded-full">
              <ShoppingCart className="text-sky-600" size={24} />
            </div>
            <p className="text-sm text-sky-600">Total Transaksi</p>
          </div>
          <p className="text-4xl font-bold text-sky-900">
            {loading ? "..." : stats.transactions_count}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-200 p-3 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-blue-600">Pemasukan Total (Rp)</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {(stats.revenue_total || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Grafik Penjualan
          </h2>
          <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm">
            <option>2026-2027</option>
          </select>
        </div>
        <div className="flex items-end justify-around h-48 sm:h-64 gap-2">
          {chartData.length === 0 && !loading ? (
            <div className="text-sm text-slate-500">Belum ada data.</div>
          ) : (
            chartData.map((data, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-amber-400 to-amber-500 rounded-t-lg transition-all hover:from-amber-500 hover:to-amber-600"
                style={{ height: `${(data.total / maxChartValue) * 100}%` }}
              />
              <p className="text-xs text-slate-600 mt-2">{data.label}</p>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BerandaAdmin;

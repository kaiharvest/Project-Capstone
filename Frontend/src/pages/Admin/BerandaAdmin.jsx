import React, { useEffect, useMemo, useState } from "react";
import { Users, Box, ShoppingCart, DollarSign } from "lucide-react";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DUMMY_DASHBOARD = {
  users_count: 257,
  transactions_count: 67,
  revenue_total: 200000000,
  categories: ["Bordir Seragam", "Bordir Emblem", "Bordir Topi", "Bordir Jaket", "Bordir Tas"],
  sales_chart: [
    { year: 2025, month: "Jan", total: 8000000 },
    { year: 2025, month: "Feb", total: 15000000 },
    { year: 2025, month: "Mar", total: 11000000 },
    { year: 2025, month: "Apr", total: 20000000 },
    { year: 2025, month: "Mei", total: 9000000 },
    { year: 2025, month: "Jun", total: 18000000 },
    { year: 2025, month: "Jul", total: 12000000 },
    { year: 2025, month: "Agu", total: 22000000 },
    { year: 2025, month: "Sep", total: 10000000 },
    { year: 2025, month: "Okt", total: 19000000 },
    { year: 2025, month: "Nov", total: 13000000 },
    { year: 2025, month: "Des", total: 24000000 },
  ],
};

const BerandaAdmin = () => {
  const [stats, setStats] = useState({
    users_count: 0,
    transactions_count: 0,
    revenue_total: 0,
    categories: [],
    sales_chart: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025");

  useEffect(() => {
    setStats(DUMMY_DASHBOARD);
    setLoading(false);
  }, []);

  const chartData = useMemo(() => {
    return (stats.sales_chart || []).map((item) => {
      if (item.month) {
        return {
          label: item.month,
          total: Number(item.total) || 0,
          year: Number(item.year) || 0,
        };
      }
      const date = new Date(item.date);
      const label = date.toLocaleDateString("id-ID", {
        month: "short",
        day: "2-digit",
      });
      return {
        label,
        total: Number(item.total) || 0,
        year: date.getFullYear(),
      };
    });
  }, [stats.sales_chart]);

  const yearOptions = useMemo(() => {
    return [2025];
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setSelectedYear("2025");
    }
  }, [yearOptions, selectedYear]);

  const filteredChartData = useMemo(() => {
    if (!selectedYear) return chartData;
    const targetYear = Number(selectedYear);
    const byYear = chartData.filter((item) => item.year === targetYear);
    if (byYear.length === 0) return [];
    const sorted = [...byYear].sort(
      (a, b) => MONTH_LABELS.indexOf(a.label) - MONTH_LABELS.indexOf(b.label)
    );
    return sorted;
  }, [chartData, selectedYear]);

  const displayChartData = useMemo(() => {
    if (filteredChartData.length > 0) return filteredChartData;
    const fallbackYear = 2025;
    const fallbackTotals = [
      14, 11, 16, 12, 13, 17, 15, 13, 19, 16, 14, 20,
    ];
    return MONTH_LABELS.map((label, index) => ({
      label,
      total: fallbackTotals[index] || 0,
      year: fallbackYear,
    }));
  }, [filteredChartData, selectedYear]);

  const maxChartValue = useMemo(() => {
    return displayChartData.reduce((max, item) => Math.max(max, item.total), 0) || 1;
  }, [displayChartData]);

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
            Rp {(stats.revenue_total || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Grafik Penjualan
          </h2>
          <select
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            height: 220,
            padding: "8px 4px",
            width: "100%",
          }}
        >
          {displayChartData.map((data, i) => {
            const barHeight = Math.max(
              Math.round((data.total / maxChartValue) * 200),
              12
            );

            return (
              <div
                key={i}
                style={{
                  flex: "1 1 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 46,
                    borderRadius: 6,
                    backgroundColor: "#facc15",
                    height: barHeight,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BerandaAdmin;

// Pesanan.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const TABS = [
  { key: "menunggu", label: "Menunggu", color: "#F79A19", statuses: ["pending"] },
  { key: "diproses", label: "Diproses", color: "#FFE52A", statuses: ["processing"] },
  { key: "selesai", label: "Selesai", color: "#BBCB64", statuses: ["confirmed"] },
];

export default function Pesanan() {
  const [activeTab, setActiveTab] = useState("menunggu");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get("/orders");
        if (!isMounted) return;
        setOrders(response.data.data || []);
      } catch (error) {
        if (isMounted) {
          setErrorMsg("Gagal memuat pesanan.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const tab = TABS.find((item) => item.key === activeTab);
    if (!tab) return [];
    return orders.filter((order) => tab.statuses.includes(order.status));
  }, [orders, activeTab]);

  const handleOpenFile = async (orderId, type) => {
    try {
      const endpoint =
        type === "design"
          ? `/orders/${orderId}/design-image`
          : `/orders/${orderId}/payment-proof`;
      const response = await api.get(endpoint, { responseType: "blob" });
      const fileUrl = URL.createObjectURL(response.data);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      if (type === "payment") {
        try {
          const response = await api.get(`/orders/${orderId}/proof`, {
            responseType: "blob",
          });
          const fileUrl = URL.createObjectURL(response.data);
          window.open(fileUrl, "_blank", "noopener,noreferrer");
          return;
        } catch {
          // ignore fallback error
        }
      }
      alert("File belum tersedia.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ===== TABS ===== */}
          <div className="flex flex-wrap gap-3 mb-6">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={active && tab.color ? { backgroundColor: tab.color } : {}}
                  className={`px-5 py-2 rounded-full font-semibold ${
                    active ? "text-black" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-slate-500">Memuat pesanan...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-slate-500">Belum ada pesanan.</div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl p-4 sm:p-6 shadow-lg bg-[#F17300] text-white"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 space-y-3">
                      <div>
                        <p className="text-sm font-semibold">Nomor Pemesanan</p>
                        <p className="text-lg font-bold">{order.order_number}</p>
                      </div>
                      <div className="text-sm">
                        Total:{" "}
                        <span className="font-semibold">
                          Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                        </span>
                      </div>
                      {order.estimated_completion_date && (
                        <div className="text-sm">
                          Estimasi selesai: {order.estimated_completion_date}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenFile(order.id, "payment")}
                          className="px-4 py-2 rounded-full bg-white text-slate-800 text-xs font-semibold"
                        >
                          Bukti Pembayaran
                        </button>
                        <button
                          onClick={() => handleOpenFile(order.id, "design")}
                          className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold"
                        >
                          File Desain
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-slate-700 flex flex-col justify-between">
                      <div className="text-xs uppercase text-slate-500">Status</div>
                      <div className="text-lg font-bold">
                        {order.status === "pending"
                          ? "Menunggu Konfirmasi"
                          : order.status === "processing"
                          ? "Sedang Diproses"
                          : "Selesai"}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("id-ID")
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errorMsg ? (
            <div className="text-sm text-red-500 mt-4">{errorMsg}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

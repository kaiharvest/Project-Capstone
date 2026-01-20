// src/pages/Keranjang.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Keranjang.jsx (fixed)
 * - Perbaikan: alignment vertical center pada setiap item (items-center)
 * - Tidak mengimpor Navbar/Footer di sini (letakkan di layout)
 */

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Keranjang() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({ open: false, url: "", name: "" });
  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return Boolean(token || accessToken || user);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!isLoggedIn) {
      localStorage.setItem("redirect_after_login", "/keranjang");
      navigate("/login");
      return () => {
        isMounted = false;
      };
    }
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await api.get("/orders", {
          params: { order_type: "cart" },
        });
        if (!isMounted) return;
        const data = response.data.data || [];
        const mapped = data.map((order) => ({
          id: order.id,
          title: order.service_type,
          subtitle: order.embroidery_type,
          size: order.size_cm || "",
          qty: order.quantity || 1,
          pricePerItem: order.total_price || 0,
          selected: true,
        }));
        setItems(mapped);
      } catch (error) {
        console.error("Gagal memuat keranjang:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, []);

  // toggle select
  const toggleSelect = (id) =>
    setItems((s) =>
      s.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );

  const removeItem = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setItems((s) => s.filter((it) => it.id !== id));
    } catch (error) {
      console.error("Gagal hapus item:", error);
    }
  };

  const openPreview = async (it) => {
    try {
      const response = await api.get(`/orders/${it.id}/design-image`, {
        responseType: "blob",
      });
      const fileUrl = URL.createObjectURL(response.data);
      setPreview({ open: true, url: fileUrl, name: it.title });
    } catch (error) {
      alert("Belum ada file desain.");
    }
  };

  const total = useMemo(
    () =>
      items.reduce((sum, it) => sum + (it.selected ? it.qty * it.pricePerItem : 0), 0),
    [items]
  );

  const handleCheckout = () => {
    const selected = items.filter((it) => it.selected);
    if (!selected.length) return alert("Pilih minimal 1 item sebelum pesan.");

    if (selected.length === 1) {
      const current = selected[0];
      api
        .post(`/orders/${current.id}/checkout-from-cart`)
        .then((response) => {
          setItems((prev) => prev.filter((item) => item.id !== current.id));
          const orderId = response?.data?.order?.id || current.id;
          localStorage.setItem("current_order_id", String(orderId));
          localStorage.removeItem("current_order_ids");
          localStorage.removeItem("current_order_total");
          navigate("/pembayaran");
        })
        .catch((error) => {
          console.error("Gagal checkout:", error);
        });
      return;
    }

    const orderIds = selected.map((item) => item.id);
    api
      .post("/orders/checkout-batch", { order_ids: orderIds })
      .then((response) => {
        setItems((prev) => prev.filter((item) => !orderIds.includes(item.id)));
        localStorage.removeItem("current_order_id");
        localStorage.setItem("current_order_ids", JSON.stringify(orderIds));
        localStorage.setItem(
          "current_order_total",
          String(response?.data?.total_price || 0)
        );
        navigate("/pembayaran");
      })
      .catch((error) => {
        console.error("Gagal checkout:", error);
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-slate-700 mb-8 sm:mb-10">
          Keranjang Saya
        </h1>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-slate-500">Memuat...</div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="flex flex-col md:flex-row md:items-center gap-4 bg-white rounded-2xl shadow-lg p-5"
                /* items-center ensures vertical center alignment across left & right */
              >
                {/* checkbox */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => toggleSelect(it.id)}
                    aria-pressed={it.selected}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      it.selected
                        ? "bg-amber-400 border-amber-400"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {it.selected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* left content */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-800">{it.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Jenis: {it.subtitle || "-"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Ukuran: {it.size || "-"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Jumlah: {it.qty}</p>
                </div>

                {/* right content - ensure items vertically centered */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                  {/* qty label (desktop) */}
                  <div className="hidden md:block text-slate-600 font-semibold">
                    {it.qty}x
                  </div>

                  {/* Lihat File */}
                  <button
                    onClick={() => openPreview(it)}
                    className="px-4 py-2 rounded-xl bg-sky-100 text-slate-800 font-semibold shadow-sm w-full sm:w-auto"
                  >
                    Lihat File
                  </button>

                  {/* price pill */}
                  <div className="w-full sm:min-w-[220px] px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold text-center sm:text-left">
                    {formatIDR(it.pricePerItem)}
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(it.id)}
                      className="p-2 rounded-full hover:bg-slate-100"
                      aria-label="Hapus"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-slate-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-7 4h10"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              Keranjang kosong.
            </div>
          )}
        </div>

        {/* total box */}
        <div className="mt-10 flex justify-end">
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl shadow-xl"
            style={{ backgroundColor: "#F17300" }}
          >
            <div className="px-6 py-5 text-white">
              <div className="text-sm">Total</div>
              <div className="text-2xl font-bold">{formatIDR(total)}</div>
            </div>
            <button
              onClick={handleCheckout}
              className="mb-4 sm:mb-0 sm:mr-4 sm:ml-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:brightness-95"
            >
              Pesan
            </button>
          </div>
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {preview.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <strong>{preview.name}</strong>
              <button
                onClick={() => setPreview({ open: false, url: "", name: "" })}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Tutup
              </button>
            </div>
            <div className="p-6">
              <img
                src={preview.url}
                className="w-full max-h-[70vh] object-contain"
                alt={preview.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

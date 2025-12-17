// src/pages/Keranjang.jsx
import React, { useMemo, useState } from "react";

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
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Bordir Seragam",
      subtitle: "Bordir Timbul",
      qty: 20,
      pricePerItem: 1000000,
      fileUrl: "", // file url or data url
      selected: true,
    },
    {
      id: 2,
      title: "Bordir Emblem",
      subtitle: "Bordir Timbul",
      qty: 20,
      pricePerItem: 1000000,
      fileUrl: "",
      selected: false,
    },
  ]);

  const [preview, setPreview] = useState({ open: false, url: "", name: "" });

  // toggle select
  const toggleSelect = (id) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it)));

  const changeQty = (id, delta) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));

  const removeItem = (id) => setItems((s) => s.filter((it) => it.id !== id));
  const editItem = (id) => alert("Edit item " + id + " (implement edit flow)");

  const openPreview = (it) => {
    if (!it.fileUrl) {
      alert("Belum ada file ter-upload untuk item ini.");
      return;
    }
    setPreview({ open: true, url: it.fileUrl, name: it.title });
  };

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.selected ? it.qty * it.pricePerItem : 0), 0),
    [items]
  );

  const handleCheckout = () => {
    const selected = items.filter((it) => it.selected);
    if (!selected.length) return alert("Pilih minimal 1 item sebelum pesan.");
    alert("Checkout " + selected.length + " item(s). (Implement API)");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-700 mb-10">Keranjang Saya</h1>

        <div className="space-y-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-5"
              /* items-center ensures vertical center alignment across left & right */
            >
              {/* checkbox */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => toggleSelect(it.id)}
                  aria-pressed={it.selected}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                    it.selected ? "bg-amber-400 border-amber-400" : "bg-white border-slate-300"
                  }`}
                >
                  {it.selected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>

              {/* left content */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">{it.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{it.subtitle}</p>

                {/* qty controls for small screens */}
                <div className="mt-4 md:hidden">
                  <div className="inline-flex items-center border rounded-full overflow-hidden">
                    <button onClick={() => changeQty(it.id, -1)} className="px-3 py-1 bg-white text-slate-700">-</button>
                    <div className="px-4 py-1 bg-white text-slate-800 font-semibold">{it.qty}</div>
                    <button onClick={() => changeQty(it.id, +1)} className="px-3 py-1 bg-white text-slate-700">+</button>
                  </div>
                </div>
              </div>

              {/* right content - ensure items vertically centered */}
              <div className="flex items-center gap-4">
                {/* qty label (desktop) */}
                <div className="hidden md:block text-slate-600 font-semibold">{it.qty}x</div>

                {/* Lihat File */}
                <button onClick={() => openPreview(it)} className="px-4 py-2 rounded-xl bg-sky-100 text-slate-800 font-semibold shadow-sm">
                  Lihat File
                </button>

                {/* price pill */}
                <div className="min-w-[220px] px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold">
                  {formatIDR(it.pricePerItem * it.qty)}
                </div>

                {/* actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => editItem(it.id)} className="p-2 rounded-full hover:bg-slate-100" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 15.25V18h2.75L15.81 6.94l-2.75-2.75L2 15.25z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <button onClick={() => removeItem(it.id)} className="p-2 rounded-full hover:bg-slate-100" aria-label="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-7 4h10" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && <div className="text-center py-20 text-slate-500">Keranjang kosong.</div>}
        </div>

        {/* total box */}
        <div className="mt-10 flex justify-end">
          <div className="flex items-center gap-4 rounded-xl shadow-xl" style={{ backgroundColor: "#F17300" }}>
            <div className="px-6 py-5 text-white">
              <div className="text-sm">Total</div>
              <div className="text-2xl font-bold">{formatIDR(total)}</div>
            </div>
            <button onClick={handleCheckout} className="mr-4 ml-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:brightness-95">Pesan</button>
          </div>
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {preview.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <strong>{preview.name}</strong>
              <button onClick={() => setPreview({ open: false, url: "", name: "" })} className="px-3 py-1 bg-slate-200 rounded">Tutup</button>
            </div>
            <div className="p-6 text-center text-slate-500">Preview file (implement rendering if you store image/pdf URLs)</div>
          </div>
        </div>
      )}
    </div>
  );
}

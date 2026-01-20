// src/pages/Keranjang.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return Boolean(token || accessToken || user);
  }, []);

  const [items, setItems] = useState([]);
  const [editState, setEditState] = useState({
    open: false,
    itemId: null,
    title: "",
    subtitle: "",
    size: "",
    qty: "1",
    fileUrl: "",
    fileName: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([
    { value: "BRI_66400234", label: "BRI NO REK. 66400234" },
    { value: "QRIS", label: "QRIS" },
  ]);
  const [qrisImage, setQrisImage] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }

    const stored = JSON.parse(localStorage.getItem("keranjang")) || [];
    const mapped = stored.map((it) => ({
      id: it.id || `CART-${Date.now()}`,
      title: it.layanan || "Produk",
      subtitle: it.jenisBordir || "",
      size: it.ukuranBordir || "",
      qty: Number(it.jumlahPemesanan) || 1,
      pricePerItem: Number(it.pricePerItem) || 0,
      fileUrl: it.designPreviewUrl || "",
      fileName: it.designFileName || "",
      selected: false,
    }));
    setItems(mapped);
  }, [isLoggedIn]);

  useEffect(() => {
    const savedOptions = localStorage.getItem("payment_options");
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaymentOptions(parsed);
        }
      } catch {
        // ignore
      }
    }

    const savedQris = localStorage.getItem("qris_image");
    if (savedQris) {
      setQrisImage(savedQris);
    }
  }, []);

  useEffect(() => {
    if (!paymentMethod && paymentOptions.length > 0) {
      setPaymentMethod(paymentOptions[0].value);
    }
  }, [paymentMethod, paymentOptions]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const payload = items.map((it) => ({
      id: it.id,
      layanan: it.title,
      jenisBordir: it.subtitle,
      ukuranBordir: it.size || "",
      jumlahPemesanan: it.qty,
      designPreviewUrl: it.fileUrl || "",
      designFileName: it.fileName || "",
      pricePerItem: it.pricePerItem || 0,
    }));
    localStorage.setItem("keranjang", JSON.stringify(payload));
  }, [items, isLoggedIn]);

  const [preview, setPreview] = useState({ open: false, url: "", name: "" });

  // toggle select
  const toggleSelect = (id) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it)));

  const changeQty = (id, delta) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));

  const removeItem = (id) => setItems((s) => s.filter((it) => it.id !== id));
  const editItem = (id) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;
    setEditState({
      open: true,
      itemId: target.id,
      title: target.title,
      subtitle: target.subtitle,
      size: target.size || "",
      qty: String(target.qty || 1),
      fileUrl: target.fileUrl || "",
      fileName: target.fileName || "",
    });
  };

  const closeEdit = () => {
    setEditState({
      open: false,
      itemId: null,
      title: "",
      subtitle: "",
      size: "",
      qty: "1",
      fileUrl: "",
      fileName: "",
    });
  };

  const handleEditFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const nextUrl = URL.createObjectURL(selected);
    if (editState.fileUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(editState.fileUrl);
    }
    setEditState((prev) => ({
      ...prev,
      fileUrl: nextUrl,
      fileName: selected.name,
    }));
  };

  const saveEdit = () => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === editState.itemId
          ? {
              ...it,
              subtitle: editState.subtitle,
              size: editState.size,
              qty: Math.max(1, Number(editState.qty) || 1),
              fileUrl: editState.fileUrl,
              fileName: editState.fileName,
            }
          : it
      )
    );
    closeEdit();
  };

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
    const orderDraft = {
      orderNumber: `CART-${Date.now()}`,
      layanan: selected.map((it) => it.title).join(", "),
      jenisBordir: selected.map((it) => it.subtitle || "-").join(", "),
      ukuranBordir: selected.map((it) => it.size || "-").join(", "),
      jumlahPemesanan: selected.reduce((sum, it) => sum + (Number(it.qty) || 0), 0),
      items: selected,
      total,
      status: "menunggu",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("order_draft", JSON.stringify(orderDraft));
    setPaymentError("");
    setShowPayment(true);
  };

  const showQris = paymentMethod === "QRIS";

  const handlePaymentFile = (event) => {
    const f = event.target.files?.[0] || null;
    setProofFile(f);
  };

  const handlePaymentSubmit = () => {
    setPaymentError("");

    if (!proofFile) {
      setPaymentError("Mohon unggah bukti transfer terlebih dahulu.");
      return;
    }

    const savedDraft = localStorage.getItem("order_draft");
    if (!savedDraft) {
      setPaymentError("Data pesanan belum ada. Silakan pilih item.");
      return;
    }

    const orderDraft = JSON.parse(savedDraft);
    const invoiceData = {
      orderNumber: orderDraft.orderNumber,
      date: new Date().toISOString(),
      layanan: orderDraft.layanan,
      jenisBordir: orderDraft.jenisBordir,
      ukuranBordir: orderDraft.ukuranBordir,
      jumlahPemesanan: orderDraft.jumlahPemesanan,
      paymentMethod,
      total: orderDraft.total || 0,
    };

    localStorage.setItem("invoice_data", JSON.stringify(invoiceData));
    localStorage.setItem(
      "invoice_file_name",
      `Invoice-${orderDraft.orderNumber}.html`
    );
    localStorage.setItem(
      "pesanan_aktif",
      JSON.stringify({
        ...orderDraft,
        paymentMethod,
        status: "menunggu",
      })
    );
    localStorage.removeItem("order_draft");
    setShowPayment(false);
    navigate("/pesanan");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-slate-700 mb-8 sm:mb-10">Keranjang Saya</h1>

        <div className="space-y-6">
          {items.map((it) => (
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
                <p className="text-sm text-slate-400 mt-1">Jenis: {it.subtitle || "-"}</p>
                <p className="text-sm text-slate-400 mt-1">Ukuran: {it.size || "-"}</p>
                <p className="text-sm text-slate-400 mt-1">Jumlah: {it.qty}</p>

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
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                {/* qty label (desktop) */}
                <div className="hidden md:block text-slate-600 font-semibold">{it.qty}x</div>

                {/* Lihat File */}
                <button onClick={() => openPreview(it)} className="px-4 py-2 rounded-xl bg-sky-100 text-slate-800 font-semibold shadow-sm w-full sm:w-auto">
                  Lihat File
                </button>

                {/* price pill */}
                <div className="w-full sm:min-w-[220px] px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold text-center sm:text-left">
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl shadow-xl" style={{ backgroundColor: "#F17300" }}>
            <div className="px-6 py-5 text-white">
              <div className="text-sm">Total</div>
              <div className="text-2xl font-bold">{formatIDR(total)}</div>
            </div>
            <button onClick={handleCheckout} className="mb-4 sm:mb-0 sm:mr-4 sm:ml-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:brightness-95">Pesan</button>
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

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-5xl rounded-3xl bg-orange-500 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Pembayaran</h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-white/90 hover:text-white"
                aria-label="Tutup"
              >
                X
              </button>
            </div>

            <div
              className={`grid grid-cols-1 ${showQris ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}
            >
              <div className="md:col-span-2 bg-white rounded-2xl p-4 md:p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {paymentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="opacity-80"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bukti Transfer
                  </label>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-500 truncate">
                      {proofFile ? proofFile.name : "Unggah Bukti Transfer"}
                    </div>
                    <label className="shrink-0 cursor-pointer rounded-xl bg-sky-200 px-4 py-2 text-sm text-sky-900 font-semibold hover:bg-sky-300 active:scale-[0.99]">
                      Pilih File
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handlePaymentFile}
                      />
                    </label>
                  </div>
                </div>

                {paymentError ? (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {paymentError}
                  </div>
                ) : null}

                <button
                  onClick={handlePaymentSubmit}
                  className="mt-5 w-full rounded-2xl bg-green-500 py-4 font-bold text-white hover:bg-green-600"
                >
                  Pesan
                </button>
                <div className="mt-3 text-sm text-gray-700 font-semibold">
                  Total yang harus dibayar:{" "}
                  <span className="text-gray-900">{formatIDR(total)}</span>
                </div>
              </div>

              {showQris && (
                <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center">
                  <div className="text-gray-700 font-semibold mb-2">QRIS</div>
                  <div className="text-xs text-gray-500 mb-4 text-center">
                    Scan untuk pembayaran
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-3 bg-white">
                    <img
                      src={qrisImage}
                      alt="QRIS"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <strong>Edit Keranjang</strong>
              <button onClick={closeEdit} className="px-3 py-1 bg-slate-200 rounded">
                Tutup
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Bordir</label>
                <select
                  value={editState.subtitle}
                  onChange={(e) => setEditState((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700"
                >
                  <option value="Bordir Timbul 3D">Bordir Timbul 3D</option>
                  <option value="Bordir Komputer">Bordir Komputer</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ukuran Bordir</label>
                  <select
                    value={editState.size}
                    onChange={(e) => setEditState((prev) => ({ ...prev, size: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700"
                  >
                    <option value="20-24 CM">20-24 CM</option>
                    <option value="10-15 CM">10-15 CM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Pemesanan</label>
                  <input
                    type="number"
                    min={1}
                    value={editState.qty}
                    onChange={(e) =>
                      setEditState((prev) => ({
                        ...prev,
                        qty: e.target.value,
                      }))
                    }
                    onBlur={() =>
                      setEditState((prev) => ({
                        ...prev,
                        qty: String(Math.max(1, Number(prev.qty) || 1)),
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Desain</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-500 truncate">
                    {editState.fileName || "Belum ada file"}
                  </div>
                  <label className="shrink-0 cursor-pointer rounded-xl bg-sky-200 px-4 py-2 text-sm text-sky-900 font-semibold hover:bg-sky-300 active:scale-[0.99]">
                    Ganti File
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleEditFile} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={closeEdit} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700">
                  Batal
                </button>
                <button onClick={saveEdit} className="px-5 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

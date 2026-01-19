// Pesanan.jsx
import React, { useEffect, useState, useRef } from "react";

const TABS = [
  { key: "menunggu", label: "Menunggu", color: "#F79A19" },
  { key: "diproses", label: "Diproses", color: "#FFE52A" },
  { key: "selesai", label: "Selesai", color: "#BBCB64" },
];

export default function Pesanan() {
  // STATUS DIKONTROL BACKEND (READ-ONLY)
  const [activeTab, setActiveTab] = useState("menunggu");

  const [showPreview, setShowPreview] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");

  const [proofFileName, setProofFileName] = useState("");
  const [proofFileUrl, setProofFileUrl] = useState("");
  const [localUrl, setLocalUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [invoiceHtml, setInvoiceHtml] = useState("");

  const fileRef = useRef(null);

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [localUrl]);

  useEffect(() => {
    const savedOrder = localStorage.getItem("pesanan_aktif");
    if (savedOrder) {
      const parsed = JSON.parse(savedOrder);
      setOrderNumber(parsed.orderNumber || "");
      if (parsed.status) setActiveTab(parsed.status);
    }

    const savedInvoice = localStorage.getItem("invoice_data");
    const fileName = localStorage.getItem("invoice_file_name");
    if (savedInvoice) {
      const data = JSON.parse(savedInvoice);
      setOrderNumber((prev) => prev || data.orderNumber || "");
      setInvoiceHtml(buildInvoiceHtml(data));
      setProofFileName(fileName || `Invoice-${data.orderNumber || "pesanan"}.html`);
    }
  }, []);

  useEffect(() => {
    if (!invoiceHtml) return;
    const blob = new Blob([invoiceHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setProofFileUrl(url);
    setLocalUrl(url);
  }, [invoiceHtml]);

  // CONTOH: STATUS & FILE DARI BACKEND
  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await fetch("/api/pesanan/123");
  //     const data = await res.json();
  //     setActiveTab(data.status); // "menunggu" | "diproses" | "selesai"
  //     setProofFileName(data.proofFileName);
  //     setProofFileUrl(data.proofFileUrl);
  //   }
  //   fetchData();
  // }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Format hanya gambar atau PDF");
      return;
    }

    const url = URL.createObjectURL(file);
    setLocalUrl(url);
    setProofFileName(file.name);
    setProofFileUrl(url);
    setErrorMsg("");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = proofFileUrl;
    a.download = proofFileName;
    a.click();
  };

  const isImage = (name) => /\.(jpg|jpeg|png|webp)$/i.test(name);
  const isPdf = (name) => /\.pdf$/i.test(name);
  const isHtml = (name) => /\.html?$/i.test(name);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ===== TABS (READ-ONLY) ===== */}
          <div className="flex flex-wrap gap-3 mb-6">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  disabled
                  style={active && tab.color ? { backgroundColor: tab.color } : {}}
                  className={`px-5 py-2 rounded-full font-semibold ${
                    active
                      ? "text-black"
                      : "bg-slate-200 text-slate-500"
                  } cursor-not-allowed`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ===== CARD ===== */}
          <div
            className="rounded-3xl p-4 sm:p-6 shadow-lg"
            style={{ backgroundColor: "#F17300" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="text-white font-semibold block mb-2">
                    Nomor Pemesanan
                  </label>
                  <input
                    readOnly
                    value={orderNumber}
                    className="w-full rounded-full px-5 py-2.5 bg-white shadow-sm border border-white/60 text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-2">
                    Bukti Pemesanan
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 rounded-full px-5 py-2.5 bg-white shadow-sm border border-white/60 text-sm text-slate-500 truncate">
                      {proofFileName || "Belum ada invoice"}
                    </div>

                    {proofFileUrl ? (
                      <button
                        onClick={handleDownload}
                        className="px-6 py-2 rounded-full text-white w-full sm:w-auto transition bg-slate-900 hover:bg-slate-800"
                      >
                        Unduh
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-6 py-2 rounded-full w-full sm:w-auto bg-slate-300 text-slate-600"
                      >
                        Unduh
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {errorMsg && (
                    <p className="text-white mt-2 text-sm">{errorMsg}</p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div
                onClick={() => proofFileUrl && setShowPreview(true)}
                className={`h-32 sm:h-36 rounded-xl bg-white flex items-center justify-center cursor-pointer transition ${
                  proofFileUrl ? "hover:shadow-md" : "opacity-60 cursor-default"
                }`}
                title={proofFileUrl ? "Lihat Invoice" : "Belum ada invoice"}
              >
                <span className="font-semibold text-gray-600">Lihat Invoice</span>
              </div>
            </div>
          </div>

          {/* STATUS TEXT */}
          <div className="mt-4 text-sm">
            <strong>Status:</strong>{" "}
            {activeTab === "menunggu"
              ? "Menunggu konfirmasi"
              : activeTab === "diproses"
              ? "Sedang diproses"
              : "Selesai"}
          </div>
        </div>
      </main>

      {/* ===== MODAL PREVIEW ===== */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl">
            <div className="flex justify-between items-center p-4 border-b">
              <strong>{proofFileName}</strong>
              <button
                onClick={() => setShowPreview(false)}
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Tutup
              </button>
            </div>

            <div className="p-6">
              {isImage(proofFileName) && (
                <img
                  src={proofFileUrl}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
              {isPdf(proofFileName) && (
                <iframe
                  src={proofFileUrl}
                  className="w-full h-[70vh]"
                />
              )}
              {isHtml(proofFileName) && (
                <iframe
                  src={proofFileUrl}
                  className="w-full h-[70vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildInvoiceHtml(data) {
  const safe = (value) => String(value || "");
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${safe(data.orderNumber)}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;margin:32px;color:#0f172a}
      .card{border:1px solid #e2e8f0;border-radius:12px;padding:24px;max-width:720px;margin:0 auto}
      h1{font-size:22px;margin:0 0 8px}
      .meta{font-size:12px;color:#64748b;margin-bottom:16px}
      .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0}
      .row:last-child{border-bottom:none}
      .label{font-weight:600}
      .total{font-size:18px;font-weight:700;margin-top:12px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Invoice Pemesanan</h1>
      <div class="meta">Nomor: ${safe(data.orderNumber)} | Tanggal: ${new Date(data.date).toLocaleString("id-ID")}</div>
      <div class="row"><span class="label">Layanan</span><span>${safe(data.layanan)}</span></div>
      <div class="row"><span class="label">Jenis Bordir</span><span>${safe(data.jenisBordir)}</span></div>
      <div class="row"><span class="label">Ukuran Bordir</span><span>${safe(data.ukuranBordir)}</span></div>
      <div class="row"><span class="label">Jumlah</span><span>${safe(data.jumlahPemesanan)}</span></div>
      <div class="row"><span class="label">Metode Pengiriman</span><span>${safe(data.metodeKirim)}</span></div>
      <div class="row"><span class="label">Metode Pembayaran</span><span>${safe(data.paymentMethod)}</span></div>
      <div class="total">Total: Rp ${Number(data.total || 0).toLocaleString("id-ID")}</div>
    </div>
  </body>
</html>`;
}

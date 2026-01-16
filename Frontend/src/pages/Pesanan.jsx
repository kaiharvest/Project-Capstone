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

  const orderNumber = "20252812REG110975543333333";

  const [proofFileName, setProofFileName] = useState("");
  const [proofFileUrl, setProofFileUrl] = useState("");
  const [localUrl, setLocalUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ===== TABS (READ-ONLY) ===== */}
          <div className="flex flex-wrap gap-3 mb-8">
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
            className="rounded-3xl p-5 sm:p-8 shadow-lg"
            style={{ backgroundColor: "#F17300" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="text-white font-semibold block mb-2">
                    Nomor Pemesanan
                  </label>
                  <input
                    readOnly
                    value={orderNumber}
                    className="w-full rounded-full px-6 py-3 bg-white shadow-sm border border-white/60"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-2">
                    Bukti Pemesanan
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      readOnly
                      value={proofFileName}
                      placeholder="Belum ada bukti"
                      className="flex-1 rounded-full px-6 py-3 bg-white shadow-sm border border-white/60"
                    />

                    <button
                      onClick={() =>
                        proofFileUrl
                          ? handleDownload()
                          : fileRef.current.click()
                      }
                      className="px-5 py-2 rounded-full bg-slate-900 text-white w-full sm:w-auto"
                    >
                      {proofFileUrl ? "Unduh" : "Unggah"}
                    </button>
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
                className={`h-44 rounded-xl bg-white flex items-center justify-center cursor-pointer ${
                  !proofFileUrl && "opacity-60 cursor-default"
                }`}
              >
                <span className="font-semibold text-gray-600">
                  Lihat File
                </span>
              </div>
            </div>
          </div>

          {/* STATUS TEXT */}
          <div className="mt-6">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

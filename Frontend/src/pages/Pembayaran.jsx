import React, { useEffect, useState } from "react";

export default function Pembayaran() {
  const [qrUrl, setQrUrl] = useState("");
  const [method, setMethod] = useState("bri");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // TODO: ganti dengan fetch QRIS dari backend
    // Contoh:
    // const res = await api.get("/pembayaran/qris");
    // setQrUrl(res.data.qr_url);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: kirim data pembayaran ke backend, lalu backend update status pesanan.
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#F17300] rounded-[28px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Pilih Metode Pembayaran
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-white text-slate-700 rounded-2xl px-5 py-3 outline-none"
              >
                <option value="bri">BRI NO REK. 66400234</option>
                <option value="bca">BCA NO REK. 12345678</option>
                <option value="mandiri">Mandiri NO REK. 98765432</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Bukti Transfer
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm text-slate-500">
                  {fileName || "Unggah Bukti Transfer"}
                </div>
                <label className="bg-[#9BB4CF] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold cursor-pointer">
                  Pilih File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-2xl transition"
            >
              Pesan
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center justify-center min-h-[180px]">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QRIS"
                className="w-full max-w-[220px] object-contain"
              />
            ) : (
              <div className="text-center text-slate-500 text-sm">
                QRIS akan muncul di sini
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

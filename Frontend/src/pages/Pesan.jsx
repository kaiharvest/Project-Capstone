import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import seragam from "../assets/icons/seragam.svg";
import topi from "../assets/icons/topi.svg";
import emblem from "../assets/icons/emblem.svg";
import jaket from "../assets/icons/jaket.svg";
import tas from "../assets/icons/tas.svg";
import dummyImg from "../assets/dummy/profil.png";

export default function Pesan() {
  const navigate = useNavigate();
  const [layanan, setLayanan] = useState("Bordir Seragam");

  // ============================
  // Dummy produk (NANTI DIGANTI BACKEND)
  // ============================
  const [produk, setProduk] = useState({
    gambar: dummyImg,
    nama: "Nama Produk Dummy",
    harga: "Rp 0",
    deskripsi: "Deskripsi produk muncul di sini...",
  });

  // ============================
  // State form (biar bisa dikirim ke halaman pesanan)
  // ============================
  const [jenisBordir, setJenisBordir] = useState("Bordir Timbul 3D");
  const [ukuranBordir, setUkuranBordir] = useState("20-24 CM");
  const [jumlahPemesanan, setJumlahPemesanan] = useState(1);
  const [metodeKirim, setMetodeKirim] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([
    { value: "BRI_66400234", label: "BRI NO REK. 66400234" },
    { value: "QRIS", label: "QRIS" },
  ]);
  const [qrisImage, setQrisImage] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  // ============================
  // Upload state (sesuai gambar)
  // ============================
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePickFile = () => fileInputRef.current?.click();
  const isImage = (f) => f?.type?.startsWith("image/");
  const fileExt = (name) => (name?.split(".").pop() || "").toUpperCase();

  const setPickedFile = (pickedFile) => {
    setFile(pickedFile);
    setFileName(pickedFile.name);

    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(pickedFile);
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setPickedFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    setPickedFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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

  // ============================
  // LOGIN CHECK (ubah key sesuai sistem login kamu)
  // ============================
  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return Boolean(token || accessToken || user);
  }, []);

  const isFormValid = useMemo(() => {
    return (
      Boolean(jenisBordir) &&
      Boolean(ukuranBordir) &&
      Boolean(metodeKirim) &&
      Number(jumlahPemesanan) > 0
    );
  }, [jenisBordir, ukuranBordir, metodeKirim, jumlahPemesanan]);

  // ============================
  // Aksi tombol
  // ============================
  const handleAddToCart = () => {
    // wajib login
    if (!isLoggedIn) {
      // arahkan login + simpan redirect
      localStorage.setItem("redirect_after_login", "/pesan");
      navigate("/login");
      return;
    }

    const item = {
      id: `CART-${Date.now()}`,
      layanan,
      jenisBordir,
      ukuranBordir,
      jumlahPemesanan,
      metodeKirim,
      designFileName: fileName || "",
      designPreviewUrl: preview || "",
      createdAt: new Date().toISOString(),
    };

    const cart = JSON.parse(localStorage.getItem("keranjang")) || [];
    cart.push(item);
    localStorage.setItem("keranjang", JSON.stringify(cart));

    // ✅ sesuai request: tidak pakai notif/alert
    // (opsional) bisa navigate ke halaman keranjang kalau ada:
    // navigate("/keranjang");
  };

  const handlePesan = () => {
    // extra safety (walau tombol sudah disabled ketika belum login)
    if (!isLoggedIn) {
      localStorage.setItem("redirect_after_login", "/pesan");
      navigate("/login");
      return;
    }

    if (!isFormValid) return;

    const orderPayload = {
      orderNumber: `REG-${Date.now()}`, // sementara (backend nanti generate)
      layanan,
      jenisBordir,
      ukuranBordir,
      jumlahPemesanan,
      metodeKirim,
      designFileName: fileName || "",
      designPreviewUrl: preview || "",
      total: 0,
      status: "menunggu",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("order_draft", JSON.stringify(orderPayload));
    setPaymentError("");
    setShowPayment(true);
  };

  const layananData = [
    { nama: "Bordir Seragam", icon: seragam },
    { nama: "Bordir Topi", icon: topi },
    { nama: "Bordir Emblem", icon: emblem },
    { nama: "Bordir Jaket", icon: jaket },
    { nama: "Bordir Lainnya", icon: tas },
  ];

  const customFont = { fontFamily: '"Noto Sans Telugu", sans-serif' };
  const showQris = paymentMethod === "QRIS";

  const handlePaymentFile = (e) => {
    const f = e.target.files?.[0] || null;
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
      setPaymentError("Data pesanan belum ada. Silakan isi form pemesanan.");
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
      metodeKirim: orderDraft.metodeKirim,
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
    <div className="w-full min-h-screen bg-white">
      {/* ===================== PILIH LAYANAN ===================== */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2
          style={customFont}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3E7CB1]"
        >
          Pilih Layanan Produk
        </h2>

        <div className="max-w-6xl mx-auto mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {layananData.map((item) => (
            <button
              key={item.nama}
              onClick={() => setLayanan(item.nama)}
              className={`flex flex-col items-center border-2 rounded-2xl p-5 bg-white transition cursor-pointer ${
                layanan === item.nama
                  ? "border-[#3E7CB1] bg-[#EAF2FA]"
                  : "border-[#A9C0E0] hover:border-[#3E7CB1]"
              }`}
            >
              <img src={item.icon} alt={item.nama} className="w-12 sm:w-16 md:w-20 opacity-70" />
              <p
                style={customFont}
                className="mt-3 text-[#3E7CB1] font-semibold text-xs sm:text-sm"
              >
                {item.nama}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ===================== FORM + PREVIEW ===================== */}
      <section className="px-4 sm:px-6 pb-20 pr-10">
        <div className="max-w-6xl mx-auto bg-[#F17300] rounded-[28px] p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* ========== KIRI: Form Input ========== */}
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-2 font-medium">
                Jenis Bordir
              </label>
              <select
                value={jenisBordir}
                onChange={(e) => setJenisBordir(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none"
              >
                <option>Bordir Timbul 3D</option>
                <option>Bordir Komputer</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm mb-2 font-medium">
                  Ukuran Bordir
                </label>
                <select
                  value={ukuranBordir}
                  onChange={(e) => setUkuranBordir(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none"
                >
                  <option>20-24 CM</option>
                  <option>10-15 CM</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2 font-medium">
                  Jumlah Pemesanan
                </label>
                <input
                  type="number"
                  min={1}
                  value={jumlahPemesanan}
                  onChange={(e) =>
                    setJumlahPemesanan(Math.max(1, Number(e.target.value || 1)))
                  }
                  placeholder="Masukkan jumlah"
                  className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === "-" && e.preventDefault()}
                />
              </div>
            </div>

            <div>
              <select
                value={metodeKirim}
                onChange={(e) => setMetodeKirim(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none"
              >
                <option value="">Pilih Metode Pengiriman</option>
                <option>JNE</option>
                <option>J&T</option>
                <option>Sicepat</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                value="Rp."
                readOnly
                className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none"
              />
            </div>

            {/* Tombol */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
              <button
                onClick={handleAddToCart}
                className="px-10 py-3 rounded-full bg-[#3E78A9] text-white font-semibold cursor-pointer hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Keranjang
              </button>

              <button
                onClick={handlePesan}
                disabled={!isLoggedIn || !isFormValid}
                className={`px-10 py-3 rounded-full text-white font-semibold transition w-full sm:w-auto
    ${
      isLoggedIn && isFormValid
        ? "bg-green-500 cursor-pointer hover:bg-green-600"
        : "bg-green-500/60" // OFF tanpa cursor silang
    }`}
                title={
                  !isLoggedIn
                    ? "Login dulu untuk pesan"
                    : !isFormValid
                    ? "Lengkapi form terlebih dahulu"
                    : ""
                }
              >
                Pesan
              </button>
            </div>
          </div>

          {/* ========== KANAN: BOX UPLOAD ========== */}
          <div className="flex items-center justify-center">
            <div
              onClick={handlePickFile}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full min-h-[280px] sm:min-h-[380px] bg-white rounded-2xl cursor-pointer select-none p-6 sm:p-8 flex flex-col items-center justify-center"
            >
              {!file ? (
                <>
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl relative mb-4 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gray-200 rounded-bl-2xl" />
                    <div className="w-12 h-14 bg-gray-200 rounded-xl" />
                  </div>

                  <p className="text-gray-700 font-semibold">
                    {fileName ? fileName : "Pilih File"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Atau Jatuhkan di Sini
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center w-full">
                  {isImage(file) ? (
                    <div className="w-full max-w-[320px] h-[220px] bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[320px] h-[220px] bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm">
                      <div className="px-5 py-3 bg-white rounded-2xl border border-gray-200 text-gray-700 font-semibold">
                        {fileExt(file.name) || "FILE"}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700 font-semibold mt-6 text-center break-words">
                    {fileName}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Klik untuk ganti file
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </section>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-5xl rounded-3xl bg-orange-500 p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                Pembayaran
              </h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-white/90 hover:text-white"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className={`grid grid-cols-1 ${showQris ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
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
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
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
                    <label className="shrink-0 cursor-pointer rounded-xl bg-sky-200 px-5 py-3 text-sky-900 font-semibold hover:bg-sky-300 active:scale-[0.99]">
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
                  <span className="text-gray-900">
                    {formatRupiah(jumlahPemesanan * 0)}
                  </span>
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
    </div>
  );
}

function formatRupiah(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
}

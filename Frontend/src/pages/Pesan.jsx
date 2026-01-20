// Pesan.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import api from "../services/api";

// Icons
import seragam from "../assets/icons/seragam.svg";
import topi from "../assets/icons/topi.svg";
import emblem from "../assets/icons/emblem.svg";
import jaket from "../assets/icons/jaket.svg";
import dummyImg from "../assets/dummy/profil.png";

export default function Pesan() {
  const navigate = useNavigate();
  const [layanan, setLayanan] = useState("Bordir Seragam");

  // ============================
  // Dummy produk (NANTI DIGANTI BACKEND)
  // ============================
  const [produk] = useState({
    gambar: dummyImg,
    nama: "Nama Produk Dummy",
    harga: "Rp 0",
    deskripsi: "Deskripsi produk muncul di sini...",
  });

  // ============================
  // State form
  // ============================
  const [jenisBordir, setJenisBordir] = useState("");
  const [ukuranBordir, setUkuranBordir] = useState("");
  const [jumlahPemesanan, setJumlahPemesanan] = useState("1");
  const [totalHarga, setTotalHarga] = useState(0);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);

  // ============================
  // Upload state
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
    let isMounted = true;
    const fetchOptions = async () => {
      try {
        const [typeRes, sizeRes] = await Promise.all([
          api.get("/embroidery-types"),
          api.get("/embroidery-sizes"),
        ]);
        if (!isMounted) return;
        const typeItems = typeRes.data.data || [];
        const sizeItems = sizeRes.data.data || [];
        setTypes(typeItems);
        setSizes(sizeItems);
        if (typeItems[0]) {
          setJenisBordir(typeItems[0].name);
        }
        if (sizeItems[0]) {
          setUkuranBordir(sizeItems[0].label);
        }
      } catch (error) {
        console.error("Gagal memuat opsi bordir:", error);
      }
    };

    fetchOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  // ============================
  // LOGIN CHECK
  // ============================
  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return Boolean(token || accessToken || user);
  }, []);

  const jumlahNumber = useMemo(() => {
    const n = parseInt(jumlahPemesanan || "0", 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [jumlahPemesanan]);

  const isFormValid = useMemo(() => {
    return (
      Boolean(jenisBordir) &&
      Boolean(ukuranBordir) &&
      parseInt(jumlahPemesanan || "0", 10) > 0
    );
  }, [jenisBordir, ukuranBordir, jumlahPemesanan]);

  const isReadyToOrder = useMemo(() => {
    return isFormValid && Boolean(file);
  }, [isFormValid, file]);

  const serviceType = useMemo(() => {
    const map = {
      "Bordir Seragam": "seragam",
      "Bordir Topi": "topi",
      "Bordir Emblem": "emblem",
      "Bordir Jaket": "jaket",
      "Bordir Lainnya": "tas",
    };
    return map[layanan] || "seragam";
  }, [layanan]);

  const embroideryTypeValue = useMemo(() => {
    return jenisBordir.toLowerCase().includes("3d") ? "3d" : "computer";
  }, [jenisBordir]);

  const sizeValue = useMemo(() => {
    const match = ukuranBordir.match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
  }, [ukuranBordir]);

  useEffect(() => {
    if (!isLoggedIn || !isFormValid || sizeValue <= 0) return;
    let isMounted = true;
    const estimate = async () => {
      setEstimating(true);
      setEstimateError("");
      try {
        const response = await api.post("/orders/estimate", {
          service_type: serviceType,
          embroidery_type: embroideryTypeValue,
          size_cm: sizeValue,
          quantity: jumlahNumber,
        });
        if (!isMounted) return;
        setTotalHarga(response.data.total_price || 0);
      } catch (error) {
        console.error("Gagal menghitung harga:", error);
        if (isMounted) {
          setEstimateError("Gagal menghitung harga. Coba lagi.");
          setTotalHarga(0);
        }
      } finally {
        if (isMounted) setEstimating(false);
      }
    };

    estimate();
    return () => {
      isMounted = false;
    };
  }, [
    isLoggedIn,
    isFormValid,
    serviceType,
    embroideryTypeValue,
    sizeValue,
    jumlahNumber,
  ]);

  // ============================
  // Aksi tombol
  // ============================
  const handleAddToCart = async () => {
    // wajib login
    if (!isLoggedIn) {
      localStorage.removeItem("keranjang");
      localStorage.setItem("redirect_after_login", "/pesan");
      navigate("/login");
      return;
    }

    if (!isFormValid) return;

    try {
      const formData = new FormData();
      formData.append("service_type", serviceType);
      formData.append("embroidery_type", embroideryTypeValue);
      formData.append("size_cm", sizeValue);
      formData.append("quantity", jumlahNumber);
      formData.append("shipping_method", "jne");
      formData.append("order_type", "cart");
      formData.append("notes", "");
      if (file) {
        formData.append("design_image", file);
      }

      await api.post("/orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/keranjang");
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
    }
  };

  const handlePesan = async () => {
    // extra safety (walau tombol sudah disabled ketika belum login)
    if (!isLoggedIn) {
      localStorage.setItem("redirect_after_login", "/pesan");
      navigate("/login");
      return;
    }

    if (!isFormValid) return;
    if (!file) return; // wajib upload file

    try {
      const formData = new FormData();
      formData.append("service_type", serviceType);
      formData.append("embroidery_type", embroideryTypeValue);
      formData.append("size_cm", sizeValue);
      formData.append("quantity", jumlahNumber);
      formData.append("shipping_method", "jne");
      formData.append("order_type", "now");
      formData.append("notes", "");
      if (file) {
        formData.append("design_image", file);
      }

      const response = await api.post("/orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const order = response.data.order;
      localStorage.setItem("current_order_id", String(order.id));
      navigate("/pembayaran");
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
    }
  };

  const layananData = [
    { nama: "Bordir Seragam", icon: seragam },
    { nama: "Bordir Topi", icon: topi },
    { nama: "Bordir Emblem", icon: emblem },
    { nama: "Bordir Jaket", icon: jaket },
    { nama: "Bordir Lainnya", type: "ellipsis" },
  ];

  const customFont = { fontFamily: '"Noto Sans Telugu", sans-serif' };

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
              className={`flex flex-col items-center justify-center border-2 rounded-2xl p-5 bg-white transition cursor-pointer ${
                layanan === item.nama
                  ? "border-[#3E7CB1] bg-[#EAF2FA]"
                  : "border-[#A9C0E0] hover:border-[#3E7CB1] hover:bg-[#F5F9FF] hover:shadow-md"
              }`}
            >
              <div className="w-full flex justify-center">
                {item.type === "ellipsis" ? (
                  <MoreHorizontal className="w-2/3 h-auto opacity-70 text-[#3E7CB1]" />
                ) : (
                  <img
                    src={item.icon}
                    alt={item.nama}
                    className="w-2/3 h-auto opacity-70"
                  />
                )}
              </div>

              <p
                style={customFont}
                className="mt-3 text-[#3E7CB1] font-semibold text-xs sm:text-sm text-center"
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
                {types.length === 0 ? (
                  <option value="">Belum ada jenis bordir</option>
                ) : (
                  types.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))
                )}
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
                  {sizes.length === 0 ? (
                    <option value="">Belum ada ukuran bordir</option>
                  ) : (
                    sizes.map((item) => (
                      <option key={item.id} value={item.label}>
                        {item.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2 font-medium">
                  Jumlah Pemesanan
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={jumlahPemesanan}
                  onChange={(e) => {
                    const v = e.target.value;

                    if (v === "") {
                      setJumlahPemesanan("");
                      return;
                    }

                    if (/^\d+$/.test(v)) {
                      setJumlahPemesanan(v);
                    }
                  }}
                  onBlur={() => {
                    const n = parseInt(jumlahPemesanan || "0", 10);
                    if (!n || n < 1) setJumlahPemesanan("1");
                  }}
                  placeholder="Masukkan jumlah"
                  className="w-full px-5 py-3 rounded-2xl bg-white text-gray-700 outline-none placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === "-" && e.preventDefault()}
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={
                  estimateError
                    ? estimateError
                    : estimating
                    ? "Menghitung..."
                    : formatRupiah(totalHarga)
                }
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
                disabled={isLoggedIn ? !isReadyToOrder : false}
                className={`px-12 py-3 rounded-full text-white font-semibold transition w-full sm:w-auto ${
                  !isLoggedIn || isReadyToOrder
                    ? "bg-green-500 cursor-pointer hover:bg-green-600"
                    : "bg-green-500/60"
                }`}
                title={
                  !isLoggedIn
                    ? "Login dulu untuk pesan"
                    : !file
                      ? "Upload file desain dulu"
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
              className="w-full min-h-[280px] sm:min-h-[320px] bg-white rounded-2xl cursor-pointer select-none p-6 sm:p-8 flex flex-col items-center justify-center"
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
    </div>
  );
}

function formatRupiah(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
}

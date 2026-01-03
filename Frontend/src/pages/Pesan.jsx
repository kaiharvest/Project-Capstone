import React, { useState, useEffect } from "react";

// Icons
import seragam from "../assets/icons/seragam.svg";
import topi from "../assets/icons/topi.svg";
import emblem from "../assets/icons/emblem.svg";
import jaket from "../assets/icons/jaket.svg";
import tas from "../assets/icons/tas.svg";
import dummyImg from "../assets/dummy/profil.png";
import Footer from "../components/Footer";

export default function Pesan() {
  const [layanan, setLayanan] = useState("Bordir Seragam");

  // ============================
  // ⬇️ Dummy produk (NANTI DIGANTI BACKEND)
  // ============================
  const [produk, setProduk] = useState({
  gambar: dummyImg,
  nama: "Nama Produk Dummy",
  harga: "Rp 0",
  deskripsi: "Deskripsi produk muncul di sini...",
});


  // ============================
  // ⬇️ NANTI AMBIL DATA PRODUK DARI BACKEND
  // ============================
  // useEffect(() => {
  //   fetch("http://API_URL/produk/" + layanan)
  //     .then((res) => res.json())
  //     .then((data) => setProduk(data))
  //     .catch(() => console.log("Error ambil produk"));
  // }, [layanan]);


  const layananData = [
    { nama: "Bordir Seragam", icon: seragam },
    { nama: "Bordir Topi", icon: topi },
    { nama: "Bordir Emblem", icon: emblem },
    { nama: "Bordir Jaket", icon: jaket },
    { nama: "Bordir Tas", icon: tas },
  ];

  const customFont = { fontFamily: '"Noto Sans Telugu", sans-serif' };

  return (
    <div className="w-full min-h-screen bg-white">

      {/* ===================== PILIH LAYANAN ===================== */}
      <section className="w-full px-6 py-16 text-center">
        <h2
          style={customFont}
          className="text-3xl md:text-4xl font-bold text-[#3E7CB1]"
        >
          Pilih Layanan Produk
        </h2>

        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {layananData.map((item) => (
            <button
              key={item.nama}
              onClick={() => setLayanan(item.nama)}
              className={`flex flex-col items-center border-2 rounded-3xl p-6 transition ${
                layanan === item.nama
                  ? "border-[#3E7CB1] bg-[#EAF2FA]"
                  : "border-[#81A4CD]/80 hover:border-[#3E7CB1]"
              }`}
            >
              <img src={item.icon} alt={item.nama} className="w-16 md:w-24" />
              <p style={customFont} className="mt-3 text-[#3E7CB1] font-semibold text-sm">
                {item.nama}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ===================== FORM + PREVIEW ===================== */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-orange-500 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ========== KIRI: Form Input ========== */}
          <div className="space-y-4">

            {/* Jenis Bordir */}
            <div>
              <label className="block text-white text-sm mb-1 font-medium">Jenis Bordir</label>
              <select className="w-full px-5 py-3 rounded-full bg-white text-gray-700">
                <option>Bordir Timbul 3D</option>
                <option>Bordir Komputer</option>
              </select>
            </div>

            {/* Ukuran & Jumlah */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm mb-1 font-medium">Ukuran Bordir</label>
                <select className="w-full px-5 py-3 rounded-full bg-white text-gray-700">
                  <option>20–24 CM</option>
                  <option>10–15 CM</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-1 font-medium">Jumlah Pemesanan</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-5 py-3 rounded-full bg-white text-gray-700"
                  onKeyDown={(e) => e.key === "-" && e.preventDefault()}
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-white text-sm mb-1 font-medium">Alamat Pengiriman</label>
              <input
                type="text"
                className="w-full px-5 py-3 rounded-full bg-white text-gray-700"
              />
            </div>

            {/* Ekspedisi */}
            <div>
              <label className="block text-white text-sm mb-1 font-medium">Ekspedisi</label>
              <select className="w-full px-5 py-3 rounded-full bg-white text-gray-700">
                <option>Pilih Metode Pengiriman</option>
                <option>JNE</option>
                <option>J&T</option>
              </select>
            </div>

            {/* Harga */}
            <div>
              <label className="block text-white text-sm mb-1 font-medium">Total Harga</label>
              <input
                type="text"
                disabled
                className="w-full px-5 py-3 rounded-full bg-gray-100 text-gray-500"
                value={produk.harga}
              />
            </div>

            {/* Tombol */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 rounded-full bg-blue-600 text-white">
                Keranjang
              </button>
              <button className="flex-1 px-6 py-3 rounded-full bg-green-500 text-white">
                Pesan Sekarang
              </button>
            </div>
          </div>

          {/* ========== KANAN: PREVIEW PRODUK DARI BACKEND ========== */}
          <div className="flex flex-col items-center">
            <div className="w-full h-full bg-white rounded-2xl border-4 border-[#3E7CB1] flex flex-col items-center justify-center p-6">
              
              {/* GAMBAR PRODUK */}
              <img
                src={produk.gambar}
                alt="preview"
                className="w-40 h-40 object-contain mb-4"
              />

              {/* INFO PRODUK */}
              <p className="font-bold text-lg text-gray-700">{produk.nama}</p>
              <p className="text-gray-500">{produk.deskripsi}</p>
              <p className="text-[#3E7CB1] font-semibold mt-2">{produk.harga}</p>

            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}

// src/components/Hero.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import api from "../services/api";

// icons
import leftArrow from "../assets/icons/left.svg";
import rightArrow from "../assets/icons/right.svg";

// hero images
import bg1 from "../assets/hero1.png";
import bg2 from "../assets/hero2.png";
import bg3 from "../assets/hero3.png";

// layanan bordir
import seragam from "../assets/icons/seragam.svg";
import topi from "../assets/icons/topi.svg";
import emblem from "../assets/icons/emblem.svg";
import jaket from "../assets/icons/jaket.svg";
import tas from "../assets/icons/tas.svg";

export default function Beranda() {
  const images = [bg1, bg2, bg3];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [portfolioPhotos, setPortfolioPhotos] = useState([]);

  const nextImage = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setFade(false);
    }, 200);
  };

  const prevImage = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      setFade(false);
    }, 200);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextImage();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        const response = await api.get("/portfolio-photos");
        if (!isMounted) return;
        setPortfolioPhotos(response.data.data || []);
      } catch (error) {
        console.error("Gagal memuat portofolio:", error);
      }
    };

    fetchPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const storageBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    return base.replace(/\/api$/, "");
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full -mt-px h-[320px] sm:h-[400px] md:h-[520px] overflow-hidden bg-[#010E31]">
        <img
          src={images[index]}
          alt="Beranda JA Bordir"
          className={`w-full h-full object-cover brightness-[0.68] transition-opacity duration-500 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 text-white">
          <h2 className="text-base sm:text-xl md:text-3xl font-semibold font-[Palanquin_Dark]">
            Selamat datang di
          </h2>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-[Palanquin_Dark]">
            JA Bordir
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-[Palanquin]">
            Bordir apa saja bisa
          </p>
        </div>

        {/* Arrow Left */}
        <button
          onClick={prevImage}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2"
        >
          <img src={leftArrow} alt="Prev" className="w-8 md:w-10" />
        </button>

        {/* Arrow Right */}
        <button
          onClick={nextImage}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2"
        >
          <img src={rightArrow} alt="Next" className="w-8 md:w-10" />
        </button>
      </section>

      {/* ================= PUSAT BORDIR ================= */}
      <section className="w-full px-4 sm:px-6 md:px-4 py-12 sm:py-16 text-center">
        <h1
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-[#010E31] mb-3"
        >
          Pusat Bordir Komputer
        </h1>

        <p className="max-w-5xl mx-auto text-[#6D6D6D] leading-relaxed text-xs sm:text-sm md:text-base">
          JA Bordir, tempat di mana kualitas dan ketelitian menjadi prioritas
          utama dalam setiap hasil karya. Kami hadir untuk memenuhi kebutuhan
          bordir Anda dengan layanan yang profesional, mulai dari bordir
          seragam, logo, nama, hingga desain khusus sesuai permintaan.
          <br />
          Dengan dukungan pengalaman dan peralatan yang memadai, JA Bordir
          berkomitmen memberikan hasil yang rapi, kuat, dan estetik.
          <br />
          Setiap pesanan bagi kami adalah amanah, sehingga kami selalu
          mengerjakannya dengan penuh perhatian serta tanggung jawab.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10 max-w-5xl mx-auto">
          {[bg2, bg3].map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={img}
                alt={`Bordir ${i + 1}`}
                className="w-full h-40 sm:h-48 md:h-56 object-cover"
              />
              <div className="bg-[#3E7CB1] text-white font-semibold py-2 sm:py-3 text-sm sm:text-base">
                {i === 0 ? "Jasa Bordir Komputer" : "Bordir Partai Besar"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LAYANAN ================= */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-white text-center">
        <h2
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3E7CB1]"
        >
          Layanan Bordir Kami
        </h2>

        <p
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="mt-1 text-xs sm:text-sm text-[#010E31]"
        >
          Pilih sesuai dengan kebutuhan anda
        </p>

        <div className="max-w-6xl mx-auto mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {[
            { icon: seragam, label: "Bordir Seragam", type: "image" },
            { icon: topi, label: "Bordir Topi", type: "image" },
            { icon: emblem, label: "Bordir Emblem", type: "image" },
            { icon: jaket, label: "Bordir Jaket", type: "image" },
            { icon: tas, label: "Bordir Lainnya", type: "ellipsis" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center border-2 border-[#81A4CD]/80 rounded-3xl p-4 sm:p-6 hover:shadow-lg transition"
            >
              {item.type === "ellipsis" ? (
                <MoreHorizontal className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 opacity-80 text-[#A9C0E0]" />
              ) : (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-12 sm:w-16 md:w-24 opacity-80"
                />
              )}
              <p
                style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
                className="mt-3 text-[#3E7CB1] font-semibold text-[10px] sm:text-sm"
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PORTOFOLIO ================= */}
      <section className="bg-[#F17300] py-12 sm:py-16 px-4 sm:px-6">
        <div className="text-center mb-10 text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Portofolio JA Bordir
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base opacity-90">
            Setiap hasil karya JA Bordir dibuat dengan presisi
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {portfolioPhotos.length === 0 ? (
            <div className="col-span-full text-center text-sm text-white/80">
              Belum ada foto portofolio.
            </div>
          ) : (
            portfolioPhotos.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src={`${storageBaseUrl}/storage/${encodeURI(item.image_path)}`}
                  alt="Portofolio"
                  className="w-full h-full object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/portofolio"
            state={{ scrollToTop: true }}
            className="bg-[#3E7CB1] hover:bg-[#356a99] text-white font-semibold px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg shadow-lg transition"
          >
            Lihat Selengkapnya
          </Link>
        </div>
      </section>

      
    </>
  );
}

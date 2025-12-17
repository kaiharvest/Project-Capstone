// src/components/Hero.jsx
import React, { useState } from "react";

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

// portofolio
import porto from "../assets/portofolio/porto.png";
import porto1 from "../assets/portofolio/porto1.png";
import porto2 from "../assets/portofolio/porto2.png";
import porto3 from "../assets/portofolio/porto3.png";
import porto4 from "../assets/portofolio/porto4.png";
import porto5 from "../assets/portofolio/porto5.png";
import porto6 from "../assets/portofolio/porto6.png";
import porto7 from "../assets/portofolio/porto7.png";

import Footer from "../components/Footer";

export default function Beranda() {
  const images = [bg1, bg2, bg3];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

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

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[360px] md:h-[490px] overflow-hidden">
        <img
          src={images[index]}
          alt="Beranda JA Bordir"
          className={`w-full h-full object-cover brightness-75 transition-opacity duration-500 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 ml-6 text-white">
          <h2 className="text-2xl md:text-4xl font-bold font-[Palanquin_Dark]">
            Selamat datang di
          </h2>

          <h1 className="text-4xl md:text-6xl font-bold font-[Palanquin_Dark]">
            JA Bordir
          </h1>

          <p className="text-lg md:text-2xl font-[Palanquin]">
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
      <section className="w-full px-6 md:px-4 py-16 text-center">
        <h1
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="text-3xl md:text-4xl font-bold text-[#010E31] mb-4"
        >
          Pusat Bordir Komputer
        </h1>

        <p className="max-w-5xl mx-auto text-[#6D6D6D] leading-relaxed text-sm md:text-base">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
          {[bg2, bg3].map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={img}
                alt={`Bordir ${i + 1}`}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="bg-[#3E7CB1] text-white font-semibold py-3 text-lg">
                {i === 0 ? "Jasa Bordir Komputer" : "Bordir Partai Besar"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LAYANAN ================= */}
      <section className="w-full px-6 py-16 bg-white text-center">
        <h2
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="text-3xl md:text-4xl font-bold text-[#3E7CB1]"
        >
          Layanan Bordir Kami
        </h2>

        <p
          style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
          className="mt-1 text-sm text-[#010E31]"
        >
          Pilih sesuai dengan kebutuhan anda
        </p>

        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[seragam, topi, emblem, jaket, tas].map((icon, i) => (
            <div
              key={i}
              className="flex flex-col items-center border-2 border-[#81A4CD]/80 rounded-4xl p-6 hover:shadow-lg transition"
            >
              <img src={icon} alt="Layanan" className="w-16 md:w-24" />
              <p
                style={{ fontFamily: '"Noto Sans Telugu", sans-serif' }}
                className="mt-3 text-[#3E7CB1] font-semibold text-sm"
              >
                {["Bordir Seragam", "Bordir Topi", "Bordir Emblem", "Bordir Jaket", "Bordir Tas"][i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PORTOFOLIO ================= */}
      <section className="bg-[#F17300] py-16 px-6 rounded-tl-4xl">
        <div className="text-center mb-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Portofolio JA Bordir
          </h2>
          <p className="mt-2 text-sm md:text-base opacity-90">
            Setiap hasil karya JA Bordir dibuat dengan presisi
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[porto, porto1, porto2, porto3, porto4, porto5, porto6, porto7].map(
            (img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden bg-white shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
              >
                <img
                  src={img}
                  alt={`Portofolio ${i + 1}`}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
            )
          )}
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-[#3E7CB1] hover:bg-[#356a99] text-white font-semibold px-10 py-3 rounded-lg shadow-lg transition">
            Lihat Lengkap
          </button>
        </div>
      </section>

      
    </>
  );
}

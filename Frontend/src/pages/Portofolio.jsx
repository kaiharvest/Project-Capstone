import React from "react";

// import gambar
import porto from "../assets/portofolio/porto.png";
import porto1 from "../assets/portofolio/porto1.png";
import porto2 from "../assets/portofolio/porto2.png";
import porto3 from "../assets/portofolio/porto3.png";
import porto4 from "../assets/portofolio/porto4.png";
import porto5 from "../assets/portofolio/porto5.png";
import porto6 from "../assets/portofolio/porto6.png";
import porto7 from "../assets/portofolio/porto7.png";
import Footer from "../components/Footer";

export default function Portofolio() {
  const portofolioImages = [
    porto,
    porto1,
    porto2,
    porto3,
    porto4,
    porto5,
    porto6,
    porto7,
    porto,
    porto1,
    porto2,
    porto3,
    porto4,
    porto5,
    porto6,
    porto7,
  ];

  return (
    <>
      {/* ===== SECTION PORTOFOLIO ===== */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Judul */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3E7CB1] font-[Palanquin_Dark]">
              Portofolio JA Bordir
            </h1>
            <h3 className="mt-3 text-[#3E7CB1]">
              Setiap hasil karya JA Bordir dibuat dengan presisi
            </h3>
          </div>

          {/* Grid Portofolio */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              porto,
              porto1,
              porto2,
              porto3,
              porto4,
              porto5,
              porto6,
              porto7,
            ].map((img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src={img}
                  alt={`Portofolio ${i + 1}`}
                  className="w-140 h-65 object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (DI LUAR SECTION) ===== */}
    </>
  );
}

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Portofolio JA Bordir
            </h2>
            <p className="mt-3 text-gray-500">
              Setiap hasil karya JA Bordir dibuat dengan presisi
            </p>
          </div>

          {/* Grid Portofolio */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {portofolioImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={img}
                  alt={`Portofolio ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (DI LUAR SECTION) ===== */}
     
    </>
  );
}

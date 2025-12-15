import React from "react";
import profil from "../assets/profil.png";
import map from "../assets/icons/map.svg";
import Footer from "../components/Footer";

const Profil = () => {
  return (
    <>
      <section className="py-16">
        {/* CONTAINER */}
        <div className="max-w-5xl mx-auto px-6">
          {/* ================= PROFIL ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* IMAGE */}
            <div className="flex justify-center md:justify-start">
              <img
                src={profil}
                alt="JA Bordir"
                className="w-full max-w-[440px] rounded-2xl"
              />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-blue-600 pt-6 mb-2">
                Profil JA Bordir
              </h2>

              <p className="text-gray-700 leading-relaxed text-justify text-sm md:text-base">
                JA Bordir adalah usaha bordir yang mengutamakan kualitas,
                ketelitian, dan hasil akhir yang rapi. Kami melayani berbagai
                kebutuhan bordir mulai dari seragam, logo, nama, hingga desain
                custom sesuai permintaan. Dengan dukungan tenaga berpengalaman
                dan peralatan yang presisi, JA Bordir berkomitmen memberikan
                hasil bordir yang kuat, detail, dan bernilai estetika tinggi.{" "}
                <br />
                Kami percaya bahwa setiap jahitan memiliki makna, dan setiap
                pesanan adalah kepercayaan. Oleh karena itu, kami selalu
                mengutamakan kepuasan pelanggan melalui layanan yang cepat,
                ramah, dan hasil terbaik di setiap produk yang kami kerjakan.
              </p>
            </div>
          </div>

          {/* ================= MAP ================= */}
          <div className="mt-16">
            <div className="bg-orange-500 rounded-[32px] p-6 shadow-2xl">
              {/* TITLE */}
              <div className="flex items-start gap-4 text-white mb-4">
                <img src={map} alt="Map Icon" className="w-14 h-14 mt-1" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight">
                    Temukan JA Bordir di Sini
                  </h3>
                  <p className="text-sm opacity-90">Purwodadi, Jawa Tengah</p>
                </div>
              </div>
              {/* MAP */}{" "}
              <div className="relative bg-white rounded-2xl overflow-hidden border-[5px] border-[#F1B100]">
                {" "}
                {/* BUTTON OVER MAP */}{" "}
                <a
                  href="https://www.google.com/maps?q=Purwodadi,Jawa%20Tengah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 z-10 bg-white text-orange-500 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md hover:bg-orange-100 transition"
                >
                  {" "}
                  Lihat lebih jelas{" "}
                </a>{" "}
                {/* IFRAME MAP */}{" "}
                <iframe
                  title="Lokasi JA Bordir"
                  src="https://www.google.com/maps?q=Purwodadi,Jawa%20Tengah&output=embed"
                  className="w-full h-[360px] border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Profil;

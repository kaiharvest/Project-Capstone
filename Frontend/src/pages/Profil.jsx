import React, { useEffect, useMemo, useState } from "react";
import profil from "../assets/profil.png";
import map from "../assets/icons/map.svg";
import api from "../services/api";

const Profil = () => {
  const [profile, setProfile] = useState({
    description: "",
    address: "",
    google_maps_link: "",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const response = await api.get("/company-profile");
        if (!isMounted) return;
        setProfile({
          description: response.data.description || "",
          address: response.data.address || "",
          google_maps_link: response.data.google_maps_link || "",
        });
      } catch (error) {
        console.error("Gagal memuat profil perusahaan:", error);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const mapLink = profile.google_maps_link || "https://www.google.com/maps";
  const mapEmbedLink = useMemo(() => {
    if (!mapLink) return "";
    if (mapLink.includes("output=embed")) return mapLink;
    const joiner = mapLink.includes("?") ? "&" : "?";
    return `${mapLink}${joiner}output=embed`;
  }, [mapLink]);

  return (
    <>
      <section className="py-16">
        {/* CONTAINER */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
                {profile.description ||
                  "JA Bordir adalah usaha bordir yang mengutamakan kualitas, ketelitian, dan hasil akhir yang rapi. Kami melayani berbagai kebutuhan bordir mulai dari seragam, logo, nama, hingga desain custom sesuai permintaan."}
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
                  <p className="text-sm opacity-90">
                    {profile.address || "Purwodadi, Jawa Tengah"}
                  </p>
                </div>
              </div>
              {/* MAP */}{" "}
              <div className="relative bg-white rounded-2xl overflow-hidden border-[5px] border-[#F1B100]">
                {" "}
                {/* BUTTON OVER MAP */}{" "}
                <a
                  href={mapLink}
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
                  src={mapEmbedLink}
                  className="w-full h-64 sm:h-80 md:h-[360px] border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Profil;

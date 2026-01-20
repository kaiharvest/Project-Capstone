import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

export default function Portofolio() {
  const location = useLocation();
  const [portfolioPhotos, setPortfolioPhotos] = useState([]);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

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
      {/* ===== SECTION PORTOFOLIO ===== */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
            {portfolioPhotos.length === 0 ? (
              <div className="col-span-full text-center text-sm text-slate-500">
                Belum ada foto portofolio.
              </div>
            ) : (
              portfolioPhotos.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <img
                    src={`${storageBaseUrl}/storage/${encodeURI(item.image_path)}`}
                    alt="Portofolio"
                    className="w-full h-full object-cover block"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (DI LUAR SECTION) ===== */}
    </>
  );
}

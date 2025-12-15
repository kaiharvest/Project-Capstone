import React from "react";
import { Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#010E31] text-white">
      {/* Bar Atas */}
      <div className="text-center py-5 bg-[#001243] text-sm">
        <span className="font-semibold opacity-50">JA Bordir</span> Profesional
        dan Berpengalaman
        <span className="opacity-50"> sejak tahun 2015</span>
      </div>

      {/* Isi Footer */}
      <div className="max-w-7xl mx-auto px-14 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolom 1 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 ">JA BORDIR</h3>
          <p className="text-sm leading-relaxed opacity-50">
            Jasa Bordir Komputer Sejak 2015 <br />
            Profesional dan Berpengalaman
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm opacity-50">
            <Clock size={16} />
            <span>Mon-Sat 08.00am - 04.00pm WIB</span>
          </div>
        </div>

        {/* Kolom 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">LAYANAN JA BORDIR</h3>
          <ul className="space-y-1 text-sm opacity-50">
            <li>Bordir Seragam</li>
            <li>Bordir Topi</li>
            <li>Bordir Emblem</li>
            <li>Bordir Jaket</li>
            <li>Bordir Tas</li>
          </ul>
        </div>

        {/* Kolom 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">ALAMAT JA BORDIR</h3>
          <p className="text-sm opacity-50">Purwodadi, Jawa Tengah</p>
          <p className="text-sm">
            <span className="opacity-50">Kunjungi Workshop Kami : </span>
            <a href="#" className="text-white">
              Google Map
            </a>
          </p>
        </div>

        {/* Kolom 4 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">CUSTOMER SERVICE</h3>
          <p className="text-sm opacity-50">Contact via WhatsApp</p>

          <div className="flex items-center gap-2 text-sm mt-2 opacity-50">
            <Phone size={16} />
            <span>Admin: 082020200200</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

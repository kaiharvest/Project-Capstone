import React from "react";
import { FileText, Download } from "lucide-react";

const Pesanan = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-3xl">

        {/* Status */}
        <div className="flex gap-3 mb-4">
          <span className="px-4 py-1 rounded-full bg-yellow-400 text-white text-sm font-medium">
            Menunggu
          </span>
          <span className="px-4 py-1 rounded-full bg-gray-300 text-white text-sm font-medium">
            Diproses
          </span>
          <span className="px-4 py-1 rounded-full bg-gray-300 text-white text-sm font-medium">
            Selesai
          </span>
        </div>

        {/* Card */}
        <div className="bg-orange-500 rounded-2xl p-6 flex flex-col md:flex-row gap-6">

          {/* Left */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-white text-sm mb-1">
                Nomor Pesanan
              </label>
              <input
                type="text"
                readOnly
                value="20252812REG11097554333333"
                className="w-full px-4 py-2 rounded-full bg-white text-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">
                Bukti Pesanan
              </label>

              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value="bukti_pesanan.pdf"
                  className="flex-1 px-4 py-2 rounded-l-full bg-white text-gray-500 focus:outline-none"
                />

                <a
                  href="/file/bukti_pesanan.pdf"
                  download
                  className="flex items-center gap-2 px-5 py-2 rounded-r-full bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <Download size={16} />
                  Unduh
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition cursor-pointer">
            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
              <FileText className="text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              Lihat File
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pesanan;
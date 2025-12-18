import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import searchIcon from "../assets/icons/search.svg";
import notifIcon from "../assets/icons/notification.svg";
import cartIcon from "../assets/icons/shop.svg";
import userIcon from "../assets/icons/user.svg";

export default function Navbar() {
  return (
    <nav className="bg-[#010E31] text-[#81A4CD] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* === LOGO === */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="JA Bordir" className="h-10 object-contain" />
        </Link>

        {/* === MENU === */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <li>
            <Link to="/" className="hover:text-white">Beranda</Link>
          </li>
          <li>
            <Link to="/profil" className="hover:text-white">Profil</Link>
          </li>
          <li>
            <Link to="/portofolio" className="hover:text-white">Portofolio</Link>
          </li>
          <li>
            <Link to="/pesan" className="hover:text-white">Pesan</Link>
          </li>
          <li>
            <Link to="/pesanan" className="hover:text-white">Pesanan</Link>
          </li>
        </ul>

        {/* === SEARCH + ICONS === */}
        <div className="flex items-center gap-5">

          {/* SEARCH BAR */}
          <div className="hidden md:flex bg-white w-60 px-4 py-2 rounded-full items-center">
            <input
              type="text"
              placeholder="Cari"
              className="flex-grow outline-none text-sm text-gray-700 bg-transparent"
            />
            <img src={searchIcon} alt="Search" className="w-4 opacity-60" />
          </div>

          {/* NOTIFICATION */}
          <Link to="/notifikasi">
            <img src={notifIcon} alt="Notification" className="w-5 cursor-pointer hover:opacity-80" />
          </Link>

          {/* CART */}
          <Link to="/keranjang">
            <img src={cartIcon} alt="Cart" className="w-5 cursor-pointer hover:opacity-80" />
          </Link>

          {/* USER */}
          <Link to="/profil">
            <div className="bg-orange-500 p-2 rounded-full cursor-pointer hover:opacity-90">
              <img src={userIcon} alt="User" className="w-5" />
            </div>
          </Link>

        </div>

      </div>
    </nav>
  );
}

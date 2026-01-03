import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import searchIcon from "../assets/icons/search.svg";
import cartIcon from "../assets/icons/shop.svg";
import userIcon from "../assets/icons/user.svg";

export default function Navbar() {
  const activeClass = "text-white";
  const normalClass = "hover:text-white";

  // khusus icon user (biar keliatan nyala)
  const userActiveClass = "bg-orange-500 p-2 rounded-full";
  const userNormalClass = "p-2 rounded-full hover:opacity-90";

  const { pathname } = useLocation();

  // anggap semua halaman auth itu "user active"
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/auth"); // optional kalau nanti kamu bikin /auth/...

  return (
    <nav className="bg-[#010E31] text-[#81A4CD] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* === LOGO === */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="JA Bordir" className="h-10 object-contain" />
        </NavLink>

        {/* === MENU === */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Beranda
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profil"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Profil
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/portofolio"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Portofolio
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/pesan"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Pesan
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/pesanan"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Pesanan
            </NavLink>
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

          {/* CART */}
          <Link to="/keranjang">
            <img
              src={cartIcon}
              alt="Cart"
              className="w-5 cursor-pointer hover:opacity-80"
            />
          </Link>

          {/* USER (active untuk /login & /register) */}
          <Link
            to="/login"
            className={isAuthPage ? userActiveClass : userNormalClass}
          >
            <img src={userIcon} alt="User" className="w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

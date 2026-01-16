import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import logo from "../assets/logo.png";
import searchIcon from "../assets/icons/search.svg";
import cartIcon from "../assets/icons/shop.svg";
// import userIcon from "../assets/icons/user.svg"; // Tidak lagi diperlukan jika menggunakan teks "Login"

export default function Navbar() {
  const activeClass = "text-white";
  const normalClass = "hover:text-white";

  // Kita tidak lagi butuh userActiveClass dan userNormalClass karena kita akan menggunakan button teks
  // khusus icon user (biar keliatan nyala)
  // const userActiveClass = "bg-orange-500 p-2 rounded-full";
  // const userNormalClass = "p-2 rounded-full hover:opacity-90";

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Memeriksa status login saat komponen di-mount
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setLoggedInUser(JSON.parse(user));
    } else {
      setLoggedInUser(null);
    }
  }, [pathname]); // Jalankan ulang effect jika pathname berubah (misal setelah login/logout)

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#010E31] text-[#81A4CD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* === LOGO === */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="JA Bordir" className="h-10 object-contain" />
        </NavLink>

        {/* === HAMBURGER (MOBILE) === */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden text-white px-3 py-2 rounded-md hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>

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
        <div className="hidden md:flex items-center gap-5">
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

          {/* Login Button / User Profile Link */}
          {loggedInUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Menu akun"
              >
                <CircleUserRound size={22} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                  <Link
                    to="/akun"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Kelola Akun
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#3E78A9] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#326188] transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* === MOBILE MENU === */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed z-50 inset-y-0 left-0 w-[85%] max-w-[360px] md:hidden bg-[#0B1535] shadow-2xl rounded-r-3xl p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="JA Bordir" className="h-8 object-contain" />
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-white px-3 py-2 rounded-md hover:bg-slate-800"
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white w-full px-4 py-2 rounded-full items-center flex">
                <input
                  type="text"
                  placeholder="Cari pesan / portofolio..."
                  className="flex-grow outline-none text-sm text-gray-700 bg-transparent"
                />
                <img src={searchIcon} alt="Search" className="w-4 opacity-60" />
              </div>
              <Link to="/keranjang" onClick={() => setIsMenuOpen(false)}>
                <img
                  src={cartIcon}
                  alt="Cart"
                  className="w-6 cursor-pointer hover:opacity-80"
                />
              </Link>
            </div>

            <ul className="mt-6 space-y-4 font-medium text-lg">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeClass} block px-4 py-2 rounded-xl bg-white/10 border-l-4 border-blue-500`
                      : `${normalClass} block px-4 py-2`
                  }
                >
                  Beranda
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profil"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeClass} block px-4 py-2 rounded-xl bg-white/10 border-l-4 border-blue-500`
                      : `${normalClass} block px-4 py-2`
                  }
                >
                  Profil
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/portofolio"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeClass} block px-4 py-2 rounded-xl bg-white/10 border-l-4 border-blue-500`
                      : `${normalClass} block px-4 py-2`
                  }
                >
                  Portofolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pesan"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeClass} block px-4 py-2 rounded-xl bg-white/10 border-l-4 border-blue-500`
                      : `${normalClass} block px-4 py-2`
                  }
                >
                  Pesan
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pesanan"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeClass} block px-4 py-2 rounded-xl bg-white/10 border-l-4 border-blue-500`
                      : `${normalClass} block px-4 py-2`
                  }
                >
                  Pesanan
                </NavLink>
              </li>
            </ul>

            <div className="mt-8">
              {loggedInUser ? (
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                    aria-label="Menu akun"
                  >
                    <CircleUserRound size={24} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="mt-3 w-full rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                      <Link
                        to="/akun"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Kelola Akun
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center bg-[#3E78A9] text-white px-4 py-3 rounded-full text-base font-semibold hover:bg-[#326188] transition-colors duration-200 block"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

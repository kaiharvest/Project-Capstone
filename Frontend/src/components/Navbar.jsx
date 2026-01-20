import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
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

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = loggedInUser?.role === "admin";

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


  return (
    <nav className="bg-[#010E31] text-[#81A4CD] shadow-none fixed top-0 left-0 right-0 z-50">
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
              to={isAdmin ? "/admin/beranda" : "/"}
              end
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              Beranda
            </NavLink>
          </li>

          {!isAdmin && (
            <>
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
            </>
          )}
        </ul>

        {/* === ICONS === */}
        <div className="hidden md:flex items-center gap-5">
          {/* CART */}
          {!isAdmin && (
            <Link to="/keranjang">
              <img
                src={cartIcon}
                alt="Cart"
                className="w-5 cursor-pointer hover:opacity-80"
              />
            </Link>
          )}

          {/* Login Button / User Profile Link */}
          {loggedInUser ? (
            <Link
              to="/akun"
              className="text-white bg-orange-500 hover:bg-orange-600 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
            >
              {loggedInUser.name}
            </Link>
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
                className="text-white px-3 py-2 hover:bg-slate-800"
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              {loggedInUser ? (
                <Link
                  to="/akun"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white bg-orange-500 hover:bg-orange-600 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
                >
                  {loggedInUser.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[#3E78A9] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#326188] transition-colors duration-200"
                >
                  Login
                </Link>
              )}
              {!isAdmin && (
                <Link to="/keranjang" onClick={() => setIsMenuOpen(false)}>
                  <img
                    src={cartIcon}
                    alt="Cart"
                    className="w-6 cursor-pointer hover:opacity-80"
                  />
                </Link>
              )}
            </div>

            <ul className="mt-6 space-y-4 font-medium text-lg">
              <li>
                <NavLink
                  to={isAdmin ? "/admin/beranda" : "/"}
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
              {!isAdmin && (
                <>
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
                </>
              )}
            </ul>

          </div>
        </>
      )}
    </nav>
  );
}

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import { Toaster } from 'react-hot-toast'; // Import Toaster

import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Portofolio from "./pages/Portofolio";
import Pesan from "./pages/Pesan";
import Pesanan from "./pages/Pesanan";
import Keranjang from "./pages/Keranjang";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Akun from "./pages/Akun"; // Import Akun component

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster component */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/portofolio" element={<Portofolio />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/akun" element={<Akun />} /> {/* Add new route for Akun */}
      </Routes>
      
    </>
  );
}

export default App;

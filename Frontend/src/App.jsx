import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 

import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
import Portofolio from "./pages/Portofolio";
import Pesan from "./pages/Pesan";
import Pesanan from "./pages/Pesanan";
import Keranjang from "./pages/Keranjang";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
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
      </Routes>
      
    </>
  );
}

export default App;

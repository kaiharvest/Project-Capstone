import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 

import Beranda from "./pages/Beranda";
import Profil from "./pages/Profil";
// import Portofolio from "./pages/Portofolio";
// import Pesan from "./pages/Pesan";
// import Pesanan from "./pages/Pesanan";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/profil" element={<Profil />} />
        {/* <Route path="/portofolio" element={<Portofolio />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/pesanan" element={<Pesanan />} /> */}
      </Routes>
    </>
  );
}

export default App;

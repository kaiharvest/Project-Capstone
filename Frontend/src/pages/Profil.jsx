import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Profil = () => {
  const navigate = useNavigate();

  // State untuk autentikasi
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // State untuk form Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State untuk form Register
  const [registerForm, setRegisterForm] = useState({
    name: "",
    alamat: "",
    no_telpon: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // State untuk data profil pengguna
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    alamat: "",
    no_telpon: "",
    email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  // Effect untuk memeriksa token dan mengambil data profil saat komponen dimuat atau token berubah
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(); // Tidak perlu passing token lagi, interceptor akan menanganinya
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [token]);

  // Fungsi untuk mengambil data profil pengguna menggunakan Axios
  const fetchUserProfile = async () => {
    console.log("fetchUserProfile called with Axios");
    try {
      const response = await api.get('/user'); // Endpoint relatif, header ditangani interceptor
      
      const userData = response.data.data || response.data.user || response.data;

      setUser(userData);
      setProfileFormData({
        name: userData.name,
        alamat: userData.alamat,
        no_telpon: userData.no_telpon,
        email: userData.email,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // Axios menempatkan detail error di err.response
      const errorMessage = err.response?.data?.message || err.message || "Gagal mengambil data profil.";
      setError(errorMessage);
      if (err.response?.status === 401) {
        handleLogout();
        setError("Sesi berakhir atau token tidak valid. Silakan login kembali.");
      }
      setUser(null);
    }
  };

  // Fungsi untuk menangani login menggunakan Axios
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await api.post('/login', { email: loginEmail, password: loginPassword });
      
      localStorage.setItem("access_token", response.data.access_token);
      setToken(response.data.access_token); // Ini akan memicu useEffect untuk mengambil profil
      setLoginEmail("");
      setLoginPassword("");
      setMessage("Login berhasil!");
    } catch (err) {
      console.error("Error during login:", err);
      const errorMessage = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : "Login gagal.");
      setError(errorMessage);
    }
  };

  // Fungsi untuk menangani registrasi menggunakan Axios
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await api.post('/register', registerForm);
      
      // Reset form register
      setRegisterForm({
        name: "",
        alamat: "",
        no_telpon: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      setMessage("Registrasi berhasil! Silakan login untuk melanjutkan.");
      setIsRegistering(false); // Kembali ke form login
      setError(null);
    } catch (err) {
      console.error("Error during registration:", err);
      const errorMessage = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : "Registrasi gagal.");
      setError(errorMessage);
    }
  };

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    setError(null);
    setMessage("Anda telah logout.");
    navigate("/"); // Redirect ke halaman beranda
  };

  // Fungsi untuk mengubah mode tampilan/edit
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      setProfileFormData({
        name: user.name,
        alamat: user.alamat,
        no_telpon: user.no_telpon,
        email: user.email,
      });
      setNewPassword("");
      setNewPasswordConfirmation("");
    }
    setError(null);
    setMessage(null);
  };

  // Fungsi untuk menangani perubahan input form profil
  const handleProfileFormChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani perubahan input form register
  const handleRegisterFormChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani perubahan input password
  const handlePasswordChange = (e) => {
    if (e.target.name === "new_password") {
      setNewPassword(e.target.value);
    } else {
      setNewPasswordConfirmation(e.target.value);
    }
  };

  // Fungsi untuk menangani pembaruan profil menggunakan Axios
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const updatePayload = { ...profileFormData };
    if (newPassword) {
      updatePayload.password = newPassword;
      updatePayload.password_confirmation = newPasswordConfirmation;
    }

    try {
      const response = await api.put('/user/profile', updatePayload);
      
      setUser(response.data.user);
      setIsEditing(false);
      setNewPassword("");
      setNewPasswordConfirmation("");
      setMessage(response.data.message || "Profil berhasil diperbarui!");
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errData = err.response?.data;
      if (errData && errData.errors) {
          const validationErrors = Object.values(errData.errors).flat().join(" ");
          setError(validationErrors);
      } else {
          setError(errData?.message || "Gagal memperbarui profil.");
      }
    }
  };

    // Tampilan utama komponen Profil
    console.log("Current user state:", user); // Tambahkan baris ini untuk debugging
    return (
      <>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Halaman Profil Pengguna</h1>
  
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
  
            {!isLoggedIn ? (
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setIsRegistering(false)}
                    className={`py-2 px-4 font-bold ${!isRegistering ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className={`py-2 px-4 font-bold ${isRegistering ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  >
                    Register
                  </button>
                </div>
  
                {isRegistering ? (
                  // Form Register
                  <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Daftar Akun Baru</h2>
                  <form onSubmit={handleRegister}>
                    <div className="mb-4">
                      <label htmlFor="registerName" className="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
                      <input
                        type="text"
                        id="registerName"
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.name}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="registerAlamat" className="block text-gray-700 text-sm font-bold mb-2">Alamat:</label>
                      <input
                        type="text"
                        id="registerAlamat"
                        name="alamat"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.alamat}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="registerNoTelpon" className="block text-gray-700 text-sm font-bold mb-2">No. Telpon:</label>
                      <input
                        type="text"
                        id="registerNoTelpon"
                        name="no_telpon"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.no_telpon}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="registerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                      <input
                        type="email"
                        id="registerEmail"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.email}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                      <input
                        type="password"
                        id="registerPassword"
                        name="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.password}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="registerPasswordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password:</label>
                      <input
                        type="password"
                        id="registerPasswordConfirmation"
                        name="password_confirmation"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={registerForm.password_confirmation}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                      >
                        Daftar
                      </button>
                    </div>
                  </form>
                  </>
                ) : (
                  // Form Login
                  <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label htmlFor="loginEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                      <input
                        type="email"
                        id="loginEmail"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                      <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  </>
                )}
              </div>
            ) : (
              // Tampilan Profil Pengguna
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Detail Profil</h2>
                  <div>
                    <button
                      onClick={handleEditToggle}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      {isEditing ? "Batal Edit" : "Edit Profil"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Logout
                    </button>
                  </div>
                </div>
  
                {isEditing ? (
                  // Form Edit Profil
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={profileFormData.name}
                        onChange={handleProfileFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="alamat" className="block text-gray-700 text-sm font-bold mb-2">Alamat:</label>
                      <input
                        type="text"
                        id="alamat"
                        name="alamat"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={profileFormData.alamat}
                        onChange={handleProfileFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="no_telpon" className="block text-gray-700 text-sm font-bold mb-2">No. Telpon:</label>
                      <input
                        type="text"
                        id="no_telpon"
                        name="no_telpon"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={profileFormData.no_telpon}
                        onChange={handleProfileFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={profileFormData.email}
                        onChange={handleProfileFormChange}
                        required
                      />
                    </div>
  
                    <div className="mt-8 mb-4 border-t pt-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Ubah Kata Sandi (Opsional)</h3>
                        <div className="mb-4">
                            <label htmlFor="new_password" className="block text-gray-700 text-sm font-bold mb-2">Kata Sandi Baru:</label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="new_password_confirmation" className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Kata Sandi Baru:</label>
                            <input
                                type="password"
                                id="new_password_confirmation"
                                name="new_password_confirmation"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPasswordConfirmation}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
  
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                ) : (
                  // Tampilan Detail Profil
                  user ? (
                    <div>
                      <p className="mb-2"><strong>Nama:</strong> {user.name}</p>
                      <p className="mb-2"><strong>Alamat:</strong> {user.alamat}</p>
                      <p className="mb-2"><strong>No. Telpon:</strong> {user.no_telpon}</p>
                      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">Memuat profil...</p>
                  )
                )}
              </div>
            )}
          </div>
        </section>
  
        {/* Footer tetap ada */}
        {/* <Footer /> */}
      </>
    );
  };
  
  export default Profil;
  

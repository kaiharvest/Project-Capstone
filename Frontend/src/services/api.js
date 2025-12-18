import axios from 'axios';

// Membuat instance Axios yang dikonfigurasi
const api = axios.create({
    // Mengambil baseURL dari environment variable Vite
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Menambahkan interceptor untuk menyisipkan token Bearer secara otomatis
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Menambahkan header Authorization jika token ada
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Lakukan sesuatu dengan error permintaan
        return Promise.reject(error);
    }
);

// Anda juga bisa menambahkan interceptor untuk respons di sini jika perlu
// Contoh: menangani error 401 (unauthorized) secara global
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Contoh: hapus token dan redirect ke halaman login
            localStorage.removeItem('access_token');
            // Mungkin perlu cara yang lebih canggih untuk redirect di luar komponen React
            window.location.href = '/login'; // Redirect sederhana
        }
        return Promise.reject(error);
    }
);


export default api;

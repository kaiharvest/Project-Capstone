## Fitur API

### 1. Autentikasi

Sistem autentikasi menggunakan Laravel Sanctum untuk otentikasi berbasis token.

#### Registrasi User Baru

- **Endpoint:** `POST /api/register`
- **Deskripsi:** Mendaftarkan pengguna baru ke dalam sistem.
- **Validasi:**
  - `name`: Wajib, string, maksimal 255 karakter.
  - `alamat`: Wajib, string, maksimal 255 karakter.
  - `no_telpon`: Wajib, string, maksimal 20 karakter, harus mengikuti format nomor telepon Indonesia (`+628...` atau `08...`).
  - `email`: Wajib, string, format email valid, maksimal 255 karakter, unik (belum terdaftar).
  - `password`: Wajib, string, minimal 8 karakter, harus cocok dengan `password_confirmation`.
- **Body Request:**
  ```json
  {
      "name": "Nama Lengkap",
      "alamat": "Alamat Pengguna",
      "no_telpon": "081234567890",
      "email": "user@example.com",
      "password": "password_minimal_8_karakter",
      "password_confirmation": "password_minimal_8_karakter"
  }
  ```
- **Respon Sukses (201):**
  ```json
  {
      "message": "Registrasi berhasil!",
      "access_token": "{api_token}",
      "token_type": "Bearer",
      "user": { ... }
  }
  ```
- **Respon Gagal Validasi (401):**
  ```json
  {
      "message": "Data yang diberikan tidak valid.",
      "errors": {
          "field_name": ["Pesan error validasi."]
      }
  }
  ```

#### Login User

- **Endpoint:** `POST /api/login`
- **Deskripsi:** Mengautentikasi pengguna dan memberikan token akses.
- **Validasi:**
  - `email`: Wajib, string, format email valid, maksimal 255 karakter.
  - `password`: Wajib, string, minimal 8 karakter.
- **Body Request:**
  ```json
  {
      "email": "user@example.com",
      "password": "password_anda"
  }
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Login berhasil!",
      "access_token": "{api_token}",
      "token_type": "Bearer",
      "user": { ... }
  }
  ```
- **Respon Gagal Autentikasi/Validasi (401):**
  ```json
  {
      "message": "Email atau password salah."
  }
  // ATAU untuk kegagalan validasi
  {
      "message": "Data yang diberikan tidak valid.",
      "errors": {
          "field_name": ["Pesan error validasi."]
      }
  }
  ```

### 2. Pengguna (User)

#### Mendapatkan Data User Terotentikasi

- **Endpoint:** `GET /api/user`
- **Deskripsi:** Mengambil data pengguna yang sedang login/terotentikasi.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```
- **Respon Sukses (200):**
  ```json
  {
      "id": 1,
      "name": "Nama Lengkap",
      "email": "user@example.com",
      // ... data pengguna lainnya
  }
  ```
- **Respon Tidak Terotentikasi (401):**
  ```json
  {
      "message": "Unauthenticated."
  }
  ```
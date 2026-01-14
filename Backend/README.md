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

#### Update Profil User

- **Endpoint:** `PUT /api/user/profile`
- **Deskripsi:** Memperbarui informasi profil pengguna yang sedang login.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Validasi:**
  - `name`: Wajib, string, maksimal 255 karakter.
  - `alamat`: Wajib, string, maksimal 255 karakter.
  - `no_telpon`: Wajib, string, maksimal 20 karakter, harus mengikuti format nomor telepon Indonesia.
  - `email`: Wajib, string, format email valid, maksimal 255 karakter, unik (kecuali milik pengguna saat ini).
  - `password`: Opsional, minimal 6 karakter, harus cocok dengan `password_confirmation` jika disediakan.
- **Body Request:**
  ```json
  {
      "name": "Nama Lengkap Baru",
      "alamat": "Alamat Baru",
      "no_telpon": "081234567890",
      "email": "user_baru@example.com",
      "password": "password_baru",
      "password_confirmation": "password_baru"
  }
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Profil berhasil diperbarui!",
      "user": { ... }  // Data pengguna yang telah diperbarui
  }
  ```

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

#### Lupa Password (Permintaan OTP)

- **Endpoint:** `POST /api/forgot-password`
- **Deskripsi:** Mengirimkan OTP ke email pengguna untuk reset password.
- **Body Request:**
  ```json
  {
      "email": "user@example.com"
  }
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Kode OTP telah dikirim ke email Anda. Kode berlaku selama 10 menit."
  }
  ```
- **Respon Development (200):**
  ```json
  {
      "message": "Kode OTP telah dibuat untuk development. Gunakan OTP ini untuk testing: 123456",
      "otp": 123456
  }
  ```

#### Reset Password (Verifikasi OTP dan Set Password Baru)

- **Endpoint:** `POST /api/reset-password`
- **Deskripsi:** Memverifikasi OTP dan mengganti password pengguna.
- **Body Request:**
  ```json
  {
      "email": "user@example.com",
      "otp": "123456",
      "password": "password_baru",
      "password_confirmation": "password_baru"
  }
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Password berhasil direset."
  }
  ```
- **Respon Gagal (401):**
  ```json
  {
      "message": "Kode OTP tidak valid/telah kadaluarsa/telah digunakan."
  }
  ```

### 2. Manajemen Pesanan

#### Membuat Pesanan Baru

- **Endpoint:** `POST /api/orders`
- **Deskripsi:** Membuat pesanan layanan bordir baru.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```
- **Catatan:** Gunakan `Content-Type: multipart/form-data` jika mengupload gambar desain, atau `Content-Type: application/json` jika hanya mengirim data teks.
- **Validasi:**
  - `service_type`: Wajib, enum ['seragam', 'topi', 'emblem', 'jaket', 'tas'].
  - `embroidery_type`: Wajib, enum ['3d', 'computer'].
  - `size_cm`: Wajib, angka desimal.
  - `quantity`: Wajib, angka integer.
  - `shipping_method`: Wajib, enum ['jnt', 'jne'].
  - `shipping_address`: Wajib, teks.
  - `notes`: Opsional, teks tambahan.
  - `order_type`: Wajib, enum ['now', 'cart'] - untuk pesan sekarang atau simpan ke keranjang.
  - `design_image`: Opsional, file gambar (jpeg, png, jpg, gif, svg), maksimal 5MB - untuk upload desain bordir dari user.
- **Body Request (untuk form-data):**
  ```json
  {
      "service_type": "jaket",
      "embroidery_type": "3d",
      "size_cm": 10.50,
      "quantity": 5,
      "shipping_method": "jne",
      "notes": "Catatan tambahan untuk pesanan",
      "order_type": "now",
      "design_image": "(file gambar)"  // Opsional - file gambar desain bordir
  }
  ```
- **Body Request (untuk JSON):**
  ```json
  {
      "service_type": "jaket",
      "embroidery_type": "3d",
      "size_cm": 10.50,
      "quantity": 5,
      "shipping_method": "jne",
      "notes": "Catatan tambahan untuk pesanan",
      "order_type": "now"
  }
  ```
- **Respon Sukses (201):**
  ```json
  {
      "message": "Pesanan berhasil dibuat!",
      "data": { ... }  // Data pesanan yang dibuat
  }
  ```

#### Mendapatkan Daftar Pesanan

- **Endpoint:** `GET /api/orders`
- **Deskripsi:** Mendapatkan daftar semua pesanan pengguna.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```
- **Respon Sukses (200):**
  ```json
  {
      "data": [
          { ... },  // Data pesanan 1
          { ... }   // Data pesanan 2
          // ... dst
      ]
  }
  ```

#### Checkout dari Keranjang

- **Endpoint:** `POST /api/orders/{id}/checkout-from-cart`
- **Deskripsi:** Checkout pesanan yang sebelumnya disimpan di keranjang.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Checkout berhasil!",
      "data": { ... }  // Data pesanan yang diperbarui
  }
  ```

### 3. Manajemen Admin

> **Catatan:** Semua endpoint admin memerlukan header autentikasi dan role admin.

#### Endpoint Admin Prefix: `/api/admin`

#### Manajemen Pengguna (Admin)

##### Mendapatkan Daftar Pengguna

- **Endpoint:** `GET /api/admin/users`
- **Deskripsi:** Mendapatkan daftar semua pengguna.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Mendapatkan Detail Pengguna

- **Endpoint:** `GET /api/admin/users/{id}`
- **Deskripsi:** Mendapatkan detail pengguna tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Membuat Pengguna Baru

- **Endpoint:** `POST /api/admin/users`
- **Deskripsi:** Membuat pengguna baru.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Body Request:**
  ```json
  {
      "name": "Nama Pengguna",
      "email": "email@example.com",
      "password": "password_minimal_8_karakter",
      "role": "user"  // opsional, default ke 'user'
  }
  ```

##### Memperbarui Pengguna

- **Endpoint:** `PUT /api/admin/users/{id}`
- **Deskripsi:** Memperbarui data pengguna tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Body Request:**
  ```json
  {
      "name": "Nama Pengguna Baru",
      "email": "email_baru@example.com",
      "password": "password_baru",  // opsional
      "role": "admin"  // opsional
  }
  ```

##### Menghapus Pengguna

- **Endpoint:** `DELETE /api/admin/users/{id}`
- **Deskripsi:** Menghapus pengguna tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```
- **Respon Sukses (200):**
  ```json
  {
      "message": "Deleted"
  }
  ```

#### Manajemen Produk (Admin)

##### Mendapatkan Daftar Produk

- **Endpoint:** `GET /api/admin/products`
- **Deskripsi:** Mendapatkan daftar semua produk.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Mendapatkan Detail Produk

- **Endpoint:** `GET /api/admin/products/{id}`
- **Deskripsi:** Mendapatkan detail produk tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Membuat Produk Baru

- **Endpoint:** `POST /api/admin/products`
- **Deskripsi:** Membuat produk baru.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```

##### Memperbarui Produk

- **Endpoint:** `PUT /api/admin/products/{id}`
- **Deskripsi:** Memperbarui data produk tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```

##### Menghapus Produk

- **Endpoint:** `DELETE /api/admin/products/{id}`
- **Deskripsi:** Menghapus produk tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

#### Manajemen Pesanan (Admin)

##### Mendapatkan Daftar Pesanan

- **Endpoint:** `GET /api/admin/orders`
- **Deskripsi:** Mendapatkan daftar semua pesanan.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Mendapatkan Detail Pesanan

- **Endpoint:** `GET /api/admin/orders/{id}`
- **Deskripsi:** Mendapatkan detail pesanan tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Memperbarui Status Pesanan

- **Endpoint:** `POST /api/admin/orders/{id}/status`
- **Deskripsi:** Memperbarui status pesanan.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Body Request:**
  ```json
  {
      "status": "confirmed"  // enum: pending, processing, confirmed, cancelled
  }
  ```

##### Upload Bukti Pembayaran

- **Endpoint:** `POST /api/admin/orders/{id}/proof`
- **Deskripsi:** Upload bukti pembayaran untuk pesanan.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```
- **Body Request:** Form Data dengan field `proof_image`.

#### Manajemen Transaksi (Admin)

##### Mendapatkan Daftar Transaksi

- **Endpoint:** `GET /api/admin/transactions`
- **Deskripsi:** Mendapatkan daftar semua transaksi.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Mendapatkan Detail Transaksi

- **Endpoint:** `GET /api/admin/transactions/{id}`
- **Deskripsi:** Mendapatkan detail transaksi tertentu.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

##### Memperbarui Status Transaksi

- **Endpoint:** `POST /api/admin/transactions/{id}/status`
- **Deskripsi:** Memperbarui status transaksi.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  Content-Type: application/json
  ```
- **Body Request:**
  ```json
  {
      "status": "completed"  // status baru
  }
  ```

#### Laporan Keuangan (Admin)

##### Mendapatkan Laporan Keuangan

- **Endpoint:** `GET /api/admin/reports/finance`
- **Deskripsi:** Mendapatkan laporan keuangan.
- **Header:**
  ```
  Authorization: Bearer {api_token}
  Accept: application/json
  ```

### 4. Login Admin di Postman

Karena aplikasi menggunakan Laravel Sanctum untuk otentikasi, ada beberapa langkah tambahan yang perlu dilakukan untuk login admin di Postman:

#### Pengaturan Postman

1. **Nonaktifkan fitur Postman Interceptor** (jika aktif)
2. **Nonaktifkan fitur Postman Cookie** jika mengalami masalah

#### Langkah-langkah Login Admin

1. **Login Admin**:
   - **Metode:** `POST`
   - **URL:** `http://localhost:8000/api/login` (sesuaikan dengan URL aplikasi Anda)
   - **Headers:**
     - `Accept`: `application/json`
     - `Content-Type`: `application/json`
   - **Body** (raw JSON):
     ```json
     {
         "email": "admin@example.com",
         "password": "password"
     }
     ```

2. **Respons Login**:
   - Jika login sukses, Anda akan mendapatkan response dengan `access_token`
   - Simpan `access_token` untuk digunakan di request berikutnya

3. **Menggunakan Token untuk Request Admin**:
   - Untuk endpoint yang dilindungi middleware `auth:sanctum` dan `admin`, gunakan header:
     - `Authorization`: `Bearer {access_token_dari_login}`

#### Informasi Login Admin Default

- **Email:** `admin@example.com`
- **Password:** `password`

> **Catatan:** Login ini akan bekerja langsung dengan token-based authentication yang digunakan oleh Laravel Sanctum, tanpa memerlukan CSRF atau session cookies.
<<<<<<< HEAD
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>


## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> 6d0d751 (test staging)
# Project-Capstone

<<<<<<< HEAD
Proyek backend untuk aplikasi Capstone yang dibangun menggunakan Laravel.

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
=======
>>>>>>> 3f16384 (test)

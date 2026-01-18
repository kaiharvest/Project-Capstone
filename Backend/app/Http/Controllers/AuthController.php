<?php

namespace App\Http\Controllers;

use App\Models\User; // Import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Import the Hash facade
use Illuminate\Support\Facades\Auth; // Import the Auth facade
use Illuminate\Support\Facades\Mail; // Import the Mail facade
use Illuminate\Validation\ValidationException;
use App\Rules\IndonesianPhoneNumber; // Import the custom rule
use App\Http\Resources\UserResource; // Import UserResource

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'no_telpon' => ['required', 'string', 'max:20', new IndonesianPhoneNumber()], // Use the custom rule
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 401);
        }

        $user = User::create([
            'name' => $request->name,
            'alamat' => $request->alamat,
            'no_telpon' => $request->no_telpon,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
        ]);

        $token = $user->createToken('auth_token')->plainTextToken; // Generate a token

        return response()->json([
            'message' => 'Registrasi berhasil!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:6',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 401);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        
        $user = Auth::user(); // Get the authenticated user
        $token = $user->createToken('auth_token')->plainTextToken; // Generate a token

        return response()->json([
            'message' => 'Login berhasil!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function update_profile(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user

        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'no_telpon' => ['required', 'string', 'max:20', new IndonesianPhoneNumber()],
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'current_password' => 'sometimes|required|string',
                'password' => 'sometimes|required|string|min:6|confirmed', // Add password validation
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 401);
        }

        // Prepare data for update
        $updateData = [
            'name' => $validatedData['name'],
            'alamat' => $validatedData['alamat'],
            'no_telpon' => $validatedData['no_telpon'],
            'email' => $validatedData['email'],
        ];

        // If a new password is provided, hash and add it to update data
        if ($request->has('password')) {
            if (!Hash::check($validatedData['current_password'] ?? '', $user->password)) {
                return response()->json([
                    'message' => 'Password lama tidak sesuai.'
                ], 401);
            }
            $updateData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profil berhasil diperbarui!',
            'user' => new UserResource($user) // Return updated user data using UserResource
        ]);
    }

    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 401);
        }

        $email = $request->email;

        // Generate OTP 6 digit
        $otp = rand(100000, 999999);

        // Set waktu kadaluarsa OTP (10 menit)
        $expiresAt = now()->addMinutes(10);

        // Hapus OTP lama yang mungkin ada untuk email ini
        \App\Models\PasswordResetOtp::where('email', $email)->delete();

        // Simpan OTP baru ke database
        \App\Models\PasswordResetOtp::create([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => $expiresAt
        ]);

        // Kirim OTP ke email - hanya di production
        // Untuk development, kita hanya menyimpan OTP ke database dan mengembalikan OTP di response
        if (app()->environment('production')) {
            try {
                Mail::send('emails.password_reset_otp', ['otp' => $otp], function ($message) use ($email) {
                    $message->to($email)->subject('Kode Reset Password Anda');
                });
            } catch (\Exception $e) {
                // Hapus OTP yang telah dibuat jika pengiriman email gagal
                \App\Models\PasswordResetOtp::where('email', $email)->delete();

                return response()->json([
                    'message' => 'Gagal mengirim kode OTP ke email. Silakan coba lagi nanti.'
                ], 500);
            }
        } else {
            // Di environment development, kembalikan OTP dalam response untuk testing
            return response()->json([
                'message' => 'Kode OTP telah dibuat untuk development. Gunakan OTP ini untuk testing: ' . $otp,
                'otp' => $otp  // Hanya untuk development, jangan gunakan di production
            ]);
        }

        return response()->json([
            'message' => 'Kode OTP telah dikirim ke email Anda. Kode berlaku selama 10 menit.'
        ]);
    }

    public function verifyOtpAndResetPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'otp' => 'required|string',
                'password' => 'required|string|min:6|confirmed'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e->errors(),
            ], 401);
        }

        $email = $request->email;
        $otp = $request->otp;

        // Cari OTP di database
        $passwordResetOtp = \App\Models\PasswordResetOtp::where('email', $email)
            ->where('otp', $otp)
            ->first();

        // Periksa apakah OTP ditemukan
        if (!$passwordResetOtp) {
            return response()->json([
                'message' => 'Kode OTP tidak valid.'
            ], 401);
        }

        // Periksa apakah OTP masih berlaku
        if ($passwordResetOtp->isExpired()) {
            return response()->json([
                'message' => 'Kode OTP sudah kadaluarsa.'
            ], 401);
        }

        // Periksa apakah OTP sudah digunakan
        if ($passwordResetOtp->used) {
            return response()->json([
                'message' => 'Kode OTP sudah digunakan.'
            ], 401);
        }

        // Cari user berdasarkan email
        $user = \App\Models\User::where('email', $email)->first();

        // Update password user
        $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        $user->save();

        // Tandai OTP sebagai sudah digunakan
        $passwordResetOtp->used = true;
        $passwordResetOtp->save();

        return response()->json([
            'message' => 'Password berhasil direset.'
        ]);
    }
}

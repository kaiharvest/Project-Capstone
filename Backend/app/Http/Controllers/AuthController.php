<?php

namespace App\Http\Controllers;

use App\Models\User; // Import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Import the Hash facade
use Illuminate\Support\Facades\Auth; // Import the Auth facade
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
                'password' => 'required|string|min:8|confirmed',
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
                'password' => 'required|string|min:8',
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
                'password' => 'sometimes|required|string|min:8|confirmed', // Add password validation
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
            $updateData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profil berhasil diperbarui!',
            'user' => new UserResource($user) // Return updated user data using UserResource
        ]);
    }
}

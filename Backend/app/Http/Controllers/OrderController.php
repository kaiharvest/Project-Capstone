<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Menampilkan semua pesanan milik user yang login
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Order::where('user_id', $user->id);

        // Filter berdasarkan status jika disediakan
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Filter berdasarkan order_type jika disediakan
        if ($request->has('order_type') && !empty($request->order_type)) {
            $query->where('order_type', $request->order_type);
        }

        $orders = $query->orderBy('created_at', 'desc')
                      ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Menyimpan pesanan baru ke database
     */
    public function store(Request $request)
    {
        // Debug: Log semua input yang diterima
        \Log::info('OrderController@store - Request received', [
            'all_inputs' => $request->all(),
            'input_keys' => array_keys($request->all()),
            'has_file' => $request->hasFile('design_image'),
            'file_info' => $request->hasFile('design_image') ? [
                'name' => $request->file('design_image')->getClientOriginalName(),
                'size' => $request->file('design_image')->getSize(),
                'extension' => $request->file('design_image')->getClientOriginalExtension()
            ] : null,
            'headers' => $request->header(),
        ]);

        // Ambil semua input dan normalisasi nama field
        $input = $request->all();
        $normalizedInput = [];

        foreach ($input as $key => $value) {
            // Normalisasi nama field berdasarkan pola yang diketahui
            $normalizedKey = $key;

            // Jika nama field memiliki underscore di akhir (seperti yang terlihat di log sebelumnya)
            if (preg_match('/^(service_type|embroidery_type|size_cm|quantity|shipping_method|order_type|notes)_+$/', $key, $matches)) {
                $normalizedKey = $matches[1]; // Ambil nama field tanpa underscore di akhir
            }

            $normalizedInput[$normalizedKey] = $value;
        }

        // Debug: Log input yang dinormalisasi
        \Log::info('OrderController@store - Normalized input', [
            'normalized_inputs' => $normalizedInput,
            'normalized_keys' => array_keys($normalizedInput),
        ]);

        // Validasi input dari user
        $validator = Validator::make($normalizedInput, [
            'service_type' => 'required|in:seragam,topi,emblem,jaket,tas',
            'embroidery_type' => 'required|in:3d,computer',
            'size_cm' => 'required|numeric|min:0.1',
            'quantity' => 'required|integer|min:1',
            'shipping_method' => 'required|in:jnt,jne',
            'order_type' => 'required|in:now,cart',
            'notes' => 'nullable|string|max:500',
            'design_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            \Log::error('OrderController@store - Validation failed', [
                'errors' => $validator->errors()->toArray(),
                'normalized_input' => $normalizedInput,
                'original_input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Ambil user yang sedang login
        $user = Auth::user();

        // Ambil alamat dari profil user
        $shippingAddress = $user->alamat;

        // Hitung total harga berdasarkan aturan harga dari sistem
        $totalPrice = $this->calculateTotalPrice(
            $normalizedInput['service_type'],
            $normalizedInput['embroidery_type'],
            $normalizedInput['size_cm'],
            $normalizedInput['quantity']
        );

        // Siapkan data untuk disimpan
        $orderData = [
            'user_id' => $user->id,
            'service_type' => $normalizedInput['service_type'],
            'embroidery_type' => $normalizedInput['embroidery_type'],
            'size_cm' => $normalizedInput['size_cm'],
            'quantity' => $normalizedInput['quantity'],
            'shipping_method' => $normalizedInput['shipping_method'],
            'shipping_address' => $shippingAddress,
            'total_price' => $totalPrice,
            'status' => $normalizedInput['order_type'] === 'now' ? 'pending' : 'cart',
            'order_type' => $normalizedInput['order_type'],
            'notes' => $normalizedInput['notes'] ?? null,
        ];

        // Jika ada file gambar desain yang diupload
        if ($request->hasFile('design_image')) {
            $image = $request->file('design_image');
            $imageName = 'design_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('designs', $imageName, 'public'); // Simpan di storage/app/public/designs
            $orderData['design_image_path'] = $imageName;
        }

        // Buat pesanan baru
        $order = Order::create($orderData);

        // Return response sukses
        $message = $request->order_type === 'now'
            ? 'Pesanan berhasil dibuat dan ditandai sebagai pending.'
            : 'Pesanan ditambahkan ke keranjang.';

        return response()->json([
            'message' => $message,
            'order' => $order
        ], 201);
    }

    /**
     * Menampilkan detail pesanan
     */
    public function show($id)
    {
        $user = Auth::user();

        // Jika user adalah admin, mereka bisa mengakses semua pesanan
        if ($user->isAdmin()) {
            $order = Order::findOrFail($id);
        } else {
            // Jika bukan admin, hanya bisa mengakses pesanan miliknya sendiri
            $order = Order::where('id', $id)
                          ->where('user_id', $user->id)
                          ->firstOrFail();
        }

        return response()->json($order);
    }

    /**
     * Mengupdate pesanan
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        // Validasi input
        $validator = Validator::make($request->all(), [
            'service_type' => 'sometimes|required|in:seragam,topi,emblem,jaket,tas',
            'embroidery_type' => 'sometimes|required|in:3d,computer',
            'size_cm' => 'sometimes|required|numeric|min:0.1',
            'quantity' => 'sometimes|required|integer|min:1',
            'shipping_method' => 'sometimes|required|in:jnt,jne',
            'notes' => 'sometimes|nullable|string|max:500',
            'design_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Siapkan data yang akan diupdate
        $updateData = $request->only([
            'service_type', 'embroidery_type',
            'size_cm', 'quantity',
            'shipping_method', 'notes'
        ]);

        // Jika ada file gambar desain yang diupload
        if ($request->hasFile('design_image')) {
            $image = $request->file('design_image');
            $imageName = 'design_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('designs', $imageName, 'public'); // Simpan di storage/app/public/designs
            $updateData['design_image_path'] = $imageName;
        }

        // Update data pesanan
        $order->update($updateData);

        // Jika ada perubahan yang mempengaruhi harga, hitung ulang harga
        if ($request->hasAny(['service_type', 'embroidery_type', 'size_cm', 'quantity'])) {
            $totalPrice = $this->calculateTotalPrice(
                $request->service_type ?? $order->service_type,
                $request->embroidery_type ?? $order->embroidery_type,
                $request->size_cm ?? $order->size_cm,
                $request->quantity ?? $order->quantity
            );
            $order->update(['total_price' => $totalPrice]);
        }

        return response()->json([
            'message' => 'Pesanan berhasil diperbarui.',
            'order' => $order
        ]);
    }

    /**
     * Menghapus pesanan (misalnya dari keranjang)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        $order->delete();

        return response()->json([
            'message' => 'Pesanan berhasil dihapus.'
        ]);
    }

    /**
     * Melakukan checkout pesanan dari keranjang
     */
    public function checkoutFromCart($id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->where('order_type', 'cart')
                      ->firstOrFail();

        // Update status menjadi pending
        $order->update([
            'status' => 'pending',
            'order_type' => 'now'
        ]);

        return response()->json([
            'message' => 'Pesanan berhasil di-checkout dari keranjang.',
            'order' => $order
        ]);
    }

    /**
     * Upload bukti pembayaran
     */
    public function uploadPaymentProof(Request $request, $id)
    {
        $user = Auth::user();

        // Validasi input
        $validator = Validator::make($request->all(), [
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::findOrFail($id);

        // Pastikan hanya pemilik pesanan yang bisa upload bukti pembayaran
        if ($order->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Validasi status pesanan (misalnya hanya bisa upload jika status pending)
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Cannot upload payment proof for this order status'
            ], 400);
        }

        if ($request->hasFile('payment_proof')) {
            // Hapus bukti pembayaran lama jika ada
            if ($order->payment_proof_path) {
                \Storage::disk('public')->delete($order->payment_proof_path);
            }

            // Simpan bukti pembayaran baru
            $fileName = 'payment_proofs/' . uniqid() . '_' . $request->file('payment_proof')->getClientOriginalName();
            $path = $request->file('payment_proof')->storeAs('public', $fileName);

            // Update order dengan path bukti pembayaran
            $order->update([
                'payment_proof_path' => str_replace('public/', '', $path),
                'payment_proof_uploaded_at' => now(),
                'payment_status' => 'pending', // Menunggu verifikasi
                'status' => 'processing' // Ubah status pesanan ke processing
            ]);
        }

        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'data' => $order
        ]);
    }

    /**
     * Menampilkan bukti pembayaran
     */
    public function showPaymentProof($id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);

        // Pastikan hanya pemilik pesanan atau admin yang bisa melihat bukti pembayaran
        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$order->payment_proof_path) {
            return response()->json([
                'message' => 'Payment proof not found'
            ], 404);
        }

        $path = storage_path('app/public/' . $order->payment_proof_path);

        if (!file_exists($path)) {
            return response()->json([
                'message' => 'File payment proof not found'
            ], 404);
        }

        return response()->download($path);
    }

    /**
     * Upload bukti pemesanan (lama - untuk backward compatibility)
     */
    public function uploadProof(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        $request->validate([
            'proof_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
        ]);

        if ($request->hasFile('proof_image')) {
            $image = $request->file('proof_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('proofs', $imageName, 'public'); // Simpan di storage/app/public/proofs

            $order->update([
                'proof_image' => $imageName,
                'status' => 'processing' // Ubah status menjadi processing setelah upload bukti
            ]);

            return response()->json([
                'message' => 'Bukti pemesanan berhasil diunggah.',
                'order' => $order
            ]);
        }

        return response()->json([
            'message' => 'Gagal mengunggah bukti pemesanan.',
        ], 400);
    }

    /**
     * Upload gambar desain bordir
     */
    public function uploadDesignImage(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        $request->validate([
            'design_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // max 5MB
        ]);

        if ($request->hasFile('design_image')) {
            $image = $request->file('design_image');
            $imageName = 'design_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('designs', $imageName, 'public'); // Simpan di storage/app/public/designs

            $order->update([
                'design_image_path' => $imageName
            ]);

            return response()->json([
                'message' => 'Gambar desain bordir berhasil diunggah.',
                'order' => $order
            ]);
        }

        return response()->json([
            'message' => 'Gagal mengunggah gambar desain bordir.',
        ], 400);
    }

    /**
     * Menampilkan bukti pemesanan
     */
    public function showProof($id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        if (!$order->proof_image) {
            return response()->json([
                'message' => 'Bukti pemesanan tidak ditemukan.',
            ], 404);
        }

        $path = storage_path('app/public/proofs/' . $order->proof_image);

        if (!file_exists($path)) {
            return response()->json([
                'message' => 'File bukti pemesanan tidak ditemukan.',
            ], 404);
        }

        return response()->download($path);
    }

    /**
     * Menampilkan gambar desain bordir
     */
    public function showDesignImage($id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();

        if (!$order->design_image_path) {
            return response()->json([
                'message' => 'Gambar desain bordir tidak ditemukan.',
            ], 404);
        }

        $path = storage_path('app/public/designs/' . $order->design_image_path);

        if (!file_exists($path)) {
            return response()->json([
                'message' => 'File gambar desain bordir tidak ditemukan.',
            ], 404);
        }

        return response()->download($path);
    }

    /**
     * Fungsi untuk menghitung total harga berdasarkan aturan dari sistem
     * Ini diambil dari aturan harga yang ditentukan oleh admin
     */
    private function calculateTotalPrice($serviceType, $embroideryType, $sizeCm, $quantity)
    {
        // Ambil aturan harga dari setting
        $pricingRules = \App\Models\Setting::getPricingRules();

        // Jika tidak ada aturan harga, gunakan nilai default
        if (!$pricingRules) {
            // Default pricing - dalam implementasi nyata, ini harus diset oleh admin
            $pricingRules = [
                'base_price_per_cm' => 500,
                'embroidery_multipliers' => [
                    '3d' => 1.5,
                    'computer' => 1.0
                ],
                'service_multipliers' => [
                    'seragam' => 1.0,
                    'topi' => 1.2,
                    'emblem' => 1.1,
                    'jaket' => 1.3,
                    'tas' => 1.2
                ],
                'shipping_cost' => 20000
            ];
        }

        // Ambil harga dasar per cm
        $basePricePerCm = $pricingRules['base_price_per_cm'] ?? 500;

        // Ambil faktor harga berdasarkan jenis bordir
        $embroideryMultiplier = $pricingRules['embroidery_multipliers'][$embroideryType] ?? 1.0;

        // Ambil faktor harga berdasarkan jenis layanan
        $serviceMultiplier = $pricingRules['service_multipliers'][$serviceType] ?? 1.0;

        // Harga dasar dengan semua faktor
        $price = $basePricePerCm * $sizeCm * $embroideryMultiplier * $serviceMultiplier * $quantity;

        // Ambil biaya pengiriman
        $shippingCost = $pricingRules['shipping_cost'] ?? 20000;
        $total = $price + $shippingCost;

        return (int) $total;
    }
}
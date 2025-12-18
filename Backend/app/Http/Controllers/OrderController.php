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
    public function index()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);
        
        return response()->json($orders);
    }

    /**
     * Menyimpan pesanan baru ke database
     */
    public function store(Request $request)
    {
        // Validasi input dari user
        $validator = Validator::make($request->all(), [
            'service_type' => 'required|in:seragam,topi,emblem,jaket,tas',
            'embroidery_type' => 'required|in:3d,computer',
            'size_cm' => 'required|numeric|min:0.1',
            'quantity' => 'required|integer|min:1',
            'shipping_method' => 'required|in:jnt,jne',
            'order_type' => 'required|in:now,cart',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
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
            $request->service_type,
            $request->embroidery_type,
            $request->size_cm,
            $request->quantity
        );

        // Buat pesanan baru
        $order = Order::create([
            'user_id' => $user->id,
            'service_type' => $request->service_type,
            'embroidery_type' => $request->embroidery_type,
            'size_cm' => $request->size_cm,
            'quantity' => $request->quantity,
            'shipping_method' => $request->shipping_method,
            'shipping_address' => $shippingAddress,
            'total_price' => $totalPrice,
            'status' => $request->order_type === 'now' ? 'pending' : 'cart',
            'order_type' => $request->order_type,
            'notes' => $request->notes ?? null,
        ]);

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
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();
        
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Simpan data yang akan diupdate
        $updateData = $request->only([
            'service_type', 'embroidery_type', 
            'size_cm', 'quantity', 
            'shipping_method', 'notes'
        ]);

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
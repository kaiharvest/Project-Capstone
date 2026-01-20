<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Menampilkan daftar pesanan untuk admin
     */
    public function index(Request $request)
    {
        $this->autoCompleteOrders();
        $query = Order::with(['user', 'transaction']); // Include user and transaction information

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user_id if provided
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by order_type if provided
        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        // Filter by date range if provided
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        return $query->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Menampilkan detail pesanan
     */
    public function show($id)
    {
        return Order::with(['user', 'items.product', 'transaction'])->findOrFail($id);
    }

    /**
     * Memperbarui status pesanan
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:pending,processing,confirmed,cancelled,cart'
        ]);

        $order->update(['status' => $data['status']]);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui.',
            'order' => $order
        ]);
    }

    /**
     * Memperbarui total harga pesanan
     */
    public function updateTotalPrice(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'total_price' => 'required|numeric|min:0'
        ]);

        $order->update(['total_price' => $data['total_price']]);

        return response()->json([
            'message' => 'Total harga pesanan berhasil diperbarui.',
            'order' => $order
        ]);
    }

    /**
     * Memperbarui estimasi selesai pesanan
     */
    public function updateEstimatedCompletion(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'estimated_completion_date' => 'required|date',
        ]);

        $order->update([
            'estimated_completion_date' => $data['estimated_completion_date'],
        ]);

        return response()->json([
            'message' => 'Estimasi selesai berhasil diperbarui.',
            'order' => $order
        ]);
    }

    /**
     * Upload bukti pemesanan (admin bisa mengganti bukti jika diperlukan)
     */
    public function uploadProof(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'proof_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
        ]);

        if ($request->hasFile('proof_image')) {
            $image = $request->file('proof_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('proofs', $imageName, 'public'); // Simpan di storage/app/public/proofs

            $order->update([
                'proof_image' => $imageName
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
     * Menampilkan bukti pemesanan
     */
    public function showProof($id)
    {
        $order = Order::findOrFail($id);

        if (!$order->payment_proof_path && !$order->proof_image) {
            return response()->json([
                'message' => 'Bukti pemesanan tidak ditemukan.',
            ], 404);
        }

        $paths = [];
        if ($order->payment_proof_path) {
            $paths[] = storage_path('app/public/' . $order->payment_proof_path);
            $paths[] = storage_path('app/' . $order->payment_proof_path);
        }
        if ($order->proof_image) {
            $paths[] = storage_path('app/public/proofs/' . $order->proof_image);
        }

        foreach ($paths as $path) {
            if ($path && file_exists($path)) {
                return response()->download($path);
            }
        }

        return response()->json([
            'message' => 'File bukti pemesanan tidak ditemukan.',
        ], 404);
    }

    /**
     * Menampilkan gambar desain bordir
     */
    public function showDesignImage($id)
    {
        $order = Order::findOrFail($id);

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

    private function autoCompleteOrders(): void
    {
        Order::where('status', 'processing')
            ->whereNotNull('estimated_completion_date')
            ->whereDate('estimated_completion_date', '<=', now()->toDateString())
            ->update(['status' => 'confirmed']);
    }
}

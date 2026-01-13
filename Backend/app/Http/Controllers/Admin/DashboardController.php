<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $period = intval($request->get('period', 30));
        $from = now()->subDays($period)->startOfDay();

        $usersCount = User::count();
        $ordersCount = Order::count();
        $transactionsCount = Transaction::count();
        $revenueTotal = Transaction::where('status', 'paid')->sum(DB::raw('COALESCE((SELECT total_price FROM orders WHERE orders.id = transactions.order_id), 0)'));

        $categories = Product::query()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        $salesChart = Transaction::query()
            ->where('status', 'paid')
            ->where('paid_at', '>=', $from)
            ->selectRaw('DATE(paid_at) as date, SUM(COALESCE((SELECT total_price FROM orders WHERE orders.id = transactions.order_id), 0)) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = [];
        if (Schema::hasTable('order_items') && Schema::hasTable('products')) {
            $topProducts = DB::table('order_items')
                ->join('products', 'products.id', '=', 'order_items.product_id')
                ->selectRaw('products.id, products.name, SUM(order_items.quantity) as qty')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('qty')
                ->limit(5)
                ->get();
        }

        $topEmbroideryTypes = [];
        if (Schema::hasTable('orders')) {
            $topEmbroideryTypes = DB::table('orders')
                ->selectRaw('embroidery_type, COUNT(*) as total')
                ->whereNotNull('embroidery_type')
                ->groupBy('embroidery_type')
                ->orderByDesc('total')
                ->limit(5)
                ->get();
        }

        return response()->json([
            'users_count' => $usersCount,
            'orders_count' => $ordersCount,
            'transactions_count' => $transactionsCount,
            'revenue_total' => $revenueTotal,
            'categories' => $categories,
            'sales_chart' => $salesChart,
            'top_products' => $topProducts,
            'top_embroidery_types' => $topEmbroideryTypes,
        ]);
    }

    public function salesReport(Request $request)
    {
        $period = intval($request->get('period', 30));
        $from = now()->subDays($period)->startOfDay();

        $totalTransactions = Transaction::where('created_at', '>=', $from)->count();
        $totalRevenue = Transaction::where('status', 'paid')->where('paid_at', '>=', $from)->sum(DB::raw('COALESCE((SELECT total_price FROM orders WHERE orders.id = transactions.order_id), 0)'));

        $productsSold = 0;
        if (Schema::hasTable('order_items')) {
            $productsSold = DB::table('order_items')
                ->where('created_at', '>=', $from)
                ->sum('quantity');
        }

        $salesChart = Transaction::query()
            ->where('status', 'paid')
            ->where('paid_at', '>=', $from)
            ->selectRaw('DATE(paid_at) as date, SUM(COALESCE((SELECT total_price FROM orders WHERE orders.id = transactions.order_id), 0)) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = [];
        if (Schema::hasTable('order_items') && Schema::hasTable('products')) {
            $topProducts = DB::table('order_items')
                ->join('products', 'products.id', '=', 'order_items.product_id')
                ->where('order_items.created_at', '>=', $from)
                ->selectRaw('products.id, products.name, SUM(order_items.quantity) as qty')
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('qty')
                ->limit(5)
                ->get();
        }

        $topEmbroideryTypes = [];
        if (Schema::hasTable('orders')) {
            $topEmbroideryTypes = DB::table('orders')
                ->where('created_at', '>=', $from)
                ->selectRaw('embroidery_type, COUNT(*) as total')
                ->whereNotNull('embroidery_type')
                ->groupBy('embroidery_type')
                ->orderByDesc('total')
                ->limit(5)
                ->get();
        }

        return response()->json([
            'total_transactions' => $totalTransactions,
            'products_sold' => $productsSold,
            'total_revenue' => $totalRevenue,
            'sales_chart' => $salesChart,
            'summary' => [
                'top_products' => $topProducts,
                'top_embroidery_types' => $topEmbroideryTypes,
            ],
        ]);
    }
}

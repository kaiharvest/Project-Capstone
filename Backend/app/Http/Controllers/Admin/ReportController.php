<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Transaction;

class ReportController extends Controller
{
   public function finance(Request $request) {
// basic financial summary: total revenue, orders count, pending
$period = $request->get('period','30'); // days
$from = now()->subDays(intval($period));


$revenue = Transaction::where('status','paid')
->where('paid_at','>=',$from)
->with('order')
->get()
->sum(fn($t) => $t->order->total_price ?? 0);


$orders = Order::where('created_at','>=',$from)->count();
$completed = Order::where('status','completed')->where('created_at','>=',$from)->count();


return response()->json([
'revenue'=>$revenue,
'orders'=>$orders,
'completed'=>$completed,
]);
}
}

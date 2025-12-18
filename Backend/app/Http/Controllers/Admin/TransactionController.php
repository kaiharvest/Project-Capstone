<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
   public function index(Request $request) {
$q = Transaction::with('order.user');
if ($request->filled('status')) $q->where('status',$request->status);
return $q->paginate(20);
}


public function show($id) {
return Transaction::with('order.items.product','order.user')->findOrFail($id);
}


public function updateStatus(Request $request,$id) {
$transaction = Transaction::findOrFail($id);
$data = $request->validate(['status'=>'required|in:pending,paid,failed']);
$transaction->update(['status'=>$data['status']]);
if ($data['status'] === 'paid') {
$transaction->update(['paid_at' => now()]);
// optional: mark order completed
$transaction->order->update(['status'=>'completed']);
}
return response()->json(['message'=>'Status updated','transaction'=>$transaction]);
}
}

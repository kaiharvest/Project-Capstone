<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request) {
// filter by status, user etc
$q = Order::with('items.product','user');
if ($request->filled('status')) $q->where('status',$request->status);
return $q->paginate(20);
}


public function show($id) {
return Order::with('items.product','transaction','user')->findOrFail($id);
}


public function updateStatus(Request $request,$id) {
$order = Order::findOrFail($id);
$data = $request->validate(['status'=>'required|in:pending,processing,completed,cancelled']);
$order->update(['status'=>$data['status']]);
return response()->json(['message'=>'Status updated','order'=>$order]);
}


public function uploadProof(Request $request,$id) {
$order = Order::findOrFail($id);
$request->validate(['proof'=>'required']);
// you can implement real file upload - for simplicity store base64 or path
$order->update(['proof_image'=>$request->proof]);
return response()->json(['message'=>'Proof uploaded']);
}
}

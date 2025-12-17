<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index() {
return Product::paginate(20);
}


public function show($id) {
return Product::findOrFail($id);
}


public function store(Request $request) {
$data = $request->validate([
'name'=>'required|string',
'price'=>'required|integer',
'stock'=>'sometimes|integer',
'category'=>'sometimes|string',
'description'=>'sometimes|string',
'image'=>'sometimes|string' // keep it simple: store path
]);


$product = Product::create($data);
return response()->json($product,201);
}


public function update(Request $request,$id) {
$product = Product::findOrFail($id);
$data = $request->validate([
'name'=>'sometimes|string',
'price'=>'sometimes|integer',
'stock'=>'sometimes|integer',
'category'=>'sometimes|string',
'description'=>'sometimes|string',
'image'=>'sometimes|string'
]);
$product->update($data);
return response()->json($product);
}


public function destroy($id) {
$product = Product::findOrFail($id);
$product->delete();
return response()->json(['message'=>'Deleted']);
}
}

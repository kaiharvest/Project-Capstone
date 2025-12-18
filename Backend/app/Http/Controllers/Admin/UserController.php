<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
   {
public function index() {
return User::paginate(20);
}


public function show($id) {
return User::findOrFail($id);
}


public function store(Request $request) {
$data = $request->validate([
'name'=>'required|string',
'email'=>'required|email|unique:users',
'password'=>'required|min:8',
'role'=>'sometimes|string'
]);


$data['password'] = Hash::make($data['password']);
$data['role'] = $data['role'] ?? 'user';
$user = User::create($data);
return response()->json($user,201);
}


public function update(Request $request, $id) {
$user = User::findOrFail($id);
$data = $request->validate([
'name'=>'sometimes|string',
'email'=>'sometimes|email|unique:users,email,'.$user->id,
'password'=>'sometimes|min:8',
'role'=>'sometimes|string'
]);
if(isset($data['password'])) $data['password'] = Hash::make($data['password']);
$user->update($data);
return response()->json($user);
}


public function destroy($id) {
$user = User::findOrFail($id);
$user->delete();
return response()->json(['message'=>'Deleted']);
}
}

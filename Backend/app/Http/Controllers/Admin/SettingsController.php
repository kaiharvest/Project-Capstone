<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show() {
$all = Setting::all()->pluck('value','key')->toArray();
return response()->json($all);
}


public function update(Request $request) {
$data = $request->validate([
'name' => 'sometimes|string',
'address' => 'sometimes|string',
'phone' => 'sometimes|string',
'email' => 'sometimes|email',
]);


foreach ($data as $key => $value) {
Setting::updateOrCreate(['key'=>$key], ['value'=>$value]);
}


return response()->json(['message'=>'Settings updated']);
}
}

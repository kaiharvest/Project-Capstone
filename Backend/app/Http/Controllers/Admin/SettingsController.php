<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

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
'payment_methods' => 'sometimes',
'qris_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
]);


foreach ($data as $key => $value) {
    if ($key === 'payment_methods') {
        $encoded = is_array($value) ? json_encode($value) : $value;
        Setting::updateOrCreate(['key'=>$key], ['value'=>$encoded]);
        continue;
    }
    if ($key === 'qris_image') {
        continue;
    }
    Setting::updateOrCreate(['key'=>$key], ['value'=>$value]);
}

if ($request->hasFile('qris_image')) {
    $file = $request->file('qris_image');
    $fileName = uniqid() . '_' . $file->getClientOriginalName();
    $path = $file->storeAs('payments', $fileName, 'public');
    Setting::updateOrCreate(['key' => 'qris_image_path'], ['value' => $path]);
}

return response()->json(['message'=>'Settings updated']);
}

public function paymentSettingsPublic() {
    $paymentMethodsRaw = Setting::get('payment_methods');
    $paymentMethods = [];
    if ($paymentMethodsRaw) {
        $decoded = json_decode($paymentMethodsRaw, true);
        if (is_array($decoded)) {
            $paymentMethods = $decoded;
        }
    }
    if (empty($paymentMethods)) {
        $paymentMethods = [
            ['value' => 'BRI_66400234', 'label' => 'BRI NO REK. 66400234'],
            ['value' => 'QRIS', 'label' => 'QRIS'],
        ];
    }

    $qrisPath = Setting::get('qris_image_path');
    $qrisUrl = $qrisPath ? asset('storage/' . $qrisPath) : null;

    return response()->json([
        'payment_methods' => $paymentMethods,
        'qris_image_url' => $qrisUrl,
    ]);
}
}

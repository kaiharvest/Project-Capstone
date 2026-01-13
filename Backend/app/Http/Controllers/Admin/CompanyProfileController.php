<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;

class CompanyProfileController extends Controller
{
    public function show()
    {
        $profile = CompanyProfile::first();
        if (!$profile) {
            $profile = CompanyProfile::create([]);
        }

        return response()->json($profile);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'description' => 'sometimes|string',
            'address' => 'sometimes|string',
            'google_maps_link' => 'sometimes|string',
            'phone' => 'sometimes|string',
        ]);

        $profile = CompanyProfile::first();
        if (!$profile) {
            $profile = CompanyProfile::create($data);
        } else {
            $profile->update($data);
        }

        return response()->json($profile);
    }
}

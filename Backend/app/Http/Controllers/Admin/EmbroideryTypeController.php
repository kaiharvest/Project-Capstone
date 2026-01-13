<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmbroideryType;
use Illuminate\Http\Request;

class EmbroideryTypeController extends Controller
{
    public function index()
    {
        return EmbroideryType::orderBy('name')->paginate(20);
    }

    public function show($id)
    {
        return EmbroideryType::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:embroidery_types,name',
            'description' => 'sometimes|string',
        ]);

        $type = EmbroideryType::create($data);

        return response()->json($type, 201);
    }

    public function update(Request $request, $id)
    {
        $type = EmbroideryType::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|unique:embroidery_types,name,' . $type->id,
            'description' => 'sometimes|string',
        ]);

        $type->update($data);

        return response()->json($type);
    }

    public function destroy($id)
    {
        $type = EmbroideryType::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmbroiderySize;
use Illuminate\Http\Request;

class EmbroiderySizeController extends Controller
{
    public function index()
    {
        return EmbroiderySize::orderBy('size_cm')->paginate(20);
    }

    public function show($id)
    {
        return EmbroiderySize::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|unique:embroidery_sizes,label',
            'size_cm' => 'required|numeric|min:0.1',
        ]);

        $size = EmbroiderySize::create($data);

        return response()->json($size, 201);
    }

    public function update(Request $request, $id)
    {
        $size = EmbroiderySize::findOrFail($id);
        $data = $request->validate([
            'label' => 'sometimes|string|unique:embroidery_sizes,label,' . $size->id,
            'size_cm' => 'sometimes|numeric|min:0.1',
        ]);

        $size->update($data);

        return response()->json($size);
    }

    public function destroy($id)
    {
        $size = EmbroiderySize::findOrFail($id);
        $size->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

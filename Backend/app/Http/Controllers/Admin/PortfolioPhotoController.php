<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioPhoto;
use Illuminate\Http\Request;

class PortfolioPhotoController extends Controller
{
    public function index()
    {
        return PortfolioPhoto::orderBy('created_at', 'desc')->paginate(20);
    }

    public function show($id)
    {
        return PortfolioPhoto::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'image_path' => 'required|string',
            'description' => 'sometimes|string',
        ]);

        $photo = PortfolioPhoto::create($data);

        return response()->json($photo, 201);
    }

    public function update(Request $request, $id)
    {
        $photo = PortfolioPhoto::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string',
            'image_path' => 'sometimes|string',
            'description' => 'sometimes|string',
        ]);

        $photo->update($data);

        return response()->json($photo);
    }

    public function destroy($id)
    {
        $photo = PortfolioPhoto::findOrFail($id);
        $photo->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

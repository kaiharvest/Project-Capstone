<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'description' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'image_path' => 'sometimes|string',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('portfolio', $fileName, 'public');
            $data['image_path'] = $path;
        }

        if (empty($data['image_path'])) {
            return response()->json([
                'message' => 'Foto portofolio wajib diunggah.'
            ], 422);
        }

        $photo = PortfolioPhoto::create($data);

        return response()->json($photo, 201);
    }

    public function update(Request $request, $id)
    {
        $photo = PortfolioPhoto::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'image_path' => 'sometimes|string',
        ]);

        if ($request->hasFile('image')) {
            if ($photo->image_path) {
                Storage::disk('public')->delete($photo->image_path);
            }
            $file = $request->file('image');
            $fileName = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('portfolio', $fileName, 'public');
            $data['image_path'] = $path;
        }

        $photo->update($data);

        return response()->json($photo);
    }

    public function destroy($id)
    {
        $photo = PortfolioPhoto::findOrFail($id);
        if ($photo->image_path) {
            Storage::disk('public')->delete($photo->image_path);
        }
        $photo->delete();

        return response()->json(['message' => 'Deleted']);
    }
}

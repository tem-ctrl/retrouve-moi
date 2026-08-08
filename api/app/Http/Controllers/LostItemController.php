<?php

namespace App\Http\Controllers;

use App\Http\Requests\LostItemRequest;
use App\Http\Resources\LostItemResource;
use App\Models\LostItem;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LostItemController extends Controller
{
    public function __construct(private FileUploadService $fileUploadService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = LostItem::with('user');

        if ($request->filled('region')) {
            $query->where('region', $request->region);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        if ($request->filled('item_type')) {
            $query->where('item_type', $request->item_type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $limit = $request->integer('limit', 15);
        $offset = $request->integer('offset', 0);

        return LostItemResource::collection($query->offset($offset)->limit($limit)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LostItemRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $validated['photo_url'] = $this->fileUploadService->storeLostItemImage($request->file('photo'));
        }

        return LostItemResource::make(LostItem::create($validated));
    }

    /**
     * Get the specified resource.
     */
    public function get(int $lost_item_id): Response
    {
        $lostItem = LostItem::findOrFail($lost_item_id);
        $lostItem->load('user');

        return response(['data' => LostItemResource::make($lostItem)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LostItemRequest $request, int $lost_item_id)
    {
        $lostItem = LostItem::findOrFail($lost_item_id);
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $this->fileUploadService->deleteImage($lostItem->photo_url);
            $validated['photo_url'] = $this->fileUploadService->storeLostItemImage($request->file('photo'));
        }

        $lostItem->update($validated);

        return response(['data' => LostItemResource::make($lostItem)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $lost_item_id)
    {
        $lostItem = LostItem::findOrFail($lost_item_id);
        $lostItem->delete();

        return response(status: 204);
    }
}

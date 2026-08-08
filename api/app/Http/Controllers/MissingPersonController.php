<?php

namespace App\Http\Controllers;

use App\Http\Requests\MissingPersonRequest;
use App\Http\Resources\MissingPersonResource;
use App\Models\MissingPerson;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MissingPersonController extends Controller
{
    public function __construct(private FileUploadService $fileUploadService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = MissingPerson::with('user');

        if ($request->filled('region')) {
            $query->where('region', $request->region);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('last_seen_location', 'like', "%{$search}%");
            });
        }

        $limit = $request->integer('limit', 15);
        $offset = $request->integer('offset', 0);

        return MissingPersonResource::collection($query->offset($offset)->limit($limit)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MissingPersonRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $validated['photo_url'] = $this->fileUploadService->storeMissingPersonImage($request->file('photo'));
        }

        return MissingPersonResource::make(MissingPerson::create($validated));
    }

    /**
     * Get the specified resource.
     */
    public function get(int $missing_person_id): Response
    {
        $missingPerson = MissingPerson::findOrFail($missing_person_id);
        $missingPerson->load('user', 'sightings');

        return response(['data' => MissingPersonResource::make($missingPerson)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MissingPersonRequest $request, int $missing_person_id)
    {
        $missingPerson = MissingPerson::findOrFail($missing_person_id);
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $this->fileUploadService->deleteImage($missingPerson->photo_url);
            $validated['photo_url'] = $this->fileUploadService->storeMissingPersonImage($request->file('photo'));
        }

        $missingPerson->update($validated);

        return response(['data' => MissingPersonResource::make($missingPerson)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $missing_person_id)
    {
        $missingPerson = MissingPerson::findOrFail($missing_person_id);
        $this->fileUploadService->deleteImage($missingPerson->photo_url);
        $missingPerson->delete();

        return response(status: 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\SightingRequest;
use App\Models\Sighting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SightingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sighting::with('missingPerson', 'user');

        if ($request->filled('missingPersonId')) {
            $query->where('missing_person_id', $request->missingPersonId);
        }

        $limit = $request->integer('limit', 15);
        $offset = $request->integer('offset', 0);

        return $query->offset($offset)->limit($limit)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SightingRequest $request)
    {
        return Sighting::create($request->validated());
    }

    /**
     * Get the specified resource.
     */
    public function get(int $sighting_id): Response
    {
        $sighting = Sighting::findOrFail($sighting_id);
        $sighting->load('missingPerson', 'user');

        return response(['data' => $sighting]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SightingRequest $request, int $sighting_id)
    {
        $sighting = Sighting::findOrFail($sighting_id);
        $sighting->update($request->validated());

        return response(['data' => $sighting]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $sighting_id)
    {
        $sighting = Sighting::findOrFail($sighting_id);
        $sighting->delete();

        return response(status: 204);
    }
}

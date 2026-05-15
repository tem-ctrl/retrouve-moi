<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(private FileUploadService $fileUploadService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('email')) {
            $query->where('email', $request->email);
        }

        $limit = $request->integer('limit', 15);
        $offset = $request->integer('offset', 0);

        return UserResource::collection($query->offset($offset)->limit($limit)->get());
    }

    /**
     * Get the specified resource.
     */
    public function get(int $user_id): Response
    {
        $user = User::findOrFail($user_id);

        return response(['data' => UserResource::make($user)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, int $user_id)
    {
        $user = User::findOrFail($user_id);
        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            $this->fileUploadService->deleteImage($user->avatar_url);
            $validated['avatar_url'] = $this->fileUploadService->storeUserAvatar($request->file('avatar'));
        }

        $user->update($validated);

        return response(['data' => UserResource::make($user)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $user_id)
    {
        $user = User::findOrFail($user_id);
        $this->fileUploadService->deleteImage($user->avatar_url);
        $user->delete();

        return response(status: 204);
    }
}

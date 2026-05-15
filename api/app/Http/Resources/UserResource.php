<?php

namespace App\Http\Resources;

use App\Services\ImageUrlService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        if (isset($data['avatar_url']) && $data['avatar_url']) {
            $avatarService = app(ImageUrlService::class);
            $data['avatar_url'] = $avatarService->buildImageUrl($data['avatar_url']);
        }

        return $data;
    }
}

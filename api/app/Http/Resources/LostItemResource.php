<?php

namespace App\Http\Resources;

use App\Services\ImageUrlService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LostItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        if (isset($data['photo_url']) && $data['photo_url']) {
            $imageService = app(ImageUrlService::class);
            $data['photo_url'] = $imageService->buildImageUrl($data['photo_url']);
        }

        return $data;
    }
}

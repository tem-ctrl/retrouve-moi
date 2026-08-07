<?php

namespace App\Services;

use Illuminate\Support\Facades\URL;

class ImageUrlService
{
    /**
     * Build the full avatar URL from a relative path
     */
    public function buildImageUrl(?string $imagePath): ?string
    {
        if (! $imagePath) {
            return null;
        }

        $isSecure = config('app.env') === 'production';

        return URL::to($imagePath, [], $isSecure);
    }
}

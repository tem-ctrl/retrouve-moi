<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class FileUploadService
{
    /**
     * Store a lost item image and return the file path
     */
    public function storeLostItemImage(UploadedFile $file): string
    {
        return $this->storeImage($file, 'li');
    }

    /**
     * Store a user avatar and return the file path
     */
    public function storeUserAvatar(UploadedFile $file): string
    {
        return $this->storeImage($file, 'u');
    }

    /**
     * Store a missing person avatar and return the file path
     */
    public function storeMissingPersonImage(UploadedFile $file): string
    {
        return $this->storeImage($file, 'mp');
    }

    /**
     * Store a sighting image and return the file path
     */
    public function storeSightingImage(UploadedFile $file): string
    {
        return $this->storeImage($file, 's');
    }

    /**
     * Delete an image file by its relative path
     */
    public function deleteImage(?string $imagePath): void
    {
        if (! $imagePath) {
            return;
        }

        $fullPath = public_path($imagePath);

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    /**
     * Store an image with sequential numeric naming
     *
     * @param  string  $directory  Directory name under public/uploads/ (e.g., 'li', 'u', 'mp', 's')
     * @return string File path relative to public folder
     */
    private function storeImage(UploadedFile $file, string $directory): string
    {
        $uploadPath = public_path("uploads/{$directory}");

        // Create directory if it doesn't exist
        if (! is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        // Get the next sequential number
        $nextIndex = $this->getNextIndex($uploadPath);

        // Generate filename with extension
        $extension = $file->getClientOriginalExtension();
        $filename = "{$nextIndex}.{$extension}";

        // Store the file
        $file->move($uploadPath, $filename);

        // Return relative path (without public root URL)
        return "uploads/{$directory}/{$filename}";
    }

    /**
     * Get the next sequential index for files in a directory
     *
     * @param  string  $directory  Full path to directory
     * @return int Next index
     */
    private function getNextIndex(string $directory): int
    {
        $files = glob("{$directory}/*.{jpg,jpeg,png,gif,webp}", GLOB_BRACE);

        if (empty($files)) {
            return 1;
        }

        $maxIndex = 0;
        foreach ($files as $file) {
            // Extract number from filename (e.g., "5.jpg" -> 5)
            if (preg_match('/(\d+)\./', basename($file), $matches)) {
                $index = (int) $matches[1];
                $maxIndex = max($maxIndex, $index);
            }
        }

        return $maxIndex + 1;
    }
}

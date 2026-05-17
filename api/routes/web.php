<?php

use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/uploads/{directory}/{filename}', function (string $directory, string $filename): BinaryFileResponse {
    $filename = basename($filename);
    $path = public_path("uploads/{$directory}/{$filename}");

    if (! is_file($path)) {
        abort(404);
    }

    return response()->file($path);
})->where('filename', '[^/]+');

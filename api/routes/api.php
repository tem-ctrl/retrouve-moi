<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LostItemController;
use App\Http\Controllers\MissingPersonController;
use App\Http\Controllers\SightingController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/signin', [AuthController::class, 'signin']);
    Route::post('/signin-phone', [AuthController::class, 'signInWithPhone']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Auth required routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/signout', [AuthController::class, 'signout']);
});

// Users routes
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user_id}', [UserController::class, 'get']);
Route::put('/users/{user_id}', [UserController::class, 'update']);
Route::patch('/users/{user_id}', [UserController::class, 'update']);
Route::delete('/users/{user_id}', [UserController::class, 'destroy']);

// Missing Persons routes
Route::get('/missing-persons', [MissingPersonController::class, 'index']);
Route::post('/missing-persons', [MissingPersonController::class, 'store']);
Route::get('/missing-persons/{missing_person_id}', [MissingPersonController::class, 'get']);
Route::put('/missing-persons/{missing_person_id}', [MissingPersonController::class, 'update']);
Route::patch('/missing-persons/{missing_person_id}', [MissingPersonController::class, 'update']);
Route::delete('/missing-persons/{missing_person_id}', [MissingPersonController::class, 'destroy']);

// Lost Items routes
Route::get('/lost-items', [LostItemController::class, 'index']);
Route::post('/lost-items', [LostItemController::class, 'store']);
Route::get('/lost-items/{lost_item_id}', [LostItemController::class, 'get']);
Route::put('/lost-items/{lost_item_id}', [LostItemController::class, 'update']);
Route::patch('/lost-items/{lost_item_id}', [LostItemController::class, 'update']);
Route::delete('/lost-items/{lost_item_id}', [LostItemController::class, 'destroy']);

// Sightings routes
Route::get('/sightings', [SightingController::class, 'index']);
Route::post('/sightings', [SightingController::class, 'store']);
Route::get('/sightings/{sighting_id}', [SightingController::class, 'get']);
Route::put('/sightings/{sighting_id}', [SightingController::class, 'update']);
Route::patch('/sightings/{sighting_id}', [SightingController::class, 'update']);
Route::delete('/sightings/{sighting_id}', [SightingController::class, 'destroy']);

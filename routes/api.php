<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // User management routes
    Route::apiResource('users', UserController::class);
});

// Demo/Mock routes (remove these in production)
Route::get('/demo/users', function (Request $request) {
    return response()->json([
        [
            'id' => 1,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'Admin',
        ],
        [
            'id' => 2,
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'role' => 'User',
        ],
        [
            'id' => 3,
            'name' => 'Bob Johnson',
            'email' => 'bob@example.com',
            'role' => 'Moderator',
        ],
    ]);
});

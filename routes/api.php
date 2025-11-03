<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\RuleController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes (using Passport)
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User Management routes
    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);

    // Group Management routes
    Route::apiResource('groups', GroupController::class);
    Route::post('groups/{group}/toggle-status', [GroupController::class, 'toggleStatus']);

    // Rule Management routes
    Route::apiResource('rules', RuleController::class);
});

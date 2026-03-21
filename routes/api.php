<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PurchaseController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'info']);
    Route::get('/purchases', [PurchaseController::class, 'list']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
});

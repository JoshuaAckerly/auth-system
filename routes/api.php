<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\SiteVisitController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/site-visits', [SiteVisitController::class, 'store']);

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'info']);
    Route::get('/purchases', [PurchaseController::class, 'list']);
    Route::post('/purchases', [PurchaseController::class, 'store']);

    Route::get('/messages', [MessageController::class, 'index']);
    Route::patch('/messages/read-all', [MessageController::class, 'markAllRead']);
    Route::patch('/messages/{id}/read', [MessageController::class, 'markRead']);
});

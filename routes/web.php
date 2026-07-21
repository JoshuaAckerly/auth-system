<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\Admin\AdminMessageController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\SocialScheduleController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/messages', [AdminMessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/create', [AdminMessageController::class, 'create'])->name('messages.create');
    Route::post('/messages', [AdminMessageController::class, 'store'])->name('messages.store');
    Route::get('/messages/{message}', [AdminMessageController::class, 'show'])->name('messages.show');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    Route::get('/social-schedule', [SocialScheduleController::class, 'index'])->name('social-schedule.index');

    Route::get('/seo', [SeoController::class, 'index'])->name('seo.index');
    Route::get('/seo/{pageKey}/edit', [SeoController::class, 'edit'])->name('seo.edit');
    Route::put('/seo/{pageKey}', [SeoController::class, 'update'])->name('seo.update');
    Route::get('/seo/{pageKey}/gsc', [SeoController::class, 'gscData'])->name('seo.gsc');
});

require __DIR__.'/auth.php';

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user()->load('purchases');
        $purchases = $user->purchases->toArray();
        \Log::info('DashboardController user', ['id' => $user->id, 'email' => $user->email]);
        \Log::info('DashboardController purchases', $purchases);
        return Inertia::render('Dashboard', [
            'purchases' => $purchases,
        ]);
    }
}

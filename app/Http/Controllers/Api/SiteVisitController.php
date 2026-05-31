<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\LookupVisitLocation;
use App\Models\SiteVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteVisitController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $token = config('app.track_visit_token');

        if (! $token || $request->bearerToken() !== $token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'host' => ['required', 'string', 'max:255'],
            'path' => ['required', 'string', 'max:1000'],
            'ip_address' => ['nullable', 'string', 'max:45'],
            'user_agent' => ['nullable', 'string'],
            'referer' => ['nullable', 'string', 'max:1000'],
        ]);

        $visit = SiteVisit::create([
            'host' => $data['host'],
            'path' => $data['path'],
            'ip_address' => $data['ip_address'] ?? null,
            'user_agent' => $data['user_agent'] ?? null,
            'referer' => $data['referer'] ?? null,
            'created_at' => now(),
        ]);

        if (! empty($data['ip_address'])) {
            LookupVisitLocation::dispatch($visit->id, $data['ip_address']);
        }

        return response()->json(['ok' => true]);
    }
}

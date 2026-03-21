<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $throttleKey = Str::lower($validated['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $retryAfter = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'error' => 'Too many login attempts. Please try again later.',
                'retry_after' => $retryAfter,
            ], 429);
        }

        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            RateLimiter::hit($throttleKey, 60);

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        RateLimiter::clear($throttleKey);

        $expiration = config('sanctum.expiration');
        $expiresAt = is_numeric($expiration) ? now()->addMinutes((int) $expiration) : null;
        $tokenName = $validated['device_name'] ?? 'api-token';
        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt?->toIso8601String(),
        ]);
    }
}

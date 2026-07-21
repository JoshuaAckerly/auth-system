<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class SocialScheduleController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim((string) config('services.graveyardjokes.base_url'), '/');
        $secret = (string) config('services.graveyardjokes.social_schedule_secret');

        if ($secret === '') {
            return Inertia::render('Admin/SocialSchedule/Index', [
                'posts' => [],
                'stats' => $this->emptyStats(),
                'apiError' => 'SOCIAL_SCHEDULE_SECRET is not configured for auth-system.',
                'sourceUrl' => $baseUrl,
            ]);
        }

        try {
            $response = Http::timeout(15)
                ->acceptJson()
                ->withToken($secret)
                ->get($baseUrl.'/api/social/schedule');
        } catch (\Throwable $e) {
            return Inertia::render('Admin/SocialSchedule/Index', [
                'posts' => [],
                'stats' => $this->emptyStats(),
                'apiError' => 'Unable to reach Graveyard Jokes social schedule API: '.$e->getMessage(),
                'sourceUrl' => $baseUrl,
            ]);
        }

        if (! $response->successful()) {
            return Inertia::render('Admin/SocialSchedule/Index', [
                'posts' => [],
                'stats' => $this->emptyStats(),
                'apiError' => "Graveyard Jokes social schedule API returned HTTP {$response->status()}.",
                'sourceUrl' => $baseUrl,
            ]);
        }

        $posts = collect($response->json('data', []))
            ->map(fn (array $post): array => [
                'id' => $post['id'] ?? null,
                'platform' => $post['platform'] ?? 'unknown',
                'content' => $post['content'] ?? '',
                'media_url' => $post['media_url'] ?? null,
                'scheduled_at' => $post['scheduled_at'] ?? null,
                'posted_at' => $post['posted_at'] ?? null,
                'status' => $post['status'] ?? 'unknown',
                'error_message' => $post['error_message'] ?? null,
                'is_overdue' => ($post['status'] ?? null) === 'pending'
                    && ! empty($post['scheduled_at'])
                    && now()->greaterThanOrEqualTo($post['scheduled_at']),
            ])
            ->sortBy('scheduled_at')
            ->values();

        return Inertia::render('Admin/SocialSchedule/Index', [
            'posts' => $posts,
            'stats' => $this->stats($posts),
            'apiError' => null,
            'sourceUrl' => $baseUrl,
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function emptyStats(): array
    {
        return [
            'total' => 0,
            'pending' => 0,
            'posted' => 0,
            'failed' => 0,
            'processing' => 0,
            'cancelled' => 0,
            'overdue_pending' => 0,
        ];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, array<string, mixed>>  $posts
     * @return array<string, int>
     */
    private function stats($posts): array
    {
        $counts = $posts->countBy('status');

        return [
            'total' => $posts->count(),
            'pending' => (int) ($counts['pending'] ?? 0),
            'posted' => (int) ($counts['posted'] ?? 0),
            'failed' => (int) ($counts['failed'] ?? 0),
            'processing' => (int) ($counts['processing'] ?? 0),
            'cancelled' => (int) ($counts['cancelled'] ?? 0),
            'overdue_pending' => $posts->where('is_overdue', true)->count(),
        ];
    }
}
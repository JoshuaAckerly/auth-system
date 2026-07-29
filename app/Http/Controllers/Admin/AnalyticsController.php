<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteVisit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sevenDaysAgo = $now->copy()->subDays(7);

        $totalVisits = SiteVisit::human()->count();
        $visitsLast30Days = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)->count();
        $visitsLast7Days = SiteVisit::human()->where('created_at', '>=', $sevenDaysAgo)->count();
        $uniqueIpsLast30 = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('ip_address')
            ->count('ip_address');
        $loggedInLast30 = SiteVisit::human()->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('user_id')
            ->count();

        // Daily visits for the last 14 days
        $dailyVisits = SiteVisit::human()->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', $now->copy()->subDays(13)->startOfDay())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Fill in zeros for days with no visits
        $dailyChart = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->toDateString();
            $dailyChart[] = [
                'date' => $date,
                'count' => $dailyVisits->has($date) ? (int) $dailyVisits[$date]->count : 0,
            ];
        }

        // Top 10 pages last 30 days
        $topPages = SiteVisit::human()->select('path', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Top 10 cities last 30 days
        $topCities = SiteVisit::human()->select(
            'city',
            'country',
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('city')
            ->groupBy('city', 'country')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Visits per site/host last 30 days
        $visitsByHost = SiteVisit::human()->select('host', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('host')
            ->orderByDesc('count')
            ->get();

        // Recent 50 visits with optional user info
        $recentVisits = SiteVisit::human()->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'user_name' => $v->user?->name,
                'user_email' => $v->user?->email,
                'host' => $v->host,
                'ip_address' => $v->ip_address,
                'city' => $v->city,
                'region' => $v->region,
                'country' => $v->country,
                'path' => $v->path,
                'browser' => $v->browser,
                'referer' => $v->referer,
                'visited_at' => $v->created_at->toIso8601String(),
            ]);

        // Visits grouped by IP (last 30 days), ordered by visit count descending
        $visitsByIp = SiteVisit::human()->select(
            'ip_address',
            DB::raw('COUNT(*) as count'),
            DB::raw('MAX(created_at) as last_seen'),
            DB::raw('MIN(created_at) as first_seen'),
            DB::raw('MAX(city) as city'),
            DB::raw('MAX(region) as region'),
            DB::raw('MAX(country) as country')
        )
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('ip_address')
            ->groupBy('ip_address')
            ->orderByDesc('count')
            ->limit(100)
            ->get()
            ->map(fn ($row) => [
                'ip_address' => $row->ip_address,
                'count' => (int) $row->count,
                'last_seen' => $row->last_seen,
                'first_seen' => $row->first_seen,
                'city' => $row->city,
                'region' => $row->region,
                'country' => $row->country,
            ]);

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => [
                'totalVisits' => $totalVisits,
                'visitsLast30Days' => $visitsLast30Days,
                'visitsLast7Days' => $visitsLast7Days,
                'uniqueIpsLast30' => $uniqueIpsLast30,
                'loggedInLast30' => $loggedInLast30,
            ],
            'dailyChart' => $dailyChart,
            'topPages' => $topPages,
            'topCities' => $topCities,
            'visitsByHost' => $visitsByHost,
            'recentVisits' => $recentVisits,
            'visitsByIp' => $visitsByIp,
        ]);
    }
}

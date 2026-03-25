<?php

namespace App\Http\Middleware;

use App\Jobs\LookupVisitLocation;
use App\Models\SiteVisit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackSiteVisit
{
    private const SKIP_PREFIXES = [
        '/_',
        '/livewire',
        '/telescope',
        '/horizon',
        '/sanctum',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($request)) {
            $ip = $request->ip();
            $visit = SiteVisit::create([
                'user_id'    => $request->user()?->id,
                'host'       => $request->getHost(),
                'ip_address' => $ip,
                'user_agent' => $request->userAgent(),
                'path'       => '/' . ltrim($request->path(), '/'),
                'referer'    => $request->headers->get('referer'),
                'created_at' => now(),
            ]);

            LookupVisitLocation::dispatch($visit->id, $ip);
        }

        return $response;
    }

    private function shouldTrack(Request $request): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        $path = '/' . ltrim($request->path(), '/');

        foreach (self::SKIP_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return false;
            }
        }

        return true;
    }
}

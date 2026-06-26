<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSeo;
use App\Services\GoogleSearchConsoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function index(): Response
    {
        $grouped = PageSeo::orderBy('project')
            ->orderBy('page_label')
            ->get()
            ->groupBy('project')
            ->map(fn ($pages) => $pages->values())
            ->toArray();

        return Inertia::render('Admin/Seo/Index', [
            'grouped' => $grouped,
        ]);
    }

    public function edit(string $pageKey): Response
    {
        $page = PageSeo::where('page_key', $pageKey)->firstOrFail();

        return Inertia::render('Admin/Seo/Edit', [
            'page' => $page,
            'gscConfigured' => $this->gscConfigured(),
        ]);
    }

    public function update(Request $request, string $pageKey): RedirectResponse
    {
        $page = PageSeo::where('page_key', $pageKey)->firstOrFail();

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'robots' => ['required', 'string', Rule::in(['index,follow', 'index,nofollow', 'noindex,follow', 'noindex,nofollow'])],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'url', 'max:500'],
            'og_type' => ['nullable', 'string', 'max:50'],
            'twitter_card' => ['nullable', 'string', 'in:summary,summary_large_image'],
            'twitter_title' => ['nullable', 'string', 'max:255'],
            'twitter_description' => ['nullable', 'string', 'max:500'],
            'twitter_image' => ['nullable', 'url', 'max:500'],
            'schema_json' => ['nullable', 'string'],
            'sitemap_priority' => ['required', 'numeric', 'min:0', 'max:1'],
            'sitemap_change_freq' => ['required', 'string', 'in:always,hourly,daily,weekly,monthly,yearly,never'],
        ]);

        // Decode schema_json string → array (the field arrives as a JSON string from the textarea)
        if (isset($validated['schema_json']) && is_string($validated['schema_json'])) {
            $decoded = json_decode($validated['schema_json'], true);
            $validated['schema_json'] = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        $page->update($validated);

        return redirect()->route('admin.seo.edit', $pageKey)
            ->with('success', 'SEO settings saved.');
    }

    public function gscData(string $pageKey): JsonResponse
    {
        $page = PageSeo::where('page_key', $pageKey)->firstOrFail();

        if (! $this->gscConfigured()) {
            return response()->json(['error' => 'Google Search Console is not configured.'], 503);
        }

        $service = new GoogleSearchConsoleService;
        $data = $service->getPagePerformance($page->page_url);

        return response()->json($data);
    }

    private function gscConfigured(): bool
    {
        return ! empty(config('services.google_search_console.refresh_token'))
            && ! empty(config('services.google_search_console.site_url'));
    }
}

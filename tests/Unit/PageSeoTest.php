<?php

namespace Tests\Unit;

use App\Models\PageSeo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageSeoTest extends TestCase
{
    use RefreshDatabase;

    private function make(array $attrs = []): PageSeo
    {
        return PageSeo::create(array_merge([
            'page_key'            => 'test.page',
            'page_label'          => 'Test Page',
            'page_url'            => '/test',
            'robots'              => 'index,follow',
            'sitemap_priority'    => 0.50,
            'sitemap_change_freq' => 'monthly',
        ], $attrs));
    }

    public function test_is_noindex_returns_false_for_index_follow(): void
    {
        $page = $this->make(['robots' => 'index,follow']);
        $this->assertFalse($page->isNoindex());
    }

    public function test_is_noindex_returns_true_for_noindex_follow(): void
    {
        $page = $this->make(['robots' => 'noindex,follow']);
        $this->assertTrue($page->isNoindex());
    }

    public function test_is_noindex_returns_true_for_noindex_nofollow(): void
    {
        $page = $this->make(['robots' => 'noindex,nofollow']);
        $this->assertTrue($page->isNoindex());
    }

    public function test_schema_json_casts_to_array(): void
    {
        $schema = ['@context' => 'https://schema.org', '@type' => 'WebPage'];
        $page = $this->make(['schema_json' => $schema]);
        $page->refresh();

        $this->assertIsArray($page->schema_json);
        $this->assertSame('https://schema.org', $page->schema_json['@context']);
    }

    public function test_schema_json_null_when_not_set(): void
    {
        $page = $this->make(['schema_json' => null]);
        $this->assertNull($page->schema_json);
    }

    public function test_for_path_finds_page_by_url(): void
    {
        $this->make(['page_url' => '/login']);
        $result = PageSeo::forPath('login');

        $this->assertNotNull($result);
        $this->assertSame('/login', $result->page_url);
    }

    public function test_for_path_normalises_leading_slash(): void
    {
        $this->make(['page_url' => '/dashboard']);

        $this->assertNotNull(PageSeo::forPath('dashboard'));
        $this->assertNotNull(PageSeo::forPath('/dashboard'));
    }

    public function test_for_path_returns_null_for_unknown_path(): void
    {
        $this->assertNull(PageSeo::forPath('/does-not-exist'));
    }

    public function test_sitemap_priority_casts_to_float(): void
    {
        $page = $this->make(['sitemap_priority' => 0.80]);
        $page->refresh();

        $this->assertIsFloat($page->sitemap_priority);
        $this->assertEqualsWithDelta(0.80, $page->sitemap_priority, 0.001);
    }
}

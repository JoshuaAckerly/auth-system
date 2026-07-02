<?php

namespace Tests\Feature\Admin;

use App\Models\PageSeo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoControllerTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $user = User::factory()->create(['email' => 'admin@example.com']);
        Config::set('app.admin_email', 'admin@example.com');

        return $user;
    }

    private function regularUser(): User
    {
        return User::factory()->create(['email' => 'user@example.com']);
    }

    private function makePage(array $attrs = []): PageSeo
    {
        return PageSeo::create(array_merge([
            'page_key' => 'login',
            'page_label' => 'Login',
            'page_url' => '/login',
            'title' => 'Login Title',
            'meta_description' => 'Login description',
            'robots' => 'noindex,nofollow',
            'sitemap_priority' => 0.30,
            'sitemap_change_freq' => 'monthly',
        ], $attrs));
    }

    // ── Authentication ────────────────────────────────────────────────────────

    public function test_unauthenticated_index_redirects_to_login(): void
    {
        $this->get('/admin/seo')->assertRedirect('/login');
    }

    public function test_unauthenticated_edit_redirects_to_login(): void
    {
        $this->makePage();
        $this->get('/admin/seo/login/edit')->assertRedirect('/login');
    }

    public function test_unauthenticated_update_redirects_to_login(): void
    {
        $this->makePage();
        $this->put('/admin/seo/login', [])->assertRedirect('/login');
    }

    public function test_non_admin_gets_403_on_index(): void
    {
        $this->actingAs($this->regularUser())
            ->get('/admin/seo')
            ->assertForbidden();
    }

    public function test_non_admin_gets_403_on_edit(): void
    {
        $this->makePage();

        $this->actingAs($this->regularUser())
            ->get('/admin/seo/login/edit')
            ->assertForbidden();
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_index_returns_200_for_admin(): void
    {
        $this->makePage();

        $this->actingAs($this->adminUser())
            ->get('/admin/seo')
            ->assertOk();
    }

    public function test_index_passes_pages_to_view(): void
    {
        $this->makePage();
        $this->makePage(['page_key' => 'dashboard', 'page_label' => 'Dashboard', 'page_url' => '/dashboard']);

        $response = $this->actingAs($this->adminUser())->get('/admin/seo');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Seo/Index')
            ->has('grouped')
        );
    }

    // ── Edit ──────────────────────────────────────────────────────────────────

    public function test_edit_returns_200_for_valid_page_key(): void
    {
        $this->makePage();

        $this->actingAs($this->adminUser())
            ->get('/admin/seo/login/edit')
            ->assertOk();
    }

    public function test_edit_returns_404_for_unknown_page_key(): void
    {
        $this->actingAs($this->adminUser())
            ->get('/admin/seo/nonexistent/edit')
            ->assertNotFound();
    }

    public function test_edit_passes_page_and_gsc_flag_to_view(): void
    {
        $this->makePage();

        $this->actingAs($this->adminUser())
            ->get('/admin/seo/login/edit')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Seo/Edit')
                ->has('page')
                ->has('gscConfigured')
            );
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_update_saves_fields_and_redirects(): void
    {
        $this->makePage();

        $this->actingAs($this->adminUser())
            ->put('/admin/seo/login', [
                'title' => 'New Login Title',
                'meta_description' => 'New description',
                'canonical_url' => null,
                'robots' => 'noindex,nofollow',
                'og_title' => null,
                'og_description' => null,
                'og_image' => null,
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'twitter_title' => null,
                'twitter_description' => null,
                'twitter_image' => null,
                'schema_json' => null,
                'sitemap_priority' => 0.3,
                'sitemap_change_freq' => 'monthly',
            ])
            ->assertRedirect('/admin/seo/login/edit')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('page_seos', [
            'page_key' => 'login',
            'title' => 'New Login Title',
        ]);
    }

    public function test_update_rejects_invalid_robots_value(): void
    {
        $this->makePage();

        $this->actingAs($this->adminUser())
            ->put('/admin/seo/login', [
                'robots' => 'all',
                'sitemap_priority' => 0.5,
                'sitemap_change_freq' => 'monthly',
            ])
            ->assertSessionHasErrors('robots');
    }

    public function test_update_decodes_schema_json_string(): void
    {
        $this->makePage();

        $schema = json_encode(['@context' => 'https://schema.org', '@type' => 'WebPage']);

        $this->actingAs($this->adminUser())
            ->put('/admin/seo/login', [
                'title' => 'Title',
                'robots' => 'noindex,nofollow',
                'schema_json' => $schema,
                'sitemap_priority' => 0.3,
                'sitemap_change_freq' => 'monthly',
            ]);

        $page = PageSeo::where('page_key', 'login')->first();
        $this->assertIsArray($page->schema_json);
        $this->assertSame('https://schema.org', $page->schema_json['@context']);
    }

    public function test_update_returns_404_for_unknown_page_key(): void
    {
        $this->actingAs($this->adminUser())
            ->put('/admin/seo/nonexistent', ['robots' => 'index,follow', 'sitemap_priority' => 0.5, 'sitemap_change_freq' => 'monthly'])
            ->assertNotFound();
    }
}

# auth-system

## Purpose
Centralized SSO authentication service for all Graveyard Jokes Studios applications. Issues Sanctum Bearer tokens. All other projects in this workspace call this API to authenticate users — **do not duplicate auth logic in other projects**.

## Tech Stack
- **Backend**: Laravel 12, PHP 8.2+, Laravel Sanctum (Bearer tokens)
- **Frontend**: React 18 (minimal admin UI), Vite
- **Testing**: PHPUnit 11 (`php artisan test`)
- **Storage**: MySQL, database cache, database queue

## Architecture — API Only

This app exposes a JSON API. There are no Inertia page routes.

### Controllers (`app/Http/Controllers/`)
- `Api/AuthController` — `POST /api/login` (throttled 10/min), issues Sanctum tokens
- `Api/UserController` — `GET /api/user` — returns authenticated user info
- `Api/PurchaseController` — `GET /api/purchases`, `POST /api/purchases`
- `Api/MessageController` — `GET /api/messages`, `PATCH /api/messages/read-all`, `PATCH /api/messages/{id}/read`
- `Api/SiteVisitController` — `POST /api/site-visits` (public, records cross-app visit)
- `Admin/SeoController` — `GET /admin/seo`, `GET|PUT /admin/seo/{pageKey}`, `GET /admin/seo/{pageKey}/gsc` — admin SEO management
- `Admin/` — admin panel controllers
- `Auth/` — password/email Breeze-style auth controllers
- `DashboardController`, `ProfileController` — internal admin dashboard

### Models (`app/Models/`)
- `User` — shared user model across all apps; includes purchases and messages
- `AdminMessage`, `AdminMessageRead` — admin messaging system
- `Purchase` — purchase records
- `SiteVisit` — cross-app visitor analytics
- `PageSeo` — per-page SEO metadata (title, description, OG) managed via admin panel

### Routes (`routes/api.php`)
```
POST   /api/site-visits              (public)
POST   /api/login                    (throttle:10,1)
GET    /api/user                     (auth:sanctum)
GET    /api/purchases                (auth:sanctum)
POST   /api/purchases                (auth:sanctum)
GET    /api/messages                 (auth:sanctum)
PATCH  /api/messages/read-all        (auth:sanctum)
PATCH  /api/messages/{id}/read       (auth:sanctum)
```

## How Other Projects Use This
Other projects call this service via `AuthSystemService` (graveyardjokes) or similar proxy controllers. The `auth-system` middleware in consumer apps validates Sanctum tokens by calling this API. Never have consumers issue or validate tokens themselves.

## Build & Test
```bash
php artisan test
npm run build
./vendor/bin/pint
```

## Notable Files
- `API_DOCUMENTATION.md` — full API reference
- `deploy-production.sh` — production deployment script

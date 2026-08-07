# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

"Retrouve-moi" (report-missing) is a platform for reporting and tracking missing persons and lost/found items. It's a monorepo with two independently deployed apps plus deployment infra:

- `api/` — Laravel 13 (PHP 8.4) REST API. See `api/CLAUDE.md` for Laravel-specific guidance (Boost tool usage, Pint, PHPUnit conventions) — those rules apply whenever you're working inside `api/`.
- `ui/` — Next.js 16 (App Router, React 19) frontend. Currently a single-page app: almost all UI state and composition lives in `ui/app/page.tsx`, which renders sections/modals from `ui/components/`.
- `traefik/` — reverse proxy config (routing, TLS) for production.
- `docker-compose.yml` — production orchestration (traefik, ui, nginx, php-fpm, scheduler, redis, mysql).
- `.github/workflows/docker-build-push.yml` — builds and pushes three GHCR images (`-nextjs`, `-php-fpm`, `-nginx`) on push to `main`.

The UI and API are separate deployables that only communicate over HTTP — there is no shared package or generated client. When changing an API response shape, you must manually update the corresponding TypeScript types/usages in `ui/`.

## Commands

### API (`api/`)
- Install: `composer install`
- Dev server (serve + queue listener + logs + vite, all concurrently): `composer run dev`
- Run all tests: `php artisan test --compact` (or `composer test`)
- Run a single test file: `php artisan test --compact tests/Feature/AuthTest.php`
- Filter by test name: `php artisan test --compact --filter=testName`
- Format PHP after edits (required before finishing a change): `vendor/bin/pint --dirty --format agent`
- Routes: `php artisan route:list`
- Migrate: `php artisan migrate`

### UI (`ui/`)
- Install: `yarn install` (Dockerfile uses yarn; a `yarn.lock` is committed — prefer yarn over npm)
- Dev server: `yarn dev` (or `npm run dev`)
- Build: `yarn build`
- Lint: `yarn lint` (ESLint flat config, `eslint-config-next` core-web-vitals + typescript)
- No test runner is currently configured for `ui/`.

## Architecture

### API (Laravel)
- Stateless REST API under `/api` (Sanctum token auth — see `routes/api.php`). No web views beyond the default welcome page and a public file-serving route for uploads (`routes/web.php`).
- Resources: `MissingPerson`, `LostItem`, `Sighting`, `User`. Controllers live in `app/Http/Controllers`, validation in `app/Http/Requests`, response shaping in `app/Http/Resources` (only `LostItem`, `MissingPerson`, `User` have Resources currently — `Sighting` responses are returned raw).
- Relationships: `User` hasMany `MissingPerson`/`LostItem`/`Sighting`; `MissingPerson` hasMany `Sighting`.
- File uploads (avatars, person/item photos) go through `app/Services/FileUploadService.php` and are served back via `app/Services/ImageUrlService.php` plus the `/uploads/{directory}/{filename}` route in `routes/web.php`; in production these are backed by the `uploads` Docker volume shared between `nginx` and `php-fpm`.
- Auth is custom (`AuthController`) rather than Laravel Breez/Fortify — signup/signin/signin-by-phone/OTP/password reset, all issuing Sanctum tokens. Phone/OTP sign-in endpoints exist in routes but are not yet implemented on the frontend (`AuthContext.signInWithPhone`/`verifyOtp` are stubs).
- Scheduled tasks run via a dedicated `scheduler` container (`php artisan schedule:run` loop), not cron on the host.
- `api/CLAUDE.md` (Laravel Boost-generated) governs code style, testing conventions, and tool usage within `api/` — read it before making backend changes.

### UI (Next.js)
- App Router with a single route (`app/page.tsx` = `/`); most "pages" (profile, forms, detail views) are actually client-side modal/section toggles within `Home`, not separate routes.
- All data fetching goes through `lib/api-client.ts` (`apiClient.*` helpers) which targets `NEXT_PUBLIC_API_URL` (defaults to `https://api.retrouve-moi.com/api`). Endpoint paths are centralized in `lib/routes.ts` (`API_ROUTES`) — add new endpoints there rather than hardcoding paths.
- `extractDataArray()` in `lib/api-client.ts` normalizes API responses that may come back as a bare array, or wrapped in `data`/`results`/`items` — reuse it for any new list-fetching code instead of assuming a response shape.
- Auth state (`contexts/AuthContext.tsx`) is hand-rolled: token + user stored in `localStorage`, no cookies/session, manually rehydrated on mount. `contexts/AppContext.tsx` is a separate, minimal context for UI-only state (sidebar).
- `components/ui/` holds shadcn/ui-style primitives (Radix-based) plus a few domain components that don't quite fit ui-primitive naming (`ItemCard`, `PersonCard`, `SearchFilters`, `StatsCard`, `StatusBadge`) — check there before adding a new generic UI component.
- Domain components (`Header`, `HeroSection`, `ReportForm`, `ItemReportForm`, modals, etc.) live directly under `components/`.
- UI copy is in French; keep new user-facing strings consistent with that.
- Path alias `@/*` maps to the `ui/` root (see `tsconfig.json`).

## Deployment

Production images are built by GitHub Actions on push to `main` and pushed to GHCR (`ghcr.io/<repo>-nextjs`, `-php-fpm`, `-nginx`), then run via `docker-compose.yml` (pulling `:latest`). There's no staging environment defined in this repo. Nginx and php-fpm share `laravel_storage` and `uploads` volumes; only `traefik` and `ui`/`nginx` are on the `web` network, everything else is on the internal-only `internal` network.

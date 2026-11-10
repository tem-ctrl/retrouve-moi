# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

"Retrouve-moi" (report-missing) is a platform for reporting and tracking missing persons and lost/found items. It's a monorepo with two independently deployed apps plus deployment infra:

- `api/` — Laravel 13 (PHP 8.4) REST API. See `api/CLAUDE.md` for Laravel-specific guidance (Boost tool usage, Pint, PHPUnit conventions) — those rules apply whenever you're working inside `api/`.
- `ui/` — Next.js 16 (App Router, React 19) frontend. Currently a single-page app: almost all UI state and composition lives in `ui/app/page.tsx`, which renders sections/modals from `ui/components/`.
- `docker-compose.yml` — production orchestration (ui, nginx, php-fpm, scheduler, redis, mysql). TLS and routing come from the nginx installed on the VPS (vps-nginx), which forwards to `127.0.0.1:3000` (ui) and `127.0.0.1:8080` (API).
- `.github/workflows/` — `release.yml` runs on push to `main`: `ci.yml` (UI lint/format/typecheck/tests/build, API tests) → `docker-build-push.yml` (three GHCR images: `-nextjs`, `-php-fpm`, `-nginx`) → `deploy.yml` (SSH to the VPS, `docker compose up --wait`). See `docs/deployment.md`.

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
- Auth state (`contexts/AuthContext.tsx`) is hand-rolled: token + user stored in `localStorage`, no cookies/session, manually rehydrated on mount.
- `components/ui/` holds shadcn/ui-style primitives (Radix-based) plus a few domain components that don't quite fit ui-primitive naming (`ItemCard`, `PersonCard`, `SearchFilters`, `StatsCard`, `StatusBadge`) — check there before adding a new generic UI component.
- Domain components (`Header`, `HeroSection`, `ReportForm`, `ItemReportForm`, modals, etc.) live directly under `components/`.
- UI copy is in French; keep new user-facing strings consistent with that.
- Visual identity ("Fil": indigo ndop + kola red, Familjen Grotesk + Atkinson Hyperlegible) is documented in `ui/BRAND.md`. Use the semantic color tokens from `app/globals.css` (`bg-card`, `text-muted-foreground`, `bg-primary`, `text-danger-ink`, `bg-success-soft`…), never raw Tailwind palette classes like `bg-orange-500` or `text-gray-600`: the tokens carry both light and dark themes (`next-themes`, class strategy). Use `components/brand/Logo.tsx` for the logo.
- Share images (link previews and downloadable posters) are generated with `next/og` from `lib/og/templates.tsx`; see the `opengraph-image.tsx` and `affiche/route.tsx` files under `app/missing-persons/[id]` and `app/lost-items/[id]`.
- Path alias `@/*` maps to the `ui/` root (see `tsconfig.json`).

## Deployment

Every push to `main` runs the Release workflow: CI, then images built and pushed to GHCR (`ghcr.io/<repo>-nextjs`, `-php-fpm`, `-nginx`, tagged with the commit SHA and `latest`), then an SSH deploy that copies `docker-compose.yml` to the VPS and restarts the stack on `:latest`. Server setup, required GitHub environment secrets and rollback are in `docs/deployment.md`. There's no staging environment defined in this repo. Nginx and php-fpm share `laravel_storage` and `uploads` volumes; `ui` and `nginx` publish ports on 127.0.0.1 for the VPS's nginx (3000 and 8080), everything else is on the internal-only `internal` network.

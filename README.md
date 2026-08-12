# Retrouve-moi (report-missing)

A platform for reporting and tracking missing persons and lost/found items in Cameroon. Users can register and log in, but an account is not required to submit a report.

Live site: [https://retrouve-moi.com](https://retrouve-moi.com)

## Monorepo structure

- `api/` — Laravel 13 (PHP 8.4) REST API.
- `ui/` — Next.js 16 (App Router, React 19) frontend.
- `traefik/` — reverse proxy config (routing, TLS) for production.
- `docker-compose.yml` — production orchestration (traefik, ui, nginx, php-fpm, scheduler, redis, mysql).
- `.github/workflows/docker-build-push.yml` — builds and pushes GHCR images on push to `main`.

The UI and API are separate deployables that only communicate over HTTP — there is no shared package or generated client.

## Tech stack

**API**
- Laravel 13 / PHP 8.4
- Sanctum token authentication
- MySQL 8, Redis (cache/queue/session)
- Pint (formatting), PHPUnit (testing)

**UI**
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI / shadcn-style primitives
- react-hook-form + zod, SWR
- Vitest (unit), Playwright (e2e), MSW (API mocking)

**Infra**
- Docker Compose, Traefik (TLS/routing), Nginx + PHP-FPM, GitHub Actions (build & push to GHCR)

## Local setup

### System requirements

- NodeJs >= 20
- PHP 8.4
- MySQL >= 8.4.10

### Clone the repository

```sh
git clone https://github.com/tem-ctrl/retrouve-moi.git
```

### API (`api/`)

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer run dev   # serve + queue listener + logs + vite, all concurrently
```

The API defaults to `http://localhost:8000`.

### UI (`ui/`)

```bash
cd ui
yarn install
cp .env.example .env.local
yarn dev
```

By default `NEXT_PUBLIC_API_URL` points at `http://localhost:8000/api` (your local API). Set `NEXT_PUBLIC_API_MOCKING=enabled` to run against mocked data (MSW) instead of a real backend.

The UI defaults to `http://localhost:3000`.

### Common commands

| | API | UI |
|---|---|---|
| Install | `composer install` | `yarn install`, `yarn playwright install` |
| Dev server | `composer run dev` | `yarn dev` |
| Test | `php artisan test --compact` | `yarn test` (unit), `yarn test:e2e` (Playwright) |
| Lint/format | `vendor/bin/pint --dirty --format agent` | `yarn lint`, `yarn format` |
| Build | — | `yarn build` |

## Deployment

Production images are built by GitHub Actions on push to `main` and pushed to GHCR (`-nextjs`, `-php-fpm`, `-nginx`), then run via `docker-compose.yml`. There is no staging environment.

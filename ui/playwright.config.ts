import { defineConfig, devices } from '@playwright/test';

// A dedicated port, distinct from the one you run `yarn dev` on for manual
// testing. e2e tests must never share a server with your own dev session —
// see the reuseExistingServer note below for why.
const PORT = process.env.PLAYWRIGHT_PORT || 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn dev',
    url: baseURL,
    // Always spawn our own server; never reuse one already running (e.g. a
    // `yarn dev` you have open on :3000 for manual testing against the real
    // API). Reusing it would silently skip NEXT_PUBLIC_API_MOCKING below and
    // point e2e tests at your real backend instead of the MSW mocks.
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      PORT: String(PORT),
      NEXT_PUBLIC_API_MOCKING: 'enabled',
    },
  },
});

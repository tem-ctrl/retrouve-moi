'use client';

import { useEffect, useState } from 'react';

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

/**
 * Starts the MSW browser worker before rendering children, but only when
 * NEXT_PUBLIC_API_MOCKING=enabled (set by Playwright's webServer in
 * playwright.config.ts). No-op in normal dev/production runs.
 */
export function MockServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => setReady(true))
    );
  }, []);

  if (!ready) return null;
  return children;
}

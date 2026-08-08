'use client';

import { FC } from 'react';
import { SWRConfig } from 'swr';

import { apiFetch } from '@/lib/http';

const fetcher = (path: string) => apiFetch(path);

const SWRProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        // A searcher checking back on an urgent case should see updates
        // without a manual refresh, so keep revalidating on focus/reconnect
        // (this matches SWR's own defaults — set explicitly so it's a
        // deliberate choice, not an unexamined default).
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        // SWR retries indefinitely by default; cap it so a persistently-down
        // API doesn't retry forever.
        errorRetryCount: 3,
        // Multiple components on the homepage (stats strip, listing grid)
        // can read the same key within the same tick — widen slightly from
        // SWR's 2s default to collapse more of that into one request.
        dedupingInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;

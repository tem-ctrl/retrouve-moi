import { SWRConfig } from 'swr';

// A fresh Map-backed cache per render so hook tests never leak SWR cache
// state into one another (the default cache is a module-level singleton).
export function SWRTestWrapper({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>;
}

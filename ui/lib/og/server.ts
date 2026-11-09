import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { env } from '@/lib/env';
import { API_ROUTES } from '@/lib/routes';
import { LostItem, MissingPerson } from '@/types';

// Satori needs TTF/OTF data (not woff2), so the fonts ship in assets/fonts
// (see outputFileTracingIncludes in next.config.ts for the standalone build).
const fontPath = (file: string) => join(process.cwd(), 'assets', 'fonts', file);

let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[]
> | null = null;

export function loadPosterFonts() {
  fontsPromise ??= Promise.all([
    readFile(fontPath('FamiljenGrotesk-Bold.ttf')),
    readFile(fontPath('AtkinsonHyperlegible-Regular.ttf')),
    readFile(fontPath('AtkinsonHyperlegible-Bold.ttf')),
  ]).then(([heading, body, bodyBold]) => [
    { name: 'Familjen Grotesk', data: heading, weight: 700 as const, style: 'normal' as const },
    { name: 'Atkinson Hyperlegible', data: body, weight: 400 as const, style: 'normal' as const },
    {
      name: 'Atkinson Hyperlegible',
      data: bodyBold,
      weight: 700 as const,
      style: 'normal' as const,
    },
  ]);
  return fontsPromise;
}

async function fetchResource<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T };
    return body.data ?? null;
  } catch {
    return null;
  }
}

export const getMissingPerson = (id: string) =>
  fetchResource<MissingPerson>(API_ROUTES.missingPersons.byId(id));

export const getLostItem = (id: string) => fetchResource<LostItem>(API_ROUTES.lostItems.byId(id));

/**
 * Inline the photo as a data URI so a slow or missing image can't break the render.
 * Satori decodes PNG and JPEG only; anything else falls back to the silhouette.
 */
export async function loadPhoto(url: string | undefined | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const type = res.headers.get('content-type')?.split(';')[0] ?? '';
    if (type !== 'image/jpeg' && type !== 'image/png') return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export const siteHost = () =>
  new URL(process.env.NEXT_PUBLIC_URL || 'https://retrouve-moi.com').host;

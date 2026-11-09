import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';

import { loadPosterFonts } from './server';

export async function renderImage(
  element: ReactElement,
  size: { width: number; height: number },
  headers?: Record<string, string>,
) {
  return new ImageResponse(element, {
    ...size,
    fonts: await loadPosterFonts(),
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300', ...headers },
  });
}

/** ASCII-only slug for download filenames. */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'affiche';

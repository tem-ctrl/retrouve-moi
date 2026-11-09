/*
 * Retrouve-moi brand constants — direction « Fil ». See ui/BRAND.md.
 * Used where CSS variables aren't available (generated images, manifest, mark geometry).
 */

export const BRAND = {
  indigo: '#1f2a5c',
  indigoDeep: '#182148',
  indigoLight: '#3d4c9a',
  kola: '#c2412d',
  kolaOnDark: '#e0735c',
  coton: '#f5f6fa',
  ink: '#171a26',
  muted: '#5a6179',
  success: '#25734a',
  item: '#8c5a0e',
} as const;

/** Mark geometry in a 48×48 box: long stroke + short stroke closing a circle around a dot. */
export const MARK = {
  arcLong: 'M15.5 38.722A17 17 0 1 1 40.421 19.6',
  arcShort: 'M40.688 27.244A17 17 0 0 1 22.814 40.959',
  strokeWidth: 5.5,
  dot: { cx: 24, cy: 24, r: 5 },
} as const;

export function markSvg(ring: string, accent: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke-width="${MARK.strokeWidth}" stroke-linecap="round"><path d="${MARK.arcLong}" stroke="${ring}"/><path d="${MARK.arcShort}" stroke="${accent}"/></g><circle cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}" fill="${accent}"/></svg>`;
}

/** One 24px tile of the ndop band motif. */
export function ndopTileSvg(fg: string = BRAND.coton, bg: string = BRAND.indigo): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M0 0l5 5M24 0l-5 5M0 24l5-5M24 24l-5-5"/></g><circle cx="12" cy="12" r="1.2" fill="${fg}"/></svg>`;
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

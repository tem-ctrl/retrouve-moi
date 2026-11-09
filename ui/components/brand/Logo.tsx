import { MARK } from '@/lib/brand';
import { cn } from '@/lib/utils';

/*
 * Retrouve-moi logo — direction « Fil ».
 * Two strokes closing a circle around a dot: someone found again.
 * Geometry lives in lib/brand.ts and matches the static assets in public/brand/.
 */

type Tone = 'default' | 'reversed';

const PALETTE: Record<Tone, { ring: string; accent: string; text: string }> = {
  // On light surfaces (cards, page background in light theme).
  default: {
    ring: 'var(--brand-indigo)',
    accent: 'var(--brand-kola)',
    text: 'var(--brand-indigo)',
  },
  // On indigo chrome (header, hero, footer) and dark surfaces.
  reversed: {
    ring: 'var(--brand-coton)',
    accent: 'var(--brand-kola-on-dark)',
    text: 'var(--brand-coton)',
  },
};

interface LogoMarkProps {
  size?: number;
  tone?: Tone;
  className?: string;
  title?: string;
}

export function LogoMark({ size = 40, tone = 'default', className, title }: LogoMarkProps) {
  const c = PALETTE[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill="none" strokeWidth={MARK.strokeWidth} strokeLinecap="round">
        <path d={MARK.arcLong} stroke={c.ring} />
        <path d={MARK.arcShort} stroke={c.accent} />
      </g>
      <circle {...MARK.dot} fill={c.accent} />
    </svg>
  );
}

interface LogoProps {
  tone?: Tone;
  /** Height of the mark in px; the wordmark scales with it. */
  size?: number;
  className?: string;
  /** Hide the wordmark below the `sm` breakpoint. */
  compact?: boolean;
}

export default function Logo({ tone = 'default', size = 36, className, compact }: LogoProps) {
  const c = PALETTE[tone];
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} tone={tone} />
      <span
        className={cn(
          'font-display font-bold leading-none tracking-tight whitespace-nowrap',
          compact && 'hidden sm:inline',
        )}
        style={{ color: c.text, fontSize: size * 0.62 }}
      >
        retrouve<span style={{ color: c.accent }}>-</span>moi
      </span>
      <span className="sr-only">Retrouve-moi</span>
    </span>
  );
}

import { z } from 'zod';

// process.env.NEXT_PUBLIC_* must be accessed as static, literal property
// reads (not spread/looped) so Next.js can inline them into client bundles
// at build time.
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default('https://api.retrouve-moi.com/api'),
  NEXT_PUBLIC_API_MOCKING: z.literal('enabled').optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')}`,
  );
}

export const env = parsed.data;

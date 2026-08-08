import { getStoredToken } from '@/lib/auth-storage';
import { env } from '@/lib/env';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;
  readonly body?: unknown;

  constructor(
    message: string,
    options: { status: number; fieldErrors?: Record<string, string[]>; body?: unknown },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.fieldErrors = options.fieldErrors;
    this.body = options.body;
  }
}

const buildUrl = (path: string) => `${env.NEXT_PUBLIC_API_URL}${path}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractMessage = (body: unknown, path: string, status: number): string => {
  if (isRecord(body)) {
    if (typeof body.message === 'string') return body.message;
    if (typeof body.error === 'string') return body.error;
  }
  return `Request to ${path} failed with status ${status}`;
};

const extractFieldErrors = (
  body: unknown,
  status: number,
): Record<string, string[]> | undefined => {
  if (status !== 422 || !isRecord(body) || !isRecord(body.errors)) return undefined;
  return body.errors as Record<string, string[]>;
};

/**
 * Typed fetch wrapper for the Laravel API. Callers specify the expected
 * success shape, e.g. apiFetch<ApiCollection<MissingPerson>>('/missing-persons')
 * (see types/api.ts for the real response envelopes per endpoint).
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Note: sending this doesn't make requests protected yet — most API
  // routes aren't behind auth:sanctum or ownership checks. See the
  // TODO(auth) block in api/routes/api.php.
  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), { ...init, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(extractMessage(body, path, response.status), {
      status: response.status,
      fieldErrors: extractFieldErrors(body, response.status),
      body,
    });
  }

  return body as T;
}

import { env } from '@/lib/env';

const AUTH_TOKEN_STORAGE_KEY = 'authToken';

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

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

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

  const token = getAuthToken();
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

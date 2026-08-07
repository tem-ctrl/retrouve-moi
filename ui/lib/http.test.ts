import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { env } from '@/lib/env';
import { ApiError, apiFetch } from '@/lib/http';
import { server } from '@/mocks/node';

const endpoint = (path: string) => `${env.NEXT_PUBLIC_API_URL}${path}`;

const captureApiError = async (promise: Promise<unknown>): Promise<ApiError> => {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
  throw new Error('Expected promise to reject with an ApiError');
};

afterEach(() => {
  window.localStorage.clear();
});

describe('apiFetch', () => {
  it('parses a successful JSON response', async () => {
    server.use(http.get(endpoint('/ping'), () => HttpResponse.json({ data: { ok: true } })));

    const result = await apiFetch<{ data: { ok: boolean } }>('/ping');
    expect(result).toEqual({ data: { ok: true } });
  });

  it('returns undefined for a 204 No Content response', async () => {
    server.use(http.delete(endpoint('/ping'), () => new HttpResponse(null, { status: 204 })));

    const result = await apiFetch<undefined>('/ping', { method: 'DELETE' });
    expect(result).toBeUndefined();
  });

  it('sends a JSON Content-Type and Accept header by default', async () => {
    server.use(
      http.post(endpoint('/ping'), ({ request }) => {
        expect(request.headers.get('Content-Type')).toBe('application/json');
        expect(request.headers.get('Accept')).toBe('application/json');
        return HttpResponse.json({ data: null });
      }),
    );

    await apiFetch('/ping', { method: 'POST', body: JSON.stringify({ a: 1 }) });
  });

  it('does not force a Content-Type when the body is FormData', async () => {
    server.use(
      http.post(endpoint('/ping'), ({ request }) => {
        expect(request.headers.get('Content-Type')).toMatch(/^multipart\/form-data/);
        return HttpResponse.json({ data: null });
      }),
    );

    const formData = new FormData();
    formData.append('field', 'value');
    await apiFetch('/ping', { method: 'POST', body: formData });
  });

  it('attaches an Authorization header when a token is stored', async () => {
    window.localStorage.setItem('authToken', 'test-token');
    server.use(
      http.get(endpoint('/ping'), ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer test-token');
        return HttpResponse.json({ data: null });
      }),
    );

    await apiFetch('/ping');
  });

  it('omits the Authorization header when no token is stored', async () => {
    server.use(
      http.get(endpoint('/ping'), ({ request }) => {
        expect(request.headers.get('Authorization')).toBeNull();
        return HttpResponse.json({ data: null });
      }),
    );

    await apiFetch('/ping');
  });

  it('throws an ApiError with the field-error bag on a 422', async () => {
    server.use(
      http.post(endpoint('/ping'), () =>
        HttpResponse.json({ errors: { email: ['The email field is required.'] } }, { status: 422 }),
      ),
    );

    const error = await captureApiError(apiFetch('/ping', { method: 'POST' }));
    expect(error.status).toBe(422);
    expect(error.fieldErrors).toEqual({ email: ['The email field is required.'] });
  });

  it('throws an ApiError using the `error` field when present', async () => {
    server.use(
      http.post(endpoint('/ping'), () =>
        HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 }),
      ),
    );

    const error = await captureApiError(apiFetch('/ping', { method: 'POST' }));
    expect(error.status).toBe(401);
    expect(error.message).toBe('Invalid email or password');
    expect(error.fieldErrors).toBeUndefined();
  });

  it('falls back to a generic message when the error body has no message/error field', async () => {
    server.use(http.get(endpoint('/ping'), () => new HttpResponse(null, { status: 500 })));

    const error = await captureApiError(apiFetch('/ping'));
    expect(error.status).toBe(500);
    expect(error.message).toBe('Request to /ping failed with status 500');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import useSWR from 'swr';
import { describe, expect, it } from 'vitest';

import { env } from '@/lib/env';
import { server } from '@/mocks/node';

import SWRProvider from './SWRProviders';

function Ping() {
  const { data, error } = useSWR<{ message: string }>('/ping');
  if (error) return <p>error</p>;
  if (!data) return <p>loading</p>;
  return <p>{data.message}</p>;
}

describe('SWRProvider', () => {
  it('supplies a working default fetcher to descendant useSWR calls', async () => {
    server.use(
      http.get(`${env.NEXT_PUBLIC_API_URL}/ping`, () => HttpResponse.json({ message: 'pong' })),
    );

    render(
      <SWRProvider>
        <Ping />
      </SWRProvider>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('pong')).toBeInTheDocument());
  });
});

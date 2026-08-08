'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';

import PersonDetailModal from '@/components/PersonDetailModal';
import { useMissingPerson } from '@/hooks/api/useMissingPerson';

// Intercepted variant of app/missing-persons/[id]/page.tsx — rendered
// instead of the full page when navigated to via a soft nav (Link/push)
// from anywhere under the root layout, so the origin page stays mounted
// behind this modal. See refactoring.md Phase 3.5.
export default function InterceptedMissingPersonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: person, isLoading } = useMissingPerson(id);

  if (isLoading || !person) {
    return null;
  }

  return <PersonDetailModal person={person} onClose={() => router.back()} />;
}

'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';

import PersonDetailModal from '@/components/PersonDetailModal';
import { useMissingPerson } from '@/hooks/api/useMissingPerson';
import { ROUTES } from '@/lib/routes';

export default function MissingPersonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: person, isLoading } = useMissingPerson(id);

  if (isLoading || !person) {
    return null;
  }

  return <PersonDetailModal person={person} onClose={() => router.push(ROUTES.home)} />;
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import AppLayout from '@/components/AppLayout';
import PersonDetailModal from '@/components/PersonDetailModal';
import { useMissingPerson } from '@/hooks/api/useMissingPerson';
import { ROUTES } from '@/lib/routes';

export default function MissingPersonDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: person, isLoading } = useMissingPerson(id);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden animate-pulse">
            <div className="h-64 bg-muted-strong" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-muted-strong rounded w-2/3" />
              <div className="h-4 bg-muted-strong rounded w-full" />
              <div className="h-4 bg-muted-strong rounded w-1/2" />
            </div>
          </div>
        ) : person ? (
          <PersonDetailModal person={person} onClose={() => router.back()} />
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <h1 className="text-lg font-semibold text-foreground mb-2">Signalement introuvable</h1>
            <p className="text-muted-foreground mb-6">Ce signalement n&apos;existe pas ou plus.</p>
            <Link
              href={ROUTES.missingPersons.list}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

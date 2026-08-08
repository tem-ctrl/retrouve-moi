'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import ProfilePage from '@/components/ProfilePage';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';
import { MissingPerson } from '@/types';

/**
 * Client-side auth guard: this app's auth is localStorage-only (no
 * cookies/session), so a true server-side redirect isn't possible here —
 * see Phase 2.6 in refactoring.md. Bounces unauthenticated visitors to `/`
 * once `loading` resolves, rendering nothing in the meantime to avoid a
 * flash of profile content before the redirect fires.
 */
export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(ROUTES.home);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const handleViewPerson = (person: MissingPerson) => {
    router.push(`${ROUTES.home}?person=${person.id}`);
  };

  return <ProfilePage onClose={() => router.push(ROUTES.home)} onViewPerson={handleViewPerson} />;
}

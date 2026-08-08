'use client';

import { useRouter } from 'next/navigation';

import AuthModal from '@/components/AuthModal';

// Intercepted variant of app/login/page.tsx — see
// app/@modal/(.)missing-persons/[id]/page.tsx for why this exists.
export default function InterceptedLogin() {
  const router = useRouter();

  return <AuthModal isOpen onClose={() => router.back()} />;
}

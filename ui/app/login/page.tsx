'use client';

import { useRouter } from 'next/navigation';

import AuthModal from '@/components/AuthModal';
import { ROUTES } from '@/lib/routes';

export default function Login() {
  const router = useRouter();

  return <AuthModal isOpen onClose={() => router.push(ROUTES.home)} />;
}

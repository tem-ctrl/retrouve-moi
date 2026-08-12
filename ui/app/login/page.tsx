'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import AppLayout from '@/components/AppLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { UserIcon } from '@/components/icons/Icons';
import { ROUTES } from '@/lib/routes';

type AuthMode = 'login' | 'register';

// useSearchParams() below requires a Suspense boundary during static
// prerendering — same pattern as app/report/page.tsx.
export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: AuthMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const setMode = (next: AuthMode) => {
    router.replace(ROUTES.login(next === 'register' ? 'register' : undefined));
  };

  const handleLoginSuccess = () => router.push(ROUTES.home);

  return (
    <AppLayout>
      <div className="w-full md:max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1E3A5F] to-[#2d4a6f] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <UserIcon size={28} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                </h1>
                <p className="text-sm text-white/70">
                  {mode === 'login'
                    ? 'Accédez à votre espace personnel'
                    : 'Rejoignez notre communauté'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'login' ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

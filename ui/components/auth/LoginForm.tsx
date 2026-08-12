'use client';

import React, { FC, useState, SubmitEvent } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../icons/Icons';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : error.message,
      );
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="relative">
          <MailIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
        <div className="relative">
          <LockIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold transition-colors"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Pas encore de compte?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
        >
          S&apos;inscrire
        </button>
      </p>
    </form>
  );
};

export default LoginForm;

'use client';

import { FC, SubmitEvent, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  LockIcon,
} from '../icons/Icons';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const response = await signUp(
      email,
      password,
      passwordConfirmation,
      full_name,
      phone,
      avatar || undefined,
    );

    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }

    setSuccess('Compte créé avec succès! Vérifiez votre email pour confirmer votre inscription.');
    setLoading(false);
    setTimeout(() => {
      setSuccess(null);
      onSwitchToLogin();
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <CheckCircleIcon size={18} />
          {success}
        </div>
      )}

      <div className="flex justify-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAvatar(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
          id="avatar-input"
        />
        <label htmlFor="avatar-input" className="cursor-pointer">
          <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local FileReader data URL, not a next/image-optimizable remote source
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon size={40} className="text-white" />
            )}
          </div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <div className="relative">
          <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Jean Dupont"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <div className="relative">
          <PhoneIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="6 XX XX XX XX"
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
            minLength={6}
            placeholder="Min. 6 caractères"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <LockIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPasswordConfirmation ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Confirmez le mot de passe"
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswordConfirmation ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold transition-colors"
      >
        {loading ? 'Création...' : 'Créer mon compte'}
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
        Déjà un compte?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
        >
          Se connecter
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;

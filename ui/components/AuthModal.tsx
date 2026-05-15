import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { XIcon, UserIcon, PhoneIcon, MailIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, LockIcon } from './icons/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { signUp, signIn, signInWithPhone, verifyOtp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'phone' | 'otp'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setFullName('');
    setPhone('');
    setOtp('');
    setAvatar(null);
    setAvatarPreview(null);
    setError(null);
    setSuccess(null);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou mot de passe incorrect' 
        : error.message);
    } else {
      onClose();
      resetForm();
    }

    setLoading(false);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
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

    const response = await signUp(email, password, passwordConfirmation, full_name, phone, avatar || undefined);

    if (response.error) {
      setError(response.error.message);
    } else {
      setSuccess('Compte créé avec succès! Vérifiez votre email pour confirmer votre inscription.');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
      }, 3000);
    }

    setLoading(false);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format phone number for Cameroon
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+237' + formattedPhone.replace(/^0/, '');
    }

    const { error } = await signInWithPhone(formattedPhone);

    if (error) {
      setError('Erreur lors de l\'envoi du code. Vérifiez le numéro.');
    } else {
      setPhone(formattedPhone);
      setMode('otp');
      setSuccess('Code envoyé par SMS!');
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await verifyOtp(phone, otp);

    if (error) {
      setError('Code invalide ou expiré');
    } else {
      onClose();
      resetForm();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <XIcon size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <UserIcon size={28} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {mode === 'login' && 'Connexion'}
                {mode === 'signup' && 'Créer un compte'}
                {mode === 'phone' && 'Connexion par téléphone'}
                {mode === 'otp' && 'Vérification'}
              </h2>
              <p className="text-sm text-white/70">
                {mode === 'login' && 'Accédez à votre espace personnel'}
                {mode === 'signup' && 'Rejoignez notre communauté'}
                {mode === 'phone' && 'Recevez un code par SMS'}
                {mode === 'otp' && 'Entrez le code reçu'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
              <CheckCircleIcon size={18} />
              {success}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleEmailSignup} className="space-y-4">
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
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
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
            </form>
          )}

          {/* Phone Login Form */}
          {mode === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
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
                <p className="text-xs text-gray-500 mt-1">Format: 6XXXXXXXX (Cameroun)</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold transition-colors"
              >
                {loading ? 'Envoi...' : 'Recevoir le code'}
              </button>
            </form>
          )}

          {/* OTP Verification Form */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code de vérification</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Code envoyé au {phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold transition-colors"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>

              <button
                type="button"
                onClick={() => setMode('phone')}
                className="cursor-pointer w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Renvoyer le code
              </button>
            </form>
          )}

          {/* Mode Switchers */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* <button
                type="button"
                onClick={() => {
                  setMode('phone');
                  resetForm();
                }}
                className="cursor-pointer w-full py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PhoneIcon size={18} />
                Continuer avec le téléphone
              </button> */}

              <p className="text-center text-sm text-gray-600 mt-4">
                {mode === 'login' ? (
                  <>
                    Pas encore de compte?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        resetForm();
                      }}
                      className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
                    >
                      S&apos;inscrire
                    </button>
                  </>
                ) : (
                  <>
                    Déjà un compte?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        resetForm();
                      }}
                      className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </p>
            </>
          )}

          {mode === 'phone' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
                className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
              >
                Retour à la connexion par email
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

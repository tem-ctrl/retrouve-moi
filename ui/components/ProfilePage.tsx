import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useMissingPersons } from '@/hooks/api/useMissingPersons';
import { MissingPerson } from '@/types';

import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SearchIcon,
  EditIcon,
} from './icons/Icons';
import StatusBadge from './ui/StatusBadge';

interface ProfilePageProps {
  onClose: () => void;
  onViewPerson: (person: MissingPerson) => void;
}

const REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest',
];

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose, onViewPerson }) => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'reports'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: userReports, isLoading: loadingReports } = useMissingPersons(
    user ? { user_id: user.id } : null,
  );

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    region: profile?.region || '',
    bio: profile?.bio || '',
  });

  useEffect(() => {
    if (profile) {
      // Seeding editable form state from profile once it loads
      // asynchronously — not syncing an external system.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        region: profile.region || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    const { error } = await updateProfile(formData);

    if (error) {
      setError('Erreur lors de la mise à jour du profil');
    } else {
      setSuccess('Profil mis à jour avec succès!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return userReports.length;
    if (status === 'urgent') return userReports.filter((r) => r.is_urgent).length;
    return userReports.filter((r) => r.status === status).length;
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mon Profil</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Mes signalements
              {userReports.length > 0 && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                  {userReports.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <CheckCircleIcon size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertTriangleIcon size={20} />
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-[#1E3A5F] to-[#2d4a6f] p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      'U'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{profile?.full_name || 'Utilisateur'}</h2>
                    <p className="text-white/70">{user?.email}</p>
                    <p className="text-sm text-white/50 mt-1">
                      Membre depuis {formatDate(profile?.created_at || new Date().toISOString())}
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <EditIcon size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+237 6XX XX XX XX"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Votre adresse"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Votre ville"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Région
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                        >
                          <option value="">Sélectionner une région</option>
                          {REGIONS.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Quelques mots sur vous..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-medium transition-colors"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <UserIcon size={20} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Nom complet</p>
                          <p className="font-medium text-gray-900">{profile?.full_name || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <PhoneIcon size={20} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Téléphone</p>
                          <p className="font-medium text-gray-900">{profile?.phone || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPinIcon size={20} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Localisation</p>
                        <p className="font-medium text-gray-900">
                          {[profile?.address, profile?.city, profile?.region]
                            .filter(Boolean)
                            .join(', ') || '-'}
                        </p>
                      </div>
                    </div>
                    {profile?.bio && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Bio</p>
                        <p className="text-gray-900">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('all')}</p>
                <p className="text-sm text-gray-500">Total signalements</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-red-600">{getStatusCount('missing')}</p>
                <p className="text-sm text-gray-500">Disparus</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-green-600">{getStatusCount('found')}</p>
                <p className="text-sm text-gray-500">Retrouvés</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-orange-600">{getStatusCount('urgent')}</p>
                <p className="text-sm text-gray-500">Urgents</p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {loadingReports ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun signalement</h3>
                <p className="text-gray-500 mb-6">
                  Vous n&apos;avez pas encore créé de signalement de personne disparue.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                >
                  Créer un signalement
                </button>
              </div>
            ) : (
              userReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewPerson(report)}
                >
                  <div className="flex gap-4 p-4">
                    <Image
                      src={report.photo_url}
                      alt={report.full_name}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 truncate">{report.full_name}</h3>
                        <StatusBadge status={report.status} is_urgent={report.is_urgent} />
                      </div>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPinIcon size={14} className="text-orange-500 shrink-0" />
                          <span className="truncate">
                            {report.last_seen_location}, {report.region}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} className="text-orange-500 shrink-0" />
                          <span>Signalé le {formatDate(report.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

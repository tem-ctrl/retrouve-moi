import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { buildApiEndpoint } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/routes';

import { XIcon, CameraIcon, MapPinIcon, UserIcon, PhoneIcon } from './icons/Icons';

interface ReportFormProps {
  tabs: React.ReactNode;
  onClose: () => void;
  onSuccess: () => void;
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

const ReportForm: React.FC<ReportFormProps> = ({ tabs, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState({
    full_name: '',
    age: '',
    gender: '',
    description: '',
    last_seen_location: '',
    last_seen_date: '',
    region: '',
    contact_phone: '',
    contact_email: '',
    is_urgent: false,
    distinctive_signs: '',
    height: '',
    clothing_description: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
  });

  // Pre-fill reporter info if user is logged in
  useEffect(() => {
    if (user && profile) {
      setData((prev) => ({
        ...prev,
        reporter_name: profile.full_name || '',
        reporter_phone: profile.phone || '',
        reporter_email: user.email || '',
      }));
    }
  }, [user, profile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      // Add photo file if provided
      if (photoFile) {
        fd.append('photo', photoFile);
      }

      fd.append('full_name', data.full_name);
      fd.append('age', data.age);
      fd.append('gender', data.gender);
      fd.append('description', data.description);
      fd.append('last_seen_location', data.last_seen_location);
      fd.append('last_seen_date', data.last_seen_date);
      fd.append('region', data.region);
      fd.append('contact_phone', data.contact_phone);
      fd.append('contact_email', data.contact_email || '');
      fd.append('is_urgent', data.is_urgent ? '1' : '0');
      fd.append('distinctive_signs', data.distinctive_signs || '');
      fd.append('height', data.height || '');
      fd.append('clothing_description', data.clothing_description || '');
      fd.append('reporter_name', data.reporter_name);
      fd.append('reporter_phone', data.reporter_phone);
      fd.append('reporter_email', data.reporter_email || '');
      fd.append('user_id', user?.id ? String(user.id) : '');

      const response = await fetch(buildApiEndpoint(API_ROUTES.missingPersons.collection()), {
        method: 'POST',
        body: fd,
      });

      if (!response.ok) {
        throw new Error('Failed to submit missing person report');
      }

      onSuccess();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert("Erreur lors de l'envoi du signalement. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid = data.full_name && data.age && data.gender;
  const isStep2Valid =
    data.last_seen_location && data.last_seen_date && data.region && data.description;
  const isStep3Valid = data.contact_phone && data.reporter_name && data.reporter_phone;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div>
            {tabs}
            <p className="text-sm text-gray-500 mt-1.5">Étape {step} sur 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pt-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Informations personnelles</h3>
                <p className="text-gray-500 text-sm">Décrivez la personne disparue</p>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors overflow-hidden group"
                >
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local FileReader data URL, not a next/image-optimizable remote source
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <CameraIcon size={32} className="text-gray-400 group-hover:text-orange-500" />
                      <span className="text-xs text-gray-500 mt-1">Ajouter photo</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={data.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Paul Tassong"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Âge *</label>
                  <input
                    type="number"
                    name="age"
                    value={data.age}
                    onChange={handleChange}
                    required
                    min="0"
                    max="120"
                    placeholder="Ex: 25"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
                  <select
                    name="gender"
                    value={data.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="boy">Garçon</option>
                    <option value="girl">Fille</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille (en cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={data.height}
                    onChange={handleChange}
                    placeholder="Ex: 175"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Signes distinctifs
                  </label>
                  <input
                    type="text"
                    name="distinctive_signs"
                    value={data.distinctive_signs}
                    onChange={handleChange}
                    placeholder="Ex: Cicatrice, tatouage..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vêtements portés
                  </label>
                  <textarea
                    name="clothing_description"
                    value={data.clothing_description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ex: T-shirt bleu, jean noir..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPinIcon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Lieu et circonstances</h3>
                <p className="text-gray-500 text-sm">
                  Où et quand la personne a-t-elle été vue pour la dernière fois?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dernière localisation connue *
                  </label>
                  <input
                    type="text"
                    name="last_seen_location"
                    value={data.last_seen_location}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Marché Mokolo, Yaoundé"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Région *</label>
                    <select
                      name="region"
                      value={data.region}
                      onChange={handleChange}
                      required
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de disparition *
                    </label>
                    <input
                      type="date"
                      name="last_seen_date"
                      value={data.last_seen_date}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description des circonstances *
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Décrivez les circonstances de la disparition..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_urgent"
                    name="is_urgent"
                    checked={data.is_urgent}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="is_urgent" className="text-sm text-gray-700">
                    <span className="font-medium text-red-600">Cas urgent</span> - La personne est
                    en danger immédiat
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PhoneIcon size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Informations de contact</h3>
                <p className="text-gray-500 text-sm">
                  Comment vous contacter si quelqu&apos;un a des informations?
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-3">Contact pour les informations</h4>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      name="contact_phone"
                      value={data.contact_phone}
                      onChange={handleChange}
                      required
                      placeholder="Téléphone principal *"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="email"
                      name="contact_email"
                      value={data.contact_email}
                      onChange={handleChange}
                      placeholder="Email (optionnel)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Vos informations (déclarant)
                    {user && <span className="text-green-600 text-sm ml-2">- Connecté</span>}
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="reporter_name"
                      value={data.reporter_name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet *"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="tel"
                      name="reporter_phone"
                      value={data.reporter_phone}
                      onChange={handleChange}
                      required
                      placeholder="Votre téléphone *"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="email"
                      name="reporter_email"
                      value={data.reporter_email}
                      onChange={handleChange}
                      placeholder="Votre email (optionnel)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Précédent
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                className="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStep3Valid || submitting}
                className="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                {submitting ? 'Envoi en cours...' : 'Publier le signalement'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;

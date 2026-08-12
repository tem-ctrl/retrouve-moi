import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { buildApiEndpoint } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/routes';
import { ITEM_CATEGORIES } from '@/types';

import { XIcon, CameraIcon, MapPinIcon, PackageIcon, PhoneIcon, FileTextIcon } from './icons/Icons';

interface ItemReportFormProps {
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

const ItemReportForm: React.FC<ItemReportFormProps> = ({ tabs, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState({
    report_type: 'lost' as 'lost' | 'found',
    item_type: '' as 'document' | 'object' | 'animal' | 'vehicle' | 'other' | '',
    item_name: '',
    item_category: '',
    description: '',
    location: '',
    date_lost_found: '',
    region: '',
    contact_phone: '',
    contact_email: '',
    is_urgent: false,
    reward: '',
    document_type: '',
    document_number: '',
    owner_name: '',
    brand: '',
    color: '',
    serial_number: '',
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

      fd.append('item_type', data.item_type);
      fd.append('item_name', data.item_name);
      fd.append('item_category', data.item_category);
      fd.append('description', data.description);
      fd.append('location', data.location);
      fd.append('date_lost_found', data.date_lost_found);
      fd.append('region', data.region);
      fd.append('contact_phone', data.contact_phone);
      fd.append('contact_email', data.contact_email || '');
      fd.append('status', data.report_type === 'found' ? 'found' : 'lost');
      fd.append('report_type', data.report_type);
      fd.append('is_urgent', data.is_urgent ? '1' : '0');
      fd.append('reward', data.reward || '');
      fd.append('document_type', data.document_type || '');
      fd.append('document_number', data.document_number || '');
      fd.append('owner_name', data.owner_name || '');
      fd.append('brand', data.brand || '');
      fd.append('color', data.color || '');
      fd.append('serial_number', data.serial_number || '');
      fd.append('reporter_name', data.reporter_name);
      fd.append('reporter_phone', data.reporter_phone);
      fd.append('reporter_email', data.reporter_email || '');
      fd.append('user_id', user?.id ? String(user.id) : '');

      const response = await fetch(buildApiEndpoint(API_ROUTES.lostItems.collection()), {
        method: 'POST',
        body: fd,
      });

      if (!response.ok) {
        throw new Error('Failed to submit item report');
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

  const isStep1Valid = data.report_type && data.item_type && data.item_name && data.item_category;
  const isStep2Valid = data.location && data.date_lost_found && data.region && data.description;
  const isStep3Valid = data.contact_phone && data.reporter_name && data.reporter_phone;

  const getCategories = () => {
    if (!data.item_type) return [];
    return ITEM_CATEGORIES[data.item_type as keyof typeof ITEM_CATEGORIES] || [];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 flex items-center justify-between">
        <div>
          {tabs}
          <p className="text-sm text-gray-500 mt-1.5">Étape {step} sur 3</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                s <= step ? 'bg-purple-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Step 1: Item Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PackageIcon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Type de signalement</h3>
              <p className="text-gray-500 text-sm">Décrivez l&apos;objet perdu ou trouvé</p>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, report_type: 'lost' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.report_type === 'lost'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">
                  <svg
                    className="w-8 h-8 mx-auto text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900">J&apos;ai perdu</div>
                <div className="text-xs text-gray-500">Je recherche un objet</div>
              </button>
              <button
                type="button"
                onClick={() => setData((prev) => ({ ...prev, report_type: 'found' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  data.report_type === 'found'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">
                  <svg
                    className="w-8 h-8 mx-auto text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900">J&apos;ai trouvé</div>
                <div className="text-xs text-gray-500">Je signale une trouvaille</div>
              </button>
            </div>

            {/* Item Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d&apos;objet *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { type: 'document', icon: FileTextIcon, label: 'Document' },
                  { type: 'object', icon: PackageIcon, label: 'Objet' },
                  { type: 'animal', label: 'Animal', emoji: true },
                  { type: 'vehicle', label: 'Véhicule', emoji: true },
                  { type: 'other', label: 'Autre', emoji: true },
                ].map(({ type, icon: Icon, label, emoji }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        item_type: type as 'document' | 'object' | 'animal' | 'vehicle' | 'other',
                        item_category: '',
                      }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      data.item_type === type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {Icon && <Icon size={24} className="mx-auto mb-1 text-purple-500" />}
                    {emoji && (
                      <div className="text-xl mb-1">
                        {type === 'animal' && (
                          <svg
                            className="w-6 h-6 mx-auto text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        )}
                        {type === 'vehicle' && (
                          <svg
                            className="w-6 h-6 mx-auto text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        )}
                        {type === 'other' && (
                          <svg
                            className="w-6 h-6 mx-auto text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                    <div className="text-xs font-medium text-gray-700">{label}</div>
                  </button>
                ))}
              </div>
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
                className="relative w-32 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors overflow-hidden group"
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local FileReader data URL, not a next/image-optimizable remote source
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <CameraIcon size={32} className="text-gray-400 group-hover:text-purple-500" />
                    <span className="text-xs text-gray-500 mt-1">Ajouter photo</span>
                  </div>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">Photo optionnelle</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;objet *
                </label>
                <input
                  type="text"
                  name="item_name"
                  value={data.item_name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: iPhone 14 Pro, CNI, Clés de voiture..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {data.item_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="item_category"
                    value={data.item_category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {getCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Document specific fields */}
              {data.item_type === 'document' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro du document
                    </label>
                    <input
                      type="text"
                      name="document_number"
                      value={data.document_number}
                      onChange={handleChange}
                      placeholder="Si visible"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du propriétaire
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      value={data.owner_name}
                      onChange={handleChange}
                      placeholder="Si visible"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Object specific fields */}
              {(data.item_type === 'object' || data.item_type === 'vehicle') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input
                      type="text"
                      name="brand"
                      value={data.brand}
                      onChange={handleChange}
                      placeholder="Ex: Apple, Samsung..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                    <input
                      type="text"
                      name="color"
                      value={data.color}
                      onChange={handleChange}
                      placeholder="Ex: Noir, Blanc..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Location Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPinIcon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lieu et circonstances</h3>
              <p className="text-gray-500 text-sm">
                {data.report_type === 'found'
                  ? 'Où avez-vous trouvé cet objet?'
                  : 'Où avez-vous perdu cet objet?'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Marché Central, Douala"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
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
                    Date {data.report_type === 'found' ? 'de découverte' : 'de perte'} *
                  </label>
                  <input
                    type="date"
                    name="date_lost_found"
                    value={data.date_lost_found}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Décrivez l'objet et les circonstances..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {data.report_type === 'lost' && (
                <>
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
                      <span className="font-medium text-red-600">Urgent</span> - Objet de grande
                      valeur ou important
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Récompense (optionnel)
                    </label>
                    <input
                      type="text"
                      name="reward"
                      value={data.reward}
                      onChange={handleChange}
                      placeholder="Ex: 10 000 FCFA"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PhoneIcon size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Informations de contact</h3>
              <p className="text-gray-500 text-sm">Comment vous contacter?</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-medium text-purple-900 mb-3">Contact principal</h4>
                <div className="space-y-3">
                  <input
                    type="tel"
                    name="contact_phone"
                    value={data.contact_phone}
                    onChange={handleChange}
                    required
                    placeholder="Téléphone principal *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="email"
                    name="contact_email"
                    value={data.contact_email}
                    onChange={handleChange}
                    placeholder="Email (optionnel)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="tel"
                    name="reporter_phone"
                    value={data.reporter_phone}
                    onChange={handleChange}
                    required
                    placeholder="Votre téléphone *"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="email"
                    name="reporter_email"
                    value={data.reporter_email}
                    onChange={handleChange}
                    placeholder="Votre email (optionnel)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
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
              className="flex-1 py-3 px-6 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStep3Valid || submitting}
              className="flex-1 py-3 px-6 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {submitting ? 'Envoi en cours...' : 'Publier le signalement'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemReportForm;

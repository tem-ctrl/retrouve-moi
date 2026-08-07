import Image from 'next/image';
import React, { useState } from 'react';

import { MissingPerson } from '@/types';

import {
  XIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  ShareIcon,
  UserIcon,
  InfoIcon,
  ClockIcon,
} from './icons/Icons';
import StatusBadge from './ui/StatusBadge';

interface PersonDetailModalProps {
  person: MissingPerson;
  onClose: () => void;
}

const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ person, onClose }) => {
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [sightingData, setSightingData] = useState({
    reporter_name: '',
    reporter_phone: '',
    location: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Personne disparue: ${person.full_name}`,
      text: `Aidez-nous à retrouver ${person.full_name}, ${person.age} ans, disparu(e) à ${person.last_seen_location}. Dernière vue le ${formatDate(person.last_seen_date)}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Lien copié dans le presse-papier!');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${person.contact_phone}`;
  };

  const handleSightingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/sightings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          missingPersonId: person.id,
          reporter_name: sightingData.reporter_name,
          reporter_phone: sightingData.reporter_phone,
          location: sightingData.location,
          description: sightingData.description,
          sightingDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit sighting');
      }

      setSubmitted(true);
      setTimeout(() => {
        setShowSightingForm(false);
        setSubmitted(false);
        setSightingData({ reporter_name: '', reporter_phone: '', location: '', description: '' });
      }, 2000);
    } catch (error) {
      console.error('Error submitting sighting:', error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">Détails du signalement</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Photo and Status */}
          <div className="relative h-64 sm:h-80 mb-6">
            <Image
              src={person.photo_url}
              alt={person.full_name}
              fill
              sizes="(max-width: 640px) 100vw, 42rem"
              className="object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={person.status} is_urgent={person.is_urgent} />
            </div>
          </div>

          {/* Name and Basic Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{person.full_name}</h1>
            <p className="text-gray-600">
              {person.age} ans • {person.gender}
            </p>
          </div>

          {/* Location and Date */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPinIcon size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Dernière localisation</p>
                <p className="text-gray-600">
                  {person.last_seen_location}, {person.region}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarIcon size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Date de disparition</p>
                <p className="text-gray-600">{formatDate(person.last_seen_date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Signalé le</p>
                <p className="text-gray-600">{formatDate(person.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <InfoIcon size={18} className="text-orange-500" />
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{person.description}</p>
          </div>

          {/* Physical Description */}
          {(person.height || person.distinctive_signs || person.clothing_description) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon size={18} className="text-orange-500" />
                Signes distinctifs
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {person.height && (
                  <p className="text-gray-600">
                    <span className="font-medium">Taille:</span> {person.height}
                  </p>
                )}
                {person.distinctive_signs && (
                  <p className="text-gray-600">
                    <span className="font-medium">Signes particuliers:</span>{' '}
                    {person.distinctive_signs}
                  </p>
                )}
                {person.clothing_description && (
                  <p className="text-gray-600">
                    <span className="font-medium">Vêtements:</span> {person.clothing_description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleCall}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
            >
              <PhoneIcon size={20} />
              Appeler le contact
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <ShareIcon size={18} />
                Partager
              </button>

              <button
                onClick={() => setShowSightingForm(!showSightingForm)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                J&apos;ai des infos
              </button>
            </div>
          </div>

          {/* Sighting Form */}
          {showSightingForm && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Signaler une observation</h3>

              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-green-700 font-medium">Merci pour votre signalement!</p>
                </div>
              ) : (
                <form onSubmit={handleSightingSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={sightingData.reporter_name}
                    onChange={(e) =>
                      setSightingData({ ...sightingData, reporter_name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Votre téléphone"
                    value={sightingData.reporter_phone}
                    onChange={(e) =>
                      setSightingData({ ...sightingData, reporter_phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Lieu de l'observation"
                    value={sightingData.location}
                    onChange={(e) => setSightingData({ ...sightingData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <textarea
                    placeholder="Décrivez ce que vous avez vu..."
                    value={sightingData.description}
                    onChange={(e) =>
                      setSightingData({ ...sightingData, description: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
            <p className="text-gray-600 flex items-center gap-2">
              <PhoneIcon size={16} className="text-orange-500" />
              {person.contact_phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailModal;

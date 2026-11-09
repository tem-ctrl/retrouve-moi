import { Download } from 'lucide-react';
import Image from 'next/image';
import { FC, useState, SubmitEvent } from 'react';

import { ROUTES } from '@/lib/routes';
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

const PersonDetailModal: FC<PersonDetailModalProps> = ({ person, onClose }) => {
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
      // Canonical detail URL: this modal is also opened from the home page.
      url: `${window.location.origin}${ROUTES.missingPersons.byId(person.id)}`,
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

  const handleSightingSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Détails du signalement</h2>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
          <XIcon size={24} className="text-muted-foreground" />
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
          <h1 className="text-2xl font-bold text-foreground mb-2">{person.full_name}</h1>
          <p className="text-subtle">
            {person.age} ans • {person.gender}
          </p>
        </div>

        {/* Location and Date */}
        <div className="bg-muted rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <MapPinIcon size={20} className="text-primary-ink shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Dernière localisation</p>
              <p className="text-subtle">
                {person.last_seen_location}, {person.region}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarIcon size={20} className="text-primary-ink shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Date de disparition</p>
              <p className="text-subtle">{formatDate(person.last_seen_date)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon size={20} className="text-primary-ink shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Signalé le</p>
              <p className="text-subtle">{formatDate(person.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <InfoIcon size={18} className="text-primary-ink" />
            Description
          </h3>
          <p className="text-subtle leading-relaxed">{person.description}</p>
        </div>

        {/* Physical Description */}
        {(person.height || person.distinctive_signs || person.clothing_description) && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserIcon size={18} className="text-primary-ink" />
              Signes distinctifs
            </h3>
            <div className="bg-muted rounded-xl p-4 space-y-2">
              {person.height && (
                <p className="text-subtle">
                  <span className="font-medium">Taille:</span> {person.height}
                </p>
              )}
              {person.distinctive_signs && (
                <p className="text-subtle">
                  <span className="font-medium">Signes particuliers:</span>{' '}
                  {person.distinctive_signs}
                </p>
              )}
              {person.clothing_description && (
                <p className="text-subtle">
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
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors"
          >
            <PhoneIcon size={20} />
            Appeler le contact
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted-strong text-subtle rounded-xl font-medium transition-colors"
            >
              <ShareIcon size={18} />
              Partager
            </button>

            <button
              onClick={() => setShowSightingForm(!showSightingForm)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-info hover:bg-info-hover text-white rounded-xl font-medium transition-colors"
            >
              J&apos;ai des infos
            </button>
          </div>

          <a
            href={`${ROUTES.missingPersons.poster(person.id)}?download=1`}
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border hover:bg-muted text-subtle rounded-xl font-medium transition-colors"
          >
            <Download size={18} aria-hidden />
            Télécharger l&apos;affiche
          </a>
        </div>

        {/* Sighting Form */}
        {showSightingForm && (
          <div className="bg-info-soft rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Signaler une observation</h3>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-success-ink"
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
                <p className="text-success-ink font-medium">Merci pour votre signalement!</p>
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
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-info focus:border-info outline-none"
                />
                <input
                  type="tel"
                  placeholder="Votre téléphone"
                  value={sightingData.reporter_phone}
                  onChange={(e) =>
                    setSightingData({ ...sightingData, reporter_phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-info focus:border-info outline-none"
                />
                <input
                  type="text"
                  placeholder="Lieu de l'observation"
                  value={sightingData.location}
                  onChange={(e) => setSightingData({ ...sightingData, location: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-info focus:border-info outline-none"
                />
                <textarea
                  placeholder="Décrivez ce que vous avez vu..."
                  value={sightingData.description}
                  onChange={(e) =>
                    setSightingData({ ...sightingData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-info focus:border-info outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-info hover:bg-info-hover disabled:bg-info text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-muted rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-2">Contact</h3>
          <p className="text-subtle flex items-center gap-2">
            <PhoneIcon size={16} className="text-primary-ink" />
            {person.contact_phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailModal;

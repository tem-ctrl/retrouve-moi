import { Download } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { ROUTES } from '@/lib/routes';
import { LostItem } from '@/types';

import {
  XIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  TagIcon,
  ShareIcon,
} from './icons/Icons';

interface ItemDetailModalProps {
  item: LostItem;
  onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (item.report_type === 'found') {
      return (
        <span className="px-4 py-1.5 bg-success-soft text-success-ink text-sm font-semibold rounded-full">
          Trouvé
        </span>
      );
    }
    if (item.status === 'claimed') {
      return (
        <span className="px-4 py-1.5 bg-info-soft text-info-ink text-sm font-semibold rounded-full">
          Réclamé
        </span>
      );
    }
    if (item.is_urgent) {
      return (
        <span className="px-4 py-1.5 bg-danger-soft text-danger-ink text-sm font-semibold rounded-full animate-pulse">
          Urgent
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 bg-primary-soft text-primary-ink text-sm font-semibold rounded-full">
        Perdu
      </span>
    );
  };

  const getItemTypeLabel = () => {
    switch (item.item_type) {
      case 'document':
        return 'Document';
      case 'object':
        return 'Objet';
      case 'animal':
        return 'Animal';
      case 'vehicle':
        return 'Véhicule';
      default:
        return 'Autre';
    }
  };

  const defaultImage =
    item.item_type === 'document'
      ? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      : item.item_type === 'object'
        ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
        : item.item_type === 'animal'
          ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop'
          : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop';

  const handleShare = async () => {
    const shareData = {
      title: `${item.report_type === 'found' ? 'Trouvé' : 'Perdu'}: ${item.item_name}`,
      text: `${item.item_name} - ${item.location}, ${item.region}. ${item.description}`,
      // Canonical detail URL: this modal is also opened from list pages.
      url: `${window.location.origin}${ROUTES.lostItems.byId(item.id)}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('Lien copié dans le presse-papier!');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${item.contact_phone}`;
  };

  const handleEmail = () => {
    if (item.contact_email) {
      window.location.href = `mailto:${item.contact_email}?subject=${encodeURIComponent(`À propos de: ${item.item_name}`)}`;
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <span className="px-3 py-1 bg-muted text-subtle text-sm rounded-full">
            {getItemTypeLabel()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Partager"
          >
            <ShareIcon size={20} className="text-muted-foreground" />
          </button>
          <a
            href={`${ROUTES.lostItems.poster(item.id)}?download=1`}
            download
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Télécharger l'affiche"
            aria-label="Télécharger l'affiche"
          >
            <Download size={20} className="text-muted-foreground" aria-hidden />
          </a>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <XIcon size={24} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Image */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <Image
            src={item.photo_url || defaultImage}
            alt={item.item_name}
            fill
            sizes="(max-width: 640px) 100vw, 42rem"
            className="object-cover"
          />
        </div>

        {/* Item Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{item.item_name}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-item-soft text-item-ink text-sm rounded-full">
              {item.item_category}
            </span>
            {item.brand && (
              <span className="px-3 py-1 bg-muted text-subtle text-sm rounded-full">
                {item.brand}
              </span>
            )}
            {item.color && (
              <span className="px-3 py-1 bg-muted text-subtle text-sm rounded-full">
                {item.color}
              </span>
            )}
          </div>
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
            <MapPinIcon size={20} className="text-item-ink mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Lieu</div>
              <div className="font-medium text-foreground">{item.location}</div>
              <div className="text-sm text-subtle">{item.region}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
            <CalendarIcon size={20} className="text-item-ink mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">
                Date {item.report_type === 'found' ? 'de découverte' : 'de perte'}
              </div>
              <div className="font-medium text-foreground">{formatDate(item.date_lost_found)}</div>
            </div>
          </div>
        </div>

        {/* Reward */}
        {item.reward && (
          <div className="flex items-center gap-3 p-4 bg-success-soft rounded-xl mb-6">
            <TagIcon size={20} className="text-success-ink" />
            <div>
              <div className="text-sm text-success-ink">Récompense offerte</div>
              <div className="font-bold text-success-ink">{item.reward}</div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-subtle leading-relaxed">{item.description}</p>
        </div>

        {/* Document specific info */}
        {item.item_type === 'document' && (item.document_number || item.owner_name) && (
          <div className="mb-6 p-4 bg-info-soft rounded-xl">
            <h3 className="font-semibold text-info-ink mb-3">Informations du document</h3>
            <div className="space-y-2">
              {item.owner_name && (
                <div className="flex justify-between">
                  <span className="text-info-ink">Nom sur le document:</span>
                  <span className="font-medium text-info-ink">{item.owner_name}</span>
                </div>
              )}
              {item.document_number && (
                <div className="flex justify-between">
                  <span className="text-info-ink">Numéro:</span>
                  <span className="font-medium text-info-ink">{item.document_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reporter Info */}
        <div className="mb-6 p-4 bg-muted rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">Signalé par</h3>
          <div className="text-subtle">
            <div className="font-medium">{item.reporter_name}</div>
            <div className="text-sm">Signalé le {formatDate(item.created_at)}</div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-item hover:bg-item-hover text-white rounded-xl font-medium transition-colors"
          >
            <PhoneIcon size={20} />
            Appeler
          </button>
          {item.contact_email && (
            <button
              onClick={handleEmail}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-muted hover:bg-muted-strong text-subtle rounded-xl font-medium transition-colors"
            >
              <MailIcon size={20} />
              Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;

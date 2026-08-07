import Image from 'next/image';
import React from 'react';

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
        <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
          Trouvé
        </span>
      );
    }
    if (item.status === 'claimed') {
      return (
        <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
          Réclamé
        </span>
      );
    }
    if (item.is_urgent) {
      return (
        <span className="px-4 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full animate-pulse">
          Urgent
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
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
      url: window.location.href,
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {getItemTypeLabel()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Partager"
            >
              <ShareIcon size={20} className="text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XIcon size={24} className="text-gray-500" />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.item_name}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                {item.item_category}
              </span>
              {item.brand && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {item.brand}
                </span>
              )}
              {item.color && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {item.color}
                </span>
              )}
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPinIcon size={20} className="text-purple-500 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Lieu</div>
                <div className="font-medium text-gray-900">{item.location}</div>
                <div className="text-sm text-gray-600">{item.region}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <CalendarIcon size={20} className="text-purple-500 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">
                  Date {item.report_type === 'found' ? 'de découverte' : 'de perte'}
                </div>
                <div className="font-medium text-gray-900">{formatDate(item.date_lost_found)}</div>
              </div>
            </div>
          </div>

          {/* Reward */}
          {item.reward && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl mb-6">
              <TagIcon size={20} className="text-green-600" />
              <div>
                <div className="text-sm text-green-600">Récompense offerte</div>
                <div className="font-bold text-green-700">{item.reward}</div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>

          {/* Document specific info */}
          {item.item_type === 'document' && (item.document_number || item.owner_name) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Informations du document</h3>
              <div className="space-y-2">
                {item.owner_name && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Nom sur le document:</span>
                    <span className="font-medium text-blue-900">{item.owner_name}</span>
                  </div>
                )}
                {item.document_number && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Numéro:</span>
                    <span className="font-medium text-blue-900">{item.document_number}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reporter Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Signalé par</h3>
            <div className="text-gray-600">
              <div className="font-medium">{item.reporter_name}</div>
              <div className="text-sm">Signalé le {formatDate(item.created_at)}</div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
            >
              <PhoneIcon size={20} />
              Appeler
            </button>
            {item.contact_email && (
              <button
                onClick={handleEmail}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <MailIcon size={20} />
                Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;

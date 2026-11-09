import Image from 'next/image';
import React from 'react';

import {
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  ArrowRightIcon,
  TagIcon,
} from '@/components/icons/Icons';
import { LostItem } from '@/types';

interface ItemCardProps {
  item: LostItem;
  onViewDetails: (item: LostItem) => void;
  onContact: (phone: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails, onContact }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getItemTypeIcon = () => {
    switch (item.item_type) {
      case 'document':
        return (
          <svg
            className="w-8 h-8 text-info-ink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'object':
        return (
          <svg
            className="w-8 h-8 text-item-ink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case 'animal':
        return (
          <svg
            className="w-8 h-8 text-warning-ink"
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
        );
      case 'vehicle':
        return (
          <svg
            className="w-8 h-8 text-muted-foreground"
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
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-muted-foreground"
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
        );
    }
  };

  const getStatusBadge = () => {
    if (item.report_type === 'found') {
      return (
        <span className="px-3 py-1 bg-success-soft text-success-ink text-xs font-semibold rounded-full">
          Trouvé
        </span>
      );
    }
    if (item.status === 'claimed') {
      return (
        <span className="px-3 py-1 bg-info-soft text-info-ink text-xs font-semibold rounded-full">
          Réclamé
        </span>
      );
    }
    if (item.is_urgent) {
      return (
        <span className="px-3 py-1 bg-danger-soft text-danger-ink text-xs font-semibold rounded-full animate-pulse">
          Urgent
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-primary-soft text-primary-ink text-xs font-semibold rounded-full">
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
      ? 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
      : item.item_type === 'object'
        ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
        : item.item_type === 'animal'
          ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'
          : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';

  return (
    <div className="bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border group">
      <div className="relative h-48">
        <Image
          src={item.photo_url || defaultImage}
          alt={item.item_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">{getStatusBadge()}</div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
          {getItemTypeIcon()}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1">{item.item_name}</h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-muted text-subtle text-xs rounded-full">
            {getItemTypeLabel()}
          </span>
          <span className="px-2 py-0.5 bg-muted text-subtle text-xs rounded-full">
            {item.item_category}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-subtle text-sm">
            <MapPinIcon size={16} className="mr-2 text-primary-ink flex-shrink-0" />
            <span className="truncate">
              {item.location}, {item.region}
            </span>
          </div>

          <div className="flex items-center text-subtle text-sm">
            <CalendarIcon size={16} className="mr-2 text-primary-ink flex-shrink-0" />
            <span>{formatDate(item.date_lost_found)}</span>
          </div>

          {item.reward && (
            <div className="flex items-center text-success-ink text-sm font-medium">
              <TagIcon size={16} className="mr-2 flex-shrink-0" />
              <span>Récompense: {item.reward}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted-strong text-subtle rounded-lg transition-colors text-sm font-medium"
          >
            Voir détails
            <ArrowRightIcon size={16} />
          </button>

          <button
            onClick={() => onContact(item.contact_phone)}
            className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
            title="Appeler"
          >
            <PhoneIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

import { AlertTriangle, CircleDot, Check, Search } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
  status: 'missing' | 'found' | 'searching' | 'urgent';
  is_urgent?: boolean;
}

// Status is always shown as colour + icon + word, never colour alone (see ui/BRAND.md).
const CONFIG = {
  found: {
    label: 'Retrouvé',
    Icon: Check,
    className: 'bg-success-soft text-success-ink border-success-line',
  },
  searching: {
    label: 'En cours de recherche',
    Icon: Search,
    className: 'bg-info-soft text-info-ink border-info-line',
  },
  missing: {
    label: 'Disparu',
    Icon: CircleDot,
    className: 'bg-danger-soft text-danger-ink border-danger-line',
  },
} as const;

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, is_urgent }) => {
  const config = status === 'found' || status === 'searching' ? CONFIG[status] : CONFIG.missing;
  const { Icon } = config;

  return (
    <div className="flex gap-2 flex-wrap">
      {is_urgent && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger text-white border border-danger">
          <AlertTriangle size={12} aria-hidden />
          Urgent
        </span>
      )}
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
      >
        <Icon size={12} aria-hidden />
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;

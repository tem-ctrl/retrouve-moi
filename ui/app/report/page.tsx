'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { mutate } from 'swr';

import ItemReportForm from '@/components/ItemReportForm';
import ReportForm from '@/components/ReportForm';
import SuccessModal from '@/components/SuccessModal';
import { lostItemKeys, missingPersonKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/lib/routes';

type ReportType = 'person' | 'item';

function ReportTabs({
  active,
  onSelect,
}: {
  active: ReportType;
  onSelect: (tab: ReportType) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onSelect('person')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          active === 'person'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Personne disparue
      </button>
      <button
        type="button"
        onClick={() => onSelect('item')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          active === 'item'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Objet perdu/trouvé
      </button>
    </div>
  );
}

// useSearchParams() below requires a Suspense boundary during static
// prerendering — same pattern as app/page.tsx's Home/HomeContent split.
export default function Report() {
  return (
    <Suspense fallback={null}>
      <ReportContent />
    </Suspense>
  );
}

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTab: ReportType = searchParams.get('type') === 'item' ? 'item' : 'person';

  const selectTab = (tab: ReportType) => {
    router.replace(ROUTES.report(tab === 'item' ? 'item' : undefined));
  };

  const handlePersonSuccess = () => {
    mutate(missingPersonKeys.matchesAnyKey);
    setShowSuccess(true);
  };

  const handleItemSuccess = () => {
    mutate(lostItemKeys.matchesAnyKey);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessModal onClose={() => router.push(ROUTES.home)} />;
  }

  const tabs = <ReportTabs active={activeTab} onSelect={selectTab} />;

  return activeTab === 'item' ? (
    <ItemReportForm
      tabs={tabs}
      onClose={() => router.push(ROUTES.home)}
      onSuccess={handleItemSuccess}
    />
  ) : (
    <ReportForm
      tabs={tabs}
      onClose={() => router.push(ROUTES.home)}
      onSuccess={handlePersonSuccess}
    />
  );
}

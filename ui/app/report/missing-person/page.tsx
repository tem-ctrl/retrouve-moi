'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mutate } from 'swr';

import ReportForm from '@/components/ReportForm';
import SuccessModal from '@/components/SuccessModal';
import { missingPersonKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/lib/routes';

export default function ReportMissingPerson() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    mutate(missingPersonKeys.matchesAnyKey);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessModal onClose={() => router.push(ROUTES.home)} />;
  }

  return <ReportForm onClose={() => router.push(ROUTES.home)} onSuccess={handleSuccess} />;
}

'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';

import ItemDetailModal from '@/components/ItemDetailModal';
import { useLostItem } from '@/hooks/api/useLostItem';

// Intercepted variant of app/lost-items/[id]/page.tsx — see
// app/@modal/(.)missing-persons/[id]/page.tsx for why this exists.
export default function InterceptedLostItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading } = useLostItem(id);

  if (isLoading || !item) {
    return null;
  }

  return <ItemDetailModal item={item} onClose={() => router.back()} />;
}

'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';

import ItemDetailModal from '@/components/ItemDetailModal';
import { useLostItem } from '@/hooks/api/useLostItem';
import { ROUTES } from '@/lib/routes';

export default function LostItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading } = useLostItem(id);

  if (isLoading || !item) {
    return null;
  }

  return <ItemDetailModal item={item} onClose={() => router.push(ROUTES.home)} />;
}

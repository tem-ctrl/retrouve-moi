'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import AppLayout from '@/components/AppLayout';
import ItemDetailModal from '@/components/ItemDetailModal';
import { useLostItem } from '@/hooks/api/useLostItem';
import { ROUTES } from '@/lib/routes';

export default function LostItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading } = useLostItem(id);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ) : item ? (
          <ItemDetailModal item={item} onClose={() => router.back()} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h1 className="text-lg font-semibold text-gray-900 mb-2">Objet introuvable</h1>
            <p className="text-gray-500 mb-6">Ce signalement n&apos;existe pas ou plus.</p>
            <Link
              href={ROUTES.lostItems.list}
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

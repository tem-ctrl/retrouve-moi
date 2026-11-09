import React from 'react';

import { CheckCircleIcon, XIcon } from './icons/Icons';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl p-6 text-center animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <XIcon size={20} className="text-muted-foreground" />
        </button>

        <div className="w-20 h-20 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon size={48} className="text-success-ink" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Signalement envoyé!</h2>

        <p className="text-subtle mb-6">
          Votre signalement a été publié avec succès. Il est maintenant visible par tous les
          utilisateurs de la plateforme.
        </p>

        <div className="bg-info-soft rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-info-ink mb-2">Prochaines étapes:</h3>
          <ul className="text-sm text-info-ink space-y-1">
            <li>• Partagez l&apos;annonce sur les réseaux sociaux</li>
            <li>• Contactez les autorités locales</li>
            <li>• Informez vos proches et voisins</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

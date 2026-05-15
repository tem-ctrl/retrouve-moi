import React from 'react';
import { CheckCircleIcon, XIcon } from './icons/Icons';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 text-center animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon size={20} className="text-gray-500" />
        </button>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon size={48} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Signalement envoyé!</h2>
        
        <p className="text-gray-600 mb-6">
          Votre signalement a été publié avec succès. Il est maintenant visible par tous les utilisateurs de la plateforme.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Partagez l'annonce sur les réseaux sociaux</li>
            <li>• Contactez les autorités locales</li>
            <li>• Informez vos proches et voisins</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

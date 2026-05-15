import React from 'react';
import { PlusIcon, SearchIcon, ShareIcon, CheckCircleIcon } from './icons/Icons';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <PlusIcon size={28} className="text-white" />,
      title: 'Signalez',
      description: 'Remplissez le formulaire avec les informations de la personne disparue',
      color: 'bg-orange-500'
    },
    {
      icon: <SearchIcon size={28} className="text-white" />,
      title: 'Recherchez',
      description: 'Consultez les signalements et utilisez les filtres pour trouver des cas',
      color: 'bg-blue-500'
    },
    {
      icon: <ShareIcon size={28} className="text-white" />,
      title: 'Partagez',
      description: 'Diffusez les annonces sur les réseaux sociaux pour maximiser la portée',
      color: 'bg-purple-500'
    },
    {
      icon: <CheckCircleIcon size={28} className="text-white" />,
      title: 'Retrouvez',
      description: 'Signalez toute information utile pour aider à retrouver les disparus',
      color: 'bg-green-500'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Comment ça marche?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre plateforme facilite le signalement et la recherche des personnes disparues en 4 étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gray-200" />
              )}
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative z-10">
                <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

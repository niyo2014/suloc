import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-suloc-blue mb-4">{title}</h1>
        <p className="text-gray-600 text-lg">Mise à jour en cours pour la version Node.js & Vite...</p>
        <div className="mt-12 flex justify-center">
            <div className="h-48 w-full max-w-lg bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium italic">Skeleton Loading...</span>
            </div>
        </div>
    </div>
);

export const Vehicles = () => <PlaceholderPage title="Importation de Véhicules" />;
export const Visa = () => <PlaceholderPage title="Assistance Visa & Immigration" />;
export const Logistics = () => <PlaceholderPage title="Logistique & Transit" />;
export const MoneyTransfer = () => <PlaceholderPage title="Transfert d'argent" />;

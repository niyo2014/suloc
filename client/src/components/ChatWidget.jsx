import React, { useState } from 'react';
import { MessageCircle, X, Info, Car, FileText, Ship, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSystemStatus } from '../context/SystemContext';

const ChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { settings } = useSystemStatus();

    const phoneNumber = settings?.phone ? settings.phone.replace(/[^0-9+]/g, '') : '+25762400920';

    const contactOptions = [
        {
            label: t('chat_opt_general', 'Informations Générales'),
            icon: <Info size={18} className="text-green-600" />,
            message: t('chat_msg_general', "Bonjour! J'aimerais avoir plus d'informations générales sur SULOC.")
        },
        {
            label: t('chat_opt_vehicles', 'Véhicules'),
            icon: <Car size={18} className="text-green-600" />,
            message: t('chat_msg_vehicles', "Bonjour! Je suis intéressé(e) par vos véhicules. Pouvez-vous m'aider?")
        },
        {
            label: t('chat_opt_visa', 'Services Visa'),
            icon: <FileText size={18} className="text-green-600" />,
            message: t('chat_msg_visa', "Bonjour! J'ai besoin d'une assistance pour un service de visa.")
        },
        {
            label: t('chat_opt_logistics', 'Import/Logistique'),
            icon: <Ship size={18} className="text-green-600" />,
            message: t('chat_msg_logistics', "Bonjour! J'aimerais en savoir plus sur vos services d'importation et logistique.")
        },
        {
            label: t('chat_opt_payments', 'Services Paiement'),
            icon: <Banknote size={18} className="text-green-600" />,
            message: t('chat_msg_payments', "Bonjour! J'ai une question concernant vos services de transfert d'argent et paiement.")
        }
    ];

    const handleOptionClick = (message) => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Popup */}
            {isOpen && (
                <div className="mb-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-green-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} fill="currentColor" />
                            <span className="font-bold">{t('chat_title', 'Contactez-nous')}</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-black/10 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Welcome Message */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <div className="bg-white p-3 rounded-lg text-sm text-gray-700 shadow-sm border border-gray-100">
                            {t('chat_welcome', "Bonjour! Comment pouvons-nous vous aider aujourd'hui?")}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="p-4 space-y-2">
                        {contactOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option.message)}
                                className="w-full flex items-center gap-3 p-3 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-xl hover:bg-green-50 transition-all shadow-sm hover:shadow-md text-left"
                            >
                                <span className="p-1.5 bg-green-100 rounded-lg">
                                    {option.icon}
                                </span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                    }`}
                aria-label="Contact support"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;

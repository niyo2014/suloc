import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSystemStatus } from '../context/SystemContext';

const Footer = () => {
    const { t } = useTranslation();
    const { settings } = useSystemStatus();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-suloc-blue-dark text-white/80 py-12 border-t border-suloc-blue-light">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                        <span className="text-suloc-gold">SU</span>LOC
                    </h3>
                    <p className="text-sm leading-relaxed">
                        {t('footer_desc')}
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">{t('footer_contact_title')}</h4>
                    <ul className="text-sm space-y-2">
                        <li>Email: {settings.email || 'ndayiprud@gmail.com'}</li>
                        <li>Phone: {settings.phone || '+257 79 496 117'}</li>
                        <li>Address: {settings.address ? settings.address.split(',')[0] : 'Bujumbura'}</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Legal</h4>
                    <p className="text-xs">NIF: {settings.nif || '4000781700'}</p>
                    <p className="text-xs mt-2">© {currentYear} SULOC Group. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

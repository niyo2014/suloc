import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(nextLang);
    };

    return (
        <header className="bg-suloc-blue text-white shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4">
                    <img
                        src="/logo.jpg"
                        alt="SULOC Logo"
                        className="h-16 w-auto object-contain"
                    />
                    <span className="text-3xl font-bold tracking-tight">
                        <span className="text-suloc-gold">SU</span>LOC
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-7 font-semibold text-lg">
                    <Link to="/" className="hover:text-suloc-gold transition-colors">{t('nav_home')}</Link>
                    <Link to="/vehicles" className="hover:text-suloc-gold transition-colors">{t('nav_vehicles')}</Link>
                    <Link to="/visa" className="hover:text-suloc-gold transition-colors">{t('nav_visa')}</Link>
                    <Link to="/visa-assistance" className="hover:text-suloc-gold transition-colors">{t('nav_visa_assistance')}</Link>
                    <Link to="/logistics" className="hover:text-suloc-gold transition-colors">{t('nav_logistics')}</Link>
                    <Link to="/money-transfer" className="hover:text-suloc-gold transition-colors">{t('nav_payments')}</Link>
                    <a href="/#contact" className="hover:text-suloc-gold transition-colors">{t('nav_contact')}</a>

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                            <Link to="/admin" className="text-suloc-gold hover:text-white transition-colors flex items-center gap-1.5">
                                <UserIcon size={18} />
                                <span>{t('nav_dashboard')}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-white hover:text-red-400 transition-colors flex items-center gap-1.5"
                                title={t('nav_logout')}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hover:text-suloc-gold transition-colors">{t('nav_login')}</Link>
                    )}

                    <a
                        href="/#contact"
                        className="bg-suloc-gold text-suloc-blue px-7 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-md text-base"
                    >
                        {t('nav_buy')}
                    </a>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 bg-suloc-blue-light px-5 py-2.5 rounded border border-white/30 text-base font-bold hover:bg-suloc-blue-dark transition-all"
                        title={i18n.language === 'fr' ? 'Switch to English' : 'Passer au Français'}
                    >
                        <Globe size={18} />
                        {i18n.language.toUpperCase()}
                    </button>
                </nav>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-suloc-blue-dark border-t border-suloc-blue-light animate-in fade-in slide-in-from-top-4 duration-300">
                    <nav className="flex flex-col p-6 gap-4 font-medium">
                        <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_home')}</Link>
                        <Link to="/vehicles" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_vehicles')}</Link>
                        <Link to="/visa" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_visa')}</Link>
                        <Link to="/visa-assistance" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_visa_assistance')}</Link>
                        <Link to="/logistics" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_logistics')}</Link>
                        <Link to="/money-transfer" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_payments')}</Link>
                        <a href="/#contact" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_contact')}</a>

                        {user ? (
                            <>
                                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-suloc-gold hover:text-white transition-colors flex items-center gap-2">
                                    <UserIcon size={18} />
                                    <span>{t('nav_dashboard')} (Admin)</span>
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="text-white hover:text-red-400 transition-colors flex items-center gap-2 text-left"
                                >
                                    <LogOut size={18} />
                                    <span>{t('nav_logout')}</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-suloc-gold transition-colors">{t('nav_login')}</Link>
                        )}

                        <a
                            href="/#contact"
                            onClick={() => setIsOpen(false)}
                            className="bg-suloc-gold text-suloc-blue px-5 py-2.5 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-md text-center"
                        >
                            {t('nav_buy')}
                        </a>
                        <button
                            onClick={() => { toggleLanguage(); setIsOpen(false); }}
                            className="flex items-center gap-2 text-suloc-gold border border-suloc-gold px-4 py-2 rounded-lg hover:bg-suloc-gold hover:text-suloc-blue transition-all"
                        >
                            <Globe size={18} />
                            {i18n.language === 'fr' ? 'Switch to English' : 'Passer au Français'}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

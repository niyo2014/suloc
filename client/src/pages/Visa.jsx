const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


const Visa = () => {
    const { t, i18n } = useTranslation();
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState({});

    const isEn = i18n.language === 'en';

    useEffect(() => {
        fetchVisas();
    }, []);

    const fetchVisas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/visas`);
            setVisas(response.data);
        } catch (error) {
            console.error('Error fetching visas:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (id, section) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${id}-${section}`]: !prev[`${id}-${section}`]
        }));
    };

    const filteredVisas = visas.filter(visa => {
        const countryName = isEn
            ? (visa.country_name_en || visa.country_name_fr)
            : visa.country_name_fr;
        return countryName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const whatsappPhone = "25762400920"; // Matches the previous logic

    return (
        <div className="font-sans">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --primary-navy: #003366;
                    --accent-gold: #C5A059;
                }

                .visa-header {
                    background: linear-gradient(rgba(0, 51, 102, 0.9), rgba(0, 51, 102, 0.9)), url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                }

                .search-container {
                    max-width: 600px;
                    margin: -30px auto 40px;
                    position: relative;
                    z-index: 10;
                }

                .search-input {
                    width: 100%;
                    padding: 18px 25px 18px 55px;
                    border-radius: 50px;
                    border: none;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    font-size: 1.1rem;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    box-shadow: 0 10px 30px rgba(197, 160, 89, 0.2);
                    transform: translateY(-2px);
                }

                .search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--accent-gold);
                    font-size: 1.2rem;
                }

                .visa-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 25px;
                }

                .visa-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .visa-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }

                .card-header {
                    background: var(--primary-navy);
                    padding: 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-header h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                }

                .tariff-badge {
                    background: var(--accent-gold);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 30px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }

                .card-body {
                    padding: 20px;
                    flex-grow: 1;
                }

                .info-section {
                    margin-bottom: 20px;
                }

                .info-label {
                    color: var(--primary-navy);
                    font-weight: 700;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }

                .info-label i {
                    margin-right: 8px;
                    color: var(--accent-gold);
                }

                .info-content {
                    font-size: 0.95rem;
                    color: #555;
                    line-height: 1.6;
                    position: relative;
                    max-height: 80px;
                    overflow: hidden;
                    transition: max-height 0.5s ease;
                }

                .info-content.expanded {
                    max-height: 1000px;
                }

                .toggle-btn {
                    color: var(--accent-gold);
                    background: transparent;
                    border: none;
                    font-weight: 700;
                    font-size: 0.85rem;
                    padding: 0;
                    cursor: pointer;
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                }

                .toggle-btn:hover {
                    text-decoration: underline;
                }

                .card-footer {
                    padding: 20px;
                    border-top: 1px solid #f5f5f5;
                }

                .btn-whatsapp {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #25D366;
                    color: white;
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: background 0.3s;
                }

                .btn-whatsapp:hover {
                    background: #128C7E;
                }

                .btn-whatsapp i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
            ` }} />

            {/* Header Section */}
            <header className="visa-hero" style={{
                backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop')`,
                backgroundColor: '#003366'
            }}>
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('nav_visa', 'Services Visa & Immigration')}
                    </h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        {t('visa_page_subtitle', 'Votre partenaire de confiance pour simplifier vos démarches de voyage.')}
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-6 mb-20">
                {/* Search Bar */}
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t('visa_search_placeholder', 'Rechercher un pays (ex: Dubaï, Chine...)')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grid */}
                <div className="visa-grid">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366] mx-auto"></div>
                        </div>
                    ) : (
                        filteredVisas.map(visa => {
                            const countryName = i18n.language === 'en' ? (visa.country_name_en || visa.country_name_fr) : visa.country_name_fr;
                            const requirements = i18n.language === 'en' ? (visa.requirements_en || visa.requirements_fr) : visa.requirements_fr;
                            const documents = i18n.language === 'en' ? (visa.documents_needed_en || visa.documents_needed_fr) : visa.documents_needed_fr;

                            const fee = visa.service_fee !== null
                                ? new Intl.NumberFormat().format(visa.service_fee) + ' ' + (visa.currency || 'USD')
                                : t('visa_on_request', 'Sur demande');

                            const waMessage = encodeURIComponent(
                                t('visa_wa_msg', 'Bonjour SULOC, je souhaite des informations sur le visa pour {country}.').replace('{country}', countryName)
                            );

                            return (
                                <div key={visa.id} className="visa-card">
                                    <div className="card-header">
                                        <h3>{countryName}</h3>
                                        <span className="tariff-badge">{fee}</span>
                                    </div>

                                    <div className="card-body">
                                        {/* Requirements */}
                                        <div className="info-section">
                                            <h4 className="info-label"><i className="fas fa-info-circle"></i> {t('visa_requirements_label', 'Conditions')}</h4>
                                            <div className={`info-content ${expandedSections[`${visa.id}-req`] ? 'expanded' : ''}`}>
                                                {requirements}
                                            </div>
                                            <button
                                                className="toggle-btn"
                                                onClick={() => toggleSection(visa.id, 'req')}
                                            >
                                                <span>
                                                    {expandedSections[`${visa.id}-req`] ? `- ${t('visa_show_less', 'Voir moins')}` : `+ ${t('visa_show_more', 'Voir plus')}`}
                                                </span>
                                            </button>
                                        </div>

                                        {/* Documents */}
                                        <div className="info-section">
                                            <h4 className="info-label"><i className="fas fa-file-alt"></i> {t('visa_documents_label', 'Documents Requis')}</h4>
                                            <div className={`info-content ${expandedSections[`${visa.id}-doc`] ? 'expanded' : ''}`}>
                                                {documents}
                                            </div>
                                            <button
                                                className="toggle-btn"
                                                onClick={() => toggleSection(visa.id, 'doc')}
                                            >
                                                <span>
                                                    {expandedSections[`${visa.id}-doc`] ? `- ${t('visa_show_less', 'Voir moins')}` : `+ ${t('visa_show_more', 'Voir plus')}`}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <a href={`https://wa.me/${whatsappPhone}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                                            <i className="fab fa-whatsapp"></i> {t('home_contact_whatsapp', 'WhatsApp')}
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Visa;

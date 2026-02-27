const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api$/, '');
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


const VisaAssistance = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        origin_country: '',
        destination_country: '',
        visa_type: 'tourist',
        departure_date: '',
        duration_stay: '',
        travel_purpose: ''
    });

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles].slice(0, 10));
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        files.forEach(file => {
            data.append('documents', file);
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/api/visas/assistance`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setStatus({ type: 'success', message: response.data.message });
                setFormData({
                    full_name: '',
                    email: '',
                    phone: '',
                    origin_country: '',
                    destination_country: '',
                    visa_type: 'tourist',
                    departure_date: '',
                    duration_stay: '',
                    travel_purpose: ''
                });
                setFiles([]);
            }
        } catch (error) {
            console.error('Error submitting visa request:', error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || t('visa_assistance_error', 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.')
            });
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: t('visa_assistance_step1_title', 'Soumission de la demande'), desc: t('visa_assistance_step1_desc', 'Remplissez le formulaire en ligne avec vos informations de base.') },
        { id: 2, title: t('visa_assistance_step2_title', 'Analyse du profil'), desc: t('visa_assistance_step2_desc', 'Un agent analyse votre situation selon le type de visa demandé.') },
        { id: 3, title: t('visa_assistance_step3_title', 'Constitution du dossier'), desc: t('visa_assistance_step3_desc', 'Nous vous fournissons la liste des documents et vérifions leur validité.') },
        { id: 4, title: t('visa_assistance_step4_title', 'Dépôt & Suivi'), desc: t('visa_assistance_step4_desc', 'Accompagnement pour le rendez-vous et suivi de l\'avancement.') },
        { id: 5, title: t('visa_assistance_step5_title', 'Réponse de l\'Ambassade'), desc: t('visa_assistance_step5_desc', 'Communication du résultat final (Acceptation ou Refus).') }
    ];

    return (
        <div className="font-sans antialiased">
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-navy-suloc { background-color: #003366; }
                .text-navy-suloc { color: #003366; }
                .bg-gold-suloc { background-color: #C5A059; }
                .text-gold-suloc { color: #C5A059; }
                .border-gold-suloc { border-color: #C5A059; }
            ` }} />

            {/* Hero Section */}
            <section className="bg-navy-suloc text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('visa_assistance_title', 'Assistance Visa Professionnelle')}</h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
                        {t('visa_assistance_desc', 'Nous vous accompagnons dans chaque étape de votre demande de visa pour maximiser vos chances de succès.')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#request-form" className="bg-gold-suloc text-white px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition shadow-xl">
                            {t('visa_assistance_btn_request', 'Demander une assistance')}
                        </a>
                        <a href="/visa" className="bg-white text-navy-suloc px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                            {t('visa_assistance_btn_pricing', 'Consulter les tarifs')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Service & Process */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-navy-suloc mb-6">{t('visa_assistance_expertise_title', 'Notre expertise à votre service')}</h2>
                            <p className="text-gray-700 text-lg mb-6">
                                {t('visa_assistance_expertise_desc', "SULOC propose un service d'assistance complet pour la préparation de vos dossiers de visa. Notre rôle est de vous guider, de vérifier vos documents et de vous conseiller sur les meilleures pratiques pour votre destination.")}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-gold-suloc p-2 rounded-lg mr-4 mt-1">
                                        <i className="fas fa-check text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-suloc">{t('visa_assistance_feat1_title', 'Préparation documentaire')}</h4>
                                        <p className="text-gray-600">{t('visa_assistance_feat1_desc', 'Liste exhaustive et vérification de conformité de chaque pièce du dossier.')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-gold-suloc p-2 rounded-lg mr-4 mt-1">
                                        <i className="fas fa-check text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-suloc">{t('visa_assistance_feat2_title', 'Vérification & Correction')}</h4>
                                        <p className="text-gray-600">{t('visa_assistance_feat2_desc', 'Relecture minutieuse pour éviter les erreurs administratives courantes.')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-gold-suloc p-2 rounded-lg mr-4 mt-1">
                                        <i className="fas fa-check text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-suloc">{t('visa_assistance_feat3_title', 'Accompagnement personnalisé')}</h4>
                                        <p className="text-gray-600">{t('visa_assistance_feat3_desc', 'Suivi étape par étape jusqu\'au dépôt de votre demande.')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-3xl shadow-inner border border-gray-100">
                            <h3 className="text-2xl font-bold text-navy-suloc mb-6">{t('visa_assistance_steps_title', 'Processus en 5 étapes')}</h3>
                            <div className="space-y-8">
                                {steps.map((step, i) => (
                                    <div key={step.id} className="flex relative">
                                        {i < steps.length - 1 && (
                                            <div className="h-full w-0.5 bg-blue-100 absolute left-4 top-8 -bottom-8"></div>
                                        )}
                                        <div className="z-10 bg-navy-suloc text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">{step.id}</div>
                                        <div>
                                            <h5 className="font-bold text-navy-suloc">{step.title}</h5>
                                            <p className="text-sm text-gray-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section id="request-form" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="bg-navy-suloc text-white p-8">
                            <h2 className="text-3xl font-bold mb-2">{t('visa_assistance_btn_request', 'Demander une assistance')}</h2>
                            <p className="opacity-80">{t('visa_assist_form_subtitle', 'Remplissez le formulaire ci-dessous pour démarrer votre procédure.')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-navy-suloc mb-6 flex items-center">
                                    <i className="fas fa-user mr-3 text-gold-suloc"></i> {t('visa_assist_personal_info', 'Informations Personnelles')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_full_name', 'Nom Complet *')}</label>
                                        <input type="text" name="full_name" required value={formData.full_name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_email', 'Email *')}</label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_phone', 'Téléphone (WhatsApp souhaité) *')}</label>
                                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" placeholder="+257 ..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_origin_country', 'Pays d\'origine *')}</label>
                                        <input type="text" name="origin_country" required value={formData.origin_country} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h3 className="text-xl font-bold text-navy-suloc mb-6 flex items-center">
                                    <i className="fas fa-passport mr-3 text-gold-suloc"></i> {t('visa_assist_travel_details', 'Détails du Voyage')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_dest_country', 'Pays de destination *')}</label>
                                        <input type="text" name="destination_country" required value={formData.destination_country} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_type', 'Type de Visa *')}</label>
                                        <select name="visa_type" required value={formData.visa_type} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition">
                                            <option value="tourist">{t('visa_assist_type_tourist', 'Visa Touristique')}</option>
                                            <option value="business">{t('visa_assist_type_business', "Visa d'Affaires")}</option>
                                            <option value="student">{t('visa_assist_type_student', 'Visa Étudiant')}</option>
                                            <option value="work">{t('visa_assist_type_work', 'Visa de Travail')}</option>
                                            <option value="medical">{t('visa_assist_type_medical', 'Visa Médical')}</option>
                                            <option value="transit">{t('visa_assist_type_transit', 'Visa de Transit')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_departure', 'Date prévue de départ')}</label>
                                        <input type="date" name="departure_date" value={formData.departure_date} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_duration', 'Durée du séjour')}</label>
                                        <input type="text" name="duration_stay" value={formData.duration_stay} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition" placeholder="Ex: 15 jours, 3 mois..." />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('visa_assist_purpose', 'Objectif du voyage')}</label>
                                    <textarea name="travel_purpose" rows="3" value={formData.travel_purpose} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold-suloc focus:ring-2 focus:ring-gold-suloc/20 outline-none transition"></textarea>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <h3 className="text-xl font-bold text-navy-suloc mb-6 flex items-center">
                                    <i className="fas fa-file-upload mr-3 text-gold-suloc"></i> {t('visa_assist_docs_title', 'Documents (Optionnel)')}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">{t('visa_assist_docs_desc', 'Vous pouvez joindre des copies de vos documents (Passeport, Invitation, etc.) au format PDF ou JPG.')}</p>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                            <p className="text-sm text-gray-500"><span className="font-semibold">{t('visa_assist_upload_click', 'Cliquez pour téléverser')}</span> {t('visa_assist_upload_drag', 'ou glissez-déposez')}</p>
                                            <p className="text-xs text-gray-400">PDF, JPG (Max 5Mo)</p>
                                        </div>
                                        <input type="file" multiple className="hidden" accept=".pdf,.jpg,.jpeg" onChange={handleFileChange} />
                                    </label>
                                </div>
                                {files.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {files.map((file, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
                                                <i className="fas fa-file mr-2"></i>{file.name}
                                                <button type="button" onClick={() => removeFile(idx)} className="ml-2 hover:text-red-500">
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 border-l-4 border-navy-suloc p-6 rounded-xl">
                                <div className="flex">
                                    <div className="shrink-0">
                                        <i className="fas fa-info-circle text-navy-suloc mt-1"></i>
                                    </div>
                                    <div className="ml-4">
                                        <h5 className="text-sm font-bold text-navy-suloc uppercase tracking-wider mb-2">{t('visa_assistance_legal_title', 'Avertissement Légal')}</h5>
                                        <p className="text-sm text-blue-800 leading-relaxed">
                                            {t('visa_assistance_legal_desc', "SULOC fournit un service d'accompagnement et de préparation de dossier. Nous ne garantissons en aucun cas l'octroi du visa, car la décision finale appartient exclusivement aux autorités consulaires et aux ambassades concernées. Les frais de service perçus par SULOC sont distincts des frais de visa de l'ambassade et ne sont pas remboursables en cas de refus.")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {status.message && (
                                <div className={`p-4 rounded-xl flex items-center ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                                    {status.message}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button type="submit" disabled={loading} className="bg-navy-suloc text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-navy-suloc/90 transition shadow-lg flex items-center disabled:opacity-70">
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-3"></i>
                                            {t('visa_assist_sending', 'Envoi en cours...')}
                                        </>
                                    ) : (
                                        <>
                                            <span>{t('visa_assist_btn_submit', 'Demander une assistance visa')}</span>
                                            <i className="fas fa-paper-plane ml-3"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VisaAssistance;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Ship, Anchor, Package, Check, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import axios from 'axios';

const Logistics = () => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [formData, setFormData] = useState({
        origin_country: 'China',
        destination_country: 'Burundi',
        transit_port: 'Mombasa',
        container_size: '20ft',
        commodity_type: '',
        incoterm: 'EXW',
        client_name: '',
        client_phone: '',
        client_email: '',
        client_whatsapp: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/logistics`, formData);
            if (response.data.success) {
                setSuccessData(response.data);
                setStep(4); // Success step
            }
        } catch (error) {
            console.error('Error submitting RFQ:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="relative py-24 bg-suloc-blue text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                <div
                    className="absolute inset-0 z-[-1] bg-cover bg-center"
                    style={{ backgroundImage: "url('/logo.jpg')", filter: 'blur(5px) brightness(0.5)' }}
                ></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('logistics_page_title')}
                    </h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        {t('logistics_page_desc')}
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
                {/* Left: Process Visualizer */}
                <div>
                    <h2 className="text-3xl font-bold text-suloc-blue mb-8 flex items-center">
                        <Anchor className="text-suloc-gold mr-3" />
                        {t('logistics_stages_title')}
                    </h2>

                    <div className="relative border-l-4 border-suloc-blue/10 ml-4 space-y-10 pl-8">
                        {[
                            { title: t('logistics_stage1_title'), desc: t('logistics_stage1_desc') },
                            { title: t('logistics_stage2_title'), desc: t('logistics_stage2_desc') },
                            { title: t('logistics_stage3_title'), desc: t('logistics_stage3_desc') },
                            { title: t('logistics_stage4_title'), desc: t('logistics_stage4_desc') },
                            { title: t('logistics_stage5_title'), desc: t('logistics_stage5_desc') }
                        ].map((stage, index) => (
                            <div key={index} className="relative">
                                <div className="absolute -left-[42px] top-0 w-5 h-5 rounded-full bg-suloc-gold border-4 border-white shadow-md"></div>
                                <h4 className="font-bold text-suloc-blue text-lg">{stage.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{stage.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Smart RFQ Form */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 flex border-b border-gray-200">
                        {[t('rfq_title_route'), t('rfq_label_cargo'), t('rfq_label_contact')].map((label, i) => (
                            <div key={i} className={`flex-1 py-3 text-center text-sm font-bold ${step === i + 1 ? 'text-suloc-blue border-b-2 border-suloc-gold' : 'text-gray-400'}`}>
                                {i + 1}. {label}
                            </div>
                        ))}
                    </div>

                    <div className="p-8">
                        {step === 4 ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-suloc-blue mb-2">{t('rfq_success_title')}</h3>
                                <p className="text-gray-600 mb-8">{t('rfq_success_desc')}</p>
                                <a
                                    href={`https://wa.me/25762400920?text=${encodeURIComponent(successData?.wa_message || '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-green-500 text-white p-4 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center"
                                >
                                    <MessageCircle className="mr-2" size={20} />
                                    {t('rfq_btn_wa_continue')}
                                </a>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Route */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_origin')}</label>
                                            <select name="origin_country" value={formData.origin_country} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-suloc-blue outline-none">
                                                <option value="China">{t('rfq_option_china')}</option>
                                                <option value="Europe">{t('rfq_option_europe')}</option>
                                                <option value="UAE">{t('rfq_option_uae')}</option>
                                                <option value="Turkey">{t('rfq_option_turkey')}</option>
                                                <option value="India">{t('rfq_option_india')}</option>
                                                <option value="USA">{t('rfq_option_usa')}</option>
                                                <option value="Other">{t('rfq_option_other')}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_transit_port')}</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['Mombasa', 'Dar es Salaam'].map(port => (
                                                    <label key={port} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.transit_port === port ? 'border-suloc-gold bg-yellow-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                        <input type="radio" name="transit_port" value={port} checked={formData.transit_port === port} onChange={handleChange} className="hidden" />
                                                        <span className="font-bold text-suloc-blue block mb-1">{port}</span>
                                                        <span className="text-xs text-gray-500">{port === 'Mombasa' ? t('rfq_route_north', 'Route Nord (Kenya)') : t('rfq_route_south', 'Route Sud (Tanzanie)')}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="button" onClick={nextStep} className="w-full bg-suloc-blue text-white p-4 rounded-xl font-bold mt-4 hover:bg-suloc-blue-dark transition flex items-center justify-center">
                                            {t('next', 'Suivant')} <ArrowRight className="ml-2" size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: Cargo */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_shipment_type')}</label>
                                            <select name="container_size" value={formData.container_size} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue">
                                                <option value="20ft">{t('rfq_shipment_20ft')}</option>
                                                <option value="40ft">{t('rfq_shipment_40ft')}</option>
                                                <option value="LCL/Groupage">{t('rfq_shipment_lcl')}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_commodity')}</label>
                                            <input type="text" name="commodity_type" value={formData.commodity_type} onChange={handleChange} placeholder={t('rfq_placeholder_commodity')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_incoterm')}</label>
                                            <select name="incoterm" value={formData.incoterm} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue">
                                                <option value="EXW">{t('rfq_incoterm_exw')}</option>
                                                <option value="FOB">{t('rfq_incoterm_fob')}</option>
                                                <option value="CIF">{t('rfq_incoterm_cif')}</option>
                                                <option value="DAP">{t('rfq_incoterm_dap')}</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-4 mt-4">
                                            <button type="button" onClick={prevStep} className="flex-1 border border-suloc-blue text-suloc-blue p-4 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center">
                                                <ArrowLeft className="mr-2" size={18} /> {t('rfq_btn_back')}
                                            </button>
                                            <button type="button" onClick={nextStep} className="flex-1 bg-suloc-blue text-white p-4 rounded-xl font-bold hover:bg-suloc-blue-dark transition flex items-center justify-center">
                                                {t('rfq_btn_next')} <ArrowRight className="ml-2" size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Contact */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_fullname')}</label>
                                            <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_whatsapp')}</label>
                                            <input type="tel" name="client_phone" value={formData.client_phone} onChange={handleChange} required placeholder="+257 ..." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('rfq_label_email')} ({t('form_select_other')})</label>
                                            <input type="email" name="client_email" value={formData.client_email} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-suloc-blue" />
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <button type="button" onClick={prevStep} className="flex-1 border border-suloc-blue text-suloc-blue p-4 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center">
                                                <ArrowLeft className="mr-2" size={18} /> {t('rfq_btn_back')}
                                            </button>
                                            <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center shadow-lg hover:shadow-green-200">
                                                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <><Check className="mr-2" size={18} /> {t('rfq_btn_submit')}</>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logistics;

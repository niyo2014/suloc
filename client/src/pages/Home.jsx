import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    Ship, FileText, ChevronRight, MessageCircle, Contact,
    FileCheck, ArrowRight, ArrowLeft, Phone, Mail,
    MapPin, Send, Loader2, CheckCircle2
} from 'lucide-react';
import { useSystemStatus } from '../context/SystemContext';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api');

const Home = () => {
    const { t, i18n } = useTranslation();
    const { settings } = useSystemStatus();
    const [slides, setSlides] = useState([]);
    const [aboutData, setAboutData] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const slideInterval = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [slidesRes, aboutRes] = await Promise.all([
                    axios.get(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/slides`),
                    axios.get(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/about`)
                ]);
                setSlides(slidesRes.data);
                setAboutData(aboutRes.data);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (slides.length > 1) {
            startSlideTimer();
        }
        return () => stopSlideTimer();
    }, [slides]);

    const startSlideTimer = () => {
        stopSlideTimer();
        slideInterval.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 6000);
    };

    const stopSlideTimer = () => {
        if (slideInterval.current) clearInterval(slideInterval.current);
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        startSlideTimer();
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
        startSlideTimer();
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/contact`, contactForm);
            setSubmitSuccess(true);
            setContactForm({ name: '', email: '', phone: '', service_type: '', message: '' });
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert(t('rfq_error_generic'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-suloc-blue animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">{t('home_loading_msg')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 bg-white">
            {/* Hero Slideshow Section */}
            <section className="relative h-[90vh] lg:h-[85vh] overflow-hidden bg-navy">
                {slides.length > 0 ? (
                    <div className="relative h-full w-full">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={slide.image_url.startsWith('http') ? slide.image_url : `${(import.meta.env.VITE_API_BASE_URL || '/api')}${slide.image_url.startsWith('/') ? '' : '/'}${slide.image_url}`}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="container mx-auto px-6 h-full flex items-center relative z-20">
                                    <div className="max-w-3xl transform transition-all duration-700 translate-y-0 opacity-100">
                                        <span className="inline-block bg-suloc-gold/90 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 animate-in slide-in-from-left duration-700">
                                            {slide[`subtitle_${i18n.language}`] || slide.subtitle_fr || 'SULOC Services'}
                                        </span>
                                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-in slide-in-from-bottom duration-700 delay-100">
                                            {slide[`title_${i18n.language}`] || slide.title_fr}
                                        </h1>
                                        <p className="text-xl text-white/80 mb-10 leading-relaxed font-medium max-w-2xl animate-in slide-in-from-bottom duration-700 delay-200">
                                            {slide[`description_${i18n.language}`] || slide.description_fr}
                                        </p>
                                        <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom duration-700 delay-300">
                                            <a
                                                href={slide.learn_more_link || '#'}
                                                className="bg-suloc-blue hover:bg-navy text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 group"
                                            >
                                                {slide[`cta_text_${i18n.language}`] || slide.cta_text_fr || t('btn_discover')}
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                            <a
                                                href={`https://wa.me/${slide.whatsapp_number || '25762400920'}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                                            >
                                                <MessageCircle size={20} />
                                                {t('home_contact_whatsapp')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Slide Navigation Controls */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10"
                                >
                                    <ArrowRight size={24} />
                                </button>

                                {/* Indicators */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { setCurrentSlide(idx); startSlideTimer(); }}
                                            className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-10 bg-suloc-gold' : 'w-4 bg-white/30 hover:bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-white">
                        <p>{t('visa_no_services')}</p>
                    </div>
                )}
            </section>

            {/* About SULOC Section */}
            {aboutData && (
                <section className="py-32 bg-gray-50 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-20">
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-suloc-gold/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-suloc-blue/10 rounded-full blur-3xl"></div>
                                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                                    <img
                                        src={aboutData.image_url?.startsWith('http') ? aboutData.image_url : `${(import.meta.env.VITE_API_BASE_URL || '/api')}${aboutData.image_url}`}
                                        alt="About SULOC"
                                        className="w-full aspect-[4/5] object-cover"
                                    />
                                    <div className="absolute bottom-8 left-8 right-8 p-6 glass-morphism rounded-3xl text-white">
                                        <p className="text-sm font-bold uppercase tracking-widest text-suloc-gold mb-1">{t('home_about_commitment_title')}</p>
                                        <p className="text-lg font-medium leading-tight">{t('home_about_commitment_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2">
                                <div className="inline-block bg-suloc-blue/5 text-suloc-blue px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest mb-6">
                                    {t('home_about_badge')}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-navy mb-8 leading-tight">
                                    {aboutData[`title_${i18n.language}`] || aboutData.title_fr}
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed mb-12 font-medium">
                                    {aboutData[`content_${i18n.language}`] || aboutData.content_fr}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-gray-100">
                                        <div className="w-12 h-12 bg-suloc-blue/5 rounded-2xl flex items-center justify-center text-suloc-blue mb-4">
                                            <ChevronRight size={24} />
                                        </div>
                                        <h4 className="text-lg font-black text-navy mb-3">{t('home_mission_title')}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{aboutData[`mission_${i18n.language}`] || aboutData.mission_fr}</p>
                                    </div>
                                    <div className="p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-gray-100">
                                        <div className="w-12 h-12 bg-suloc-gold/5 rounded-2xl flex items-center justify-center text-suloc-gold mb-4">
                                            <ChevronRight size={24} />
                                        </div>
                                        <h4 className="text-lg font-black text-navy mb-3">{t('home_vision_title')}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{aboutData[`vision_${i18n.language}`] || aboutData.vision_fr}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Form Section */}
            <section id="contact" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-20">
                            {/* Contact Info */}
                            <div className="w-full lg:w-2/5">
                                <div className="inline-block bg-suloc-gold/10 text-suloc-gold px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest mb-6">
                                    {t('home_contact_badge')}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-navy mb-10 leading-tight">
                                    {t('home_contact_title')}
                                </h2>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-suloc-blue shrink-0 group-hover:bg-suloc-blue group-hover:text-white transition-all duration-300">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('contact_phone')}</p>
                                            <p className="text-lg font-black text-navy">{settings.phone || '+257 62 40 09 20'}</p>
                                            {settings.phone2 && <p className="text-lg font-black text-navy">{settings.phone2}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-suloc-blue shrink-0 group-hover:bg-suloc-blue group-hover:text-white transition-all duration-300">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                            <p className="text-lg font-black text-navy">{settings.email || 'contact@suloc.com'}</p>
                                            {settings.email2 && <p className="text-lg font-black text-navy">{settings.email2}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-suloc-blue shrink-0 group-hover:bg-suloc-blue group-hover:text-white transition-all duration-300">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('contact_country')}</p>
                                            <p className="text-lg font-black text-navy">{settings.address || 'Rohero I, Avenue de la France, Bujumbura'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="w-full lg:w-3/5">
                                <form
                                    onSubmit={handleContactSubmit}
                                    className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-4xl border border-gray-100 animate-in slide-in-from-right duration-700"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3 ml-1">{t('home_contact_label_name')}</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder={t('form_label_name')}
                                                className="w-full bg-gray-50 border-gray-100 rounded-3xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 focus:border-suloc-blue transition-all outline-none font-medium"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3 ml-1">{t('home_contact_label_email')}</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="votre@email.com"
                                                className="w-full bg-gray-50 border-gray-100 rounded-3xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 focus:border-suloc-blue transition-all outline-none font-medium"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3 ml-1">{t('home_contact_label_phone')}</label>
                                            <input
                                                type="tel"
                                                placeholder="+257 ..."
                                                className="w-full bg-gray-50 border-gray-100 rounded-3xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 focus:border-suloc-blue transition-all outline-none font-medium"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3 ml-1">{t('home_contact_label_service')}</label>
                                            <select
                                                className="w-full bg-gray-50 border-gray-100 rounded-3xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 focus:border-suloc-blue transition-all outline-none font-medium appearance-none"
                                                value={contactForm.service_type}
                                                onChange={(e) => setContactForm({ ...contactForm, service_type: e.target.value })}
                                            >
                                                <option value="">{t('home_contact_select_service')}</option>
                                                <option value="Vehicles">{t('home_contact_option_vehicles')}</option>
                                                <option value="Visa">{t('home_contact_option_visa')}</option>
                                                <option value="Logistics">{t('home_contact_option_logistics')}</option>
                                                <option value="MoneyTransfer">{t('home_contact_option_payments')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3 ml-1">{t('home_contact_label_message')}</label>
                                        <textarea
                                            rows="5"
                                            required
                                            placeholder={t('home_contact_placeholder_message')}
                                            className="w-full bg-gray-50 border-gray-100 rounded-3xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 focus:border-suloc-blue transition-all outline-none font-medium resize-none"
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-suloc-blue hover:bg-navy text-white py-5 rounded-3xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                {t('home_contact_btn_sending')}
                                            </>
                                        ) : submitSuccess ? (
                                            <>
                                                <CheckCircle2 size={24} />
                                                {t('home_contact_btn_sent')}
                                            </>
                                        ) : (
                                            <>
                                                <Send size={24} />
                                                {t('home_contact_btn_send')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/25762400920"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 right-10 bg-[#25D366] text-white p-5 rounded-full shadow-3xl hover:scale-110 transition-transform z-[60] flex items-center gap-3 group border-4 border-white"
            >
                <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black whitespace-nowrap">
                    {t('home_wa_floating')}
                </div>
                <MessageCircle size={32} />
            </a>
        </div>
    );
};

export default Home;

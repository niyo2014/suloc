import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
    Send, Smartphone, ShieldCheck, HelpCircle,
    ArrowRight, CheckCircle, AlertTriangle, Clock,
    Search, Fingerprint, RefreshCw
} from 'lucide-react';

const MoneyTransfer = () => {
    const { t } = useTranslation();
    const [operators, setOperators] = useState([]);
    const [feePercent, setFeePercent] = useState(5.97);
    const [whatsappPhone, setWhatsappPhone] = useState('25762400920');

    // Calculator State
    const [sendAmount, setSendAmount] = useState('');
    const [feeAmount, setFeeAmount] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);

    // Tracking State
    const [trackingCode, setTrackingCode] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackingError, setTrackingError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const opRes = await axios.get('/api/payment/operators');
                setOperators(opRes.data);

                // In a real app, these would come from site_settings API
                // For now using defaults mirroring PHP
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };
        fetchData();
    }, []);

    // Calculator Logic
    useEffect(() => {
        const amt = parseFloat(sendAmount) || 0;
        const fee = (amt * feePercent) / 100;
        setFeeAmount(fee);
        setTotalToPay(amt + fee);
    }, [sendAmount, feePercent]);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackingCode.trim()) return;

        setIsTracking(true);
        setTrackingError(null);
        setTrackingResult(null);

        try {
            const res = await axios.get(`/api/payment/track?code=${trackingCode.trim()}`);
            if (res.data.found) {
                setTrackingResult(res.data);
            } else {
                setTrackingError(t('pay_track_error_not_found', 'Code de vérification introuvable'));
            }
        } catch (error) {
            setTrackingError(t('pay_track_error_generic', 'Une erreur est survenue lors de la vérification'));
        } finally {
            setIsTracking(false);
        }
    };

    const handleWhatsApp = () => {
        if (!sendAmount || parseFloat(sendAmount) <= 0) {
            alert(t('pay_alert_invalid_amount', 'Veuillez entrer un montant valide'));
            return;
        }
        const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
        const msg = t('pay_wa_msg', "Bonjour SULOC, je souhaite effectuer un transfert de {amount} USD. J'ai vu vos frais de {fee}%.").replace('{amount}', sendAmount).replace('{fee}', feePercent);
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Hero Section (Dark Blue Background) */}
            <section className="bg-navy relative pt-20 pb-32 md:pt-32 md:pb-48 text-white text-center md:text-left overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a2342 0%, #16365a 100%)' }}>
                {/* Background Pattern Overlay (Optional) */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-3/5">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                                <span className="text-xs font-bold tracking-widest uppercase">{t('pay_remittance_live_badge', 'Remittance Platform v2.0 Live')}</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
                                {t('pay_money_transfer_title_1', 'Transférez de l\'argent')} <span className="text-gold" style={{ color: '#d4af37' }}>{t('pay_money_transfer_title_2', 'sans frontières')}</span>
                            </h1>
                            <p className="text-xl opacity-80 max-w-2xl mb-12">
                                {t('pay_money_transfer_desc', 'Envoyez de l\'argent vers la RDC, le Burundi et l\'international. Frais transparents et retrait sécurisé par code secret.')}
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <a href="#calc" className="bg-gold text-navy font-black px-10 py-5 rounded-2xl shadow-xl hover:-translate-y-1 transition duration-300" style={{ backgroundColor: '#d4af37', color: '#0a2342' }}>
                                    {t('pay_btn_simulate', 'Simuler un Envoi')}
                                </a>
                                <a href="#status" className="bg-white/5 hover:bg-white/10 px-10 py-5 rounded-2xl border border-white/20 backdrop-blur transition font-bold">
                                    {t('pay_btn_track', 'Suivre un Transfert')}
                                </a>
                            </div>
                        </div>

                        {/* Calculator Card */}
                        <div id="calc" className="lg:w-2/5 w-full">
                            <div className="bg-white rounded-3xl p-8 md:p-10 text-navy relative shadow-2xl" style={{ color: '#0a2342' }}>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold rounded-full flex flex-col items-center justify-center shadow-xl rotate-12 text-navy"
                                    style={{ backgroundColor: '#d4af37' }}>
                                    <span className="text-[10px] font-black uppercase leading-none">{t('pay_calc_fixed_fee', 'Frais Fixes')}</span>
                                    <span className="text-2xl font-black">{feePercent}%</span>
                                </div>

                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">{t('pay_calc_title', 'Simulateur de Transfert')}</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-gray-500 uppercase">{t('pay_calc_you_send', 'Vous envoyez')}</span>
                                            <span className="text-gold font-black uppercase italic" style={{ color: '#d4af37' }}>{t('pay_calc_secure_total', 'Total Sécurisé')}</span>
                                        </div>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-2xl group-focus-within:text-gold transition-colors">$</span>
                                            <input
                                                type="number"
                                                value={sendAmount}
                                                onChange={(e) => setSendAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-gold focus:bg-white rounded-2xl pl-12 pr-6 py-6 text-4xl font-black outline-none transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-500 italic">{t('pay_calc_fee', 'Frais')} ( {feePercent}% )</span>
                                            <span className="text-lg font-black text-red-500">{feeAmount.toFixed(2)} $</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <span className="text-xs font-black uppercase tracking-wider text-navy opacity-60">{t('pay_calc_total_to_pay', 'Total à payer')}</span>
                                            <span className="text-2xl font-black text-navy">{totalToPay.toFixed(2)} $</span>
                                        </div>
                                    </div>

                                    <div className="text-center pt-2">
                                        <div className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">{t('pay_calc_recipient_receives', 'Le destinataire reçoit')}</div>
                                        <div className="text-5xl font-black text-green-600">
                                            {(parseFloat(sendAmount) || 0).toFixed(2)} <span className="text-2xl text-green-700/50 italic">$</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-6 rounded-2xl text-xl font-black shadow-lg shadow-green-200 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <Smartphone size={24} /> {t('pay_calc_btn_wa', 'Continuer sur WhatsApp')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tracking Section */}
            <section id="status" className="py-24 bg-white relative z-20 -mt-20">
                <div className="container mx-auto px-6">
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-50">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-navy mb-4" style={{ color: '#0a2342' }}>{t('pay_track_title', 'Suivi de Transfert')}</h2>
                            <p className="text-lg text-gray-400 font-medium">{t('pay_track_desc', 'Entrez votre code SULOC pour vérifier l\'état de votre envoi en temps réel.')}</p>
                        </div>

                        <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
                            <div className="relative group mb-6">
                                <input
                                    type="text"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                    placeholder={t('pay_track_placeholder', 'SU-XXX-XXX')}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-gold focus:bg-white rounded-3xl px-8 py-8 md:py-10 text-2xl md:text-4xl font-mono text-center uppercase tracking-[0.3em] outline-none transition-all duration-500 shadow-inner group-focus-within:scale-105"
                                />
                                <div className="absolute inset-0 rounded-3xl pointer-events-none group-focus-within:ring-8 group-focus-within:ring-gold/10 transition duration-500"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={isTracking}
                                className="w-full bg-navy hover:bg-gold text-white hover:text-navy rounded-3xl py-6 md:py-8 font-black text-xl md:text-2xl transition-all duration-500 flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: '#0a2342' }}
                            >
                                {isTracking ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={28} />}
                                {isTracking ? t('pay_track_btn_verifying', 'VÉRIFICATION...') : t('pay_track_btn_verify', 'VÉRIFIER LE STATUT')}
                            </button>

                            {/* Tracking Result */}
                            {(trackingResult || trackingError) && (
                                <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                                    {trackingError ? (
                                        <div className="bg-red-50 border-l-8 border-red-500 rounded-3xl p-8 flex items-center gap-6 shadow-sm">
                                            <div className="bg-white p-4 rounded-xl text-red-500 shadow-sm"><AlertTriangle size={32} /></div>
                                            <div>
                                                <h4 className="text-xl font-black text-red-700 uppercase">Erreur de code</h4>
                                                <p className="text-red-500/80 font-bold">{trackingError}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-100 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-inner">
                                            <div className="flex items-center gap-8 text-left">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-xl border border-blue-50">
                                                    <CheckCircle size={40} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t('pay_track_status_label', 'État de la Remittance')}</div>
                                                    <div className="text-3xl font-black italic" style={{ color: trackingResult.color }}>{trackingResult.label}</div>
                                                    <div className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-tighter">{t('pay_track_init_on', 'Initialisé le')} {trackingResult.date}</div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 min-w-[240px] text-center md:text-right">
                                                <div className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-1">{t('pay_track_amount_to_receive', 'Montant à recevoir')}</div>
                                                <div className="text-4xl font-black text-navy">{trackingResult.amount} <span className="text-lg opacity-40 italic">{trackingResult.currency}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Operators Section */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-navy mb-6">{t('pay_partners_title', 'Nos Partenaires & Taux')}</h2>
                        <div className="w-24 h-2 bg-gold mx-auto rounded-full" style={{ backgroundColor: '#d4af37' }}></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {operators.length > 0 ? (
                            operators.map(op => (
                                <div key={op.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                                    <div className="h-20 flex items-center mb-6">
                                        {op.operator_logo ? (
                                            <img src={op.operator_logo} alt={op.operator_name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black uppercase italic">
                                                {op.operator_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-black text-2xl text-navy mb-4">{op.operator_name}</h3>

                                    {op.exchange_rate && (
                                        <div className="bg-blue-50/50 rounded-2xl p-5 mb-4 border border-blue-50">
                                            <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1 italic">{t('pay_exchange_rate', 'Taux de Change')}</div>
                                            <div className="font-black text-blue-900 text-lg">
                                                1 USD = {parseFloat(op.exchange_rate)} <span className="text-blue-400 font-bold italic">{op.currency_pair?.split('/')[1]}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-[10px] text-gray-300 font-black uppercase tracking-widest mt-6 pt-6 border-t border-slate-50">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> {t('pay_operational', 'Opérationnel')}</span>
                                        <ArrowRight size={18} className="text-gold group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
                                <p className="text-gray-400 font-black italic">{t('pay_no_partners', 'Aucun partenaire configuré pour le moment.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Workflow / Steps Section */}
            <section className="py-24 bg-navy relative overflow-hidden" style={{ backgroundColor: '#0a2342' }}>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-20">{t('pay_how_it_works', 'Comment ça marche ?')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: <Search size={40} />, title: t('pay_step1_title', 'Simulation'), desc: t('pay_step1_desc', 'Utilisez notre calculateur pour voir les frais exacts.') },
                            { icon: <Smartphone size={40} />, title: t('pay_step2_title', 'WhatsApp'), desc: t('pay_step2_desc', 'Validez votre transaction avec nos agents directs.') },
                            { icon: <ShieldCheck size={40} />, title: t('pay_step3_title', 'Code Client'), desc: t('pay_step3_desc', 'Recevez votre code SU-XXX unique par message.') },
                            { icon: <HelpCircle size={40} />, title: t('pay_step4_title', 'Retrait'), desc: t('pay_step4_desc', 'Le bénéficiaire retire les fonds avec le code secret.') }
                        ].map((step, idx) => (
                            <div key={idx} className="relative group text-center md:text-left">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 text-gold shadow-lg group-hover:bg-gold group-hover:text-navy transition-all duration-500" style={{ color: '#d4af37' }}>
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 italic">{step.title}</h3>
                                <p className="text-white/50 font-medium leading-relaxed">{step.desc}</p>
                                {idx < 3 && <div className="hidden lg:block absolute top-10 -right-6 w-12 h-0.5 bg-white/10"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MoneyTransfer;

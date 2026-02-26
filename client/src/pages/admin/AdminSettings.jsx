import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Phone, Mail, MapPin, User, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = '';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        phone: '',
        phone2: '',
        email: '',
        email2: '',
        address: '',
        representative: '',
        nif: '',
        authorization_date: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/settings`);
            // Merge with defaults to ensure all fields exist
            setSettings(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (error) {
            console.error('Error fetching settings:', error);
            setErrorMsg('Erreur lors du chargement des paramètres.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await axios.post(`${API_BASE_URL}/api/settings/admin`, settings, {
                withCredentials: true
            });
            setSuccessMsg('Paramètres enregistrés avec succès!');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setErrorMsg('Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-suloc-blue"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <h1 className="text-3xl font-bold text-suloc-blue mb-8">Paramètres du Site</h1>

            {successMsg && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-lg flex items-center">
                    <CheckCircle2 className="mr-3" size={20} /> {successMsg}
                </div>
            )}

            {errorMsg && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-lg flex items-center">
                    <AlertCircle className="mr-3" size={20} /> {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-suloc-blue p-6 text-white flex items-center gap-3">
                        <Phone size={24} className="text-suloc-gold" />
                        <h2 className="text-xl font-bold">Informations de Contact</h2>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone Principal</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={settings.phone}
                                        onChange={handleInputChange}
                                        placeholder="+257 79 496 117"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone Secondaire</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone2"
                                        value={settings.phone2}
                                        onChange={handleInputChange}
                                        placeholder="+257 69 826 865"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Principal</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={settings.email}
                                        onChange={handleInputChange}
                                        placeholder="ndayiprud@gmail.com"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Secondaire</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email2"
                                        value={settings.email2}
                                        onChange={handleInputChange}
                                        placeholder="ciceseentreprise@gmail.com"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-suloc-blue p-6 text-white flex items-center gap-3">
                        <MapPin size={24} className="text-suloc-gold" />
                        <h2 className="text-xl font-bold">Localisation</h2>
                    </div>
                    <div className="p-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                <textarea
                                    name="address"
                                    value={settings.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    placeholder="Bujumbura-Rohero I-Avenu de l'ONU N°3, Galerie d'Innovation Bureau B1, BURUNDI."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-suloc-blue p-6 text-white flex items-center gap-3">
                        <User size={24} className="text-suloc-gold" />
                        <h2 className="text-xl font-bold">Informations Légales</h2>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Représentant Légal</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="representative"
                                        value={settings.representative}
                                        onChange={handleInputChange}
                                        placeholder="NDAYIZAMBA Prudence"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">NIF</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="nif"
                                        value={settings.nif}
                                        onChange={handleInputChange}
                                        placeholder="4000781700"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Date d'autorisation</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="authorization_date"
                                        value={settings.authorization_date}
                                        onChange={handleInputChange}
                                        placeholder="2 janvier 2017"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-suloc-blue text-white px-10 py-4 rounded-full font-bold hover:brightness-110 transition shadow-xl flex items-center disabled:opacity-70"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save className="mr-3" size={20} /> Enregistrer les Paramètres
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;

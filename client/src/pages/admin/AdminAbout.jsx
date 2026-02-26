import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Save, Image as ImageIcon, CheckCircle2, Loader2,
    Info, Target, Eye, Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const AdminAbout = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title_fr: '',
        title_en: '',
        content_fr: '',
        content_en: '',
        mission_fr: '',
        mission_en: '',
        vision_fr: '',
        vision_en: '',
        values_fr: '',
        values_en: '',
        image_url: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/about`);
            if (res.data) {
                setFormData({
                    title_fr: res.data.title_fr || '',
                    title_en: res.data.title_en || '',
                    content_fr: res.data.content_fr || '',
                    content_en: res.data.content_en || '',
                    mission_fr: res.data.mission_fr || '',
                    mission_en: res.data.mission_en || '',
                    vision_fr: res.data.vision_fr || '',
                    vision_en: res.data.vision_en || '',
                    values_fr: res.data.values_fr || '',
                    values_en: res.data.values_en || '',
                    image_url: res.data.image_url || '',
                    image: null
                });
                if (res.data.image_url) {
                    setPreviewImage(res.data.image_url.startsWith('http') ? res.data.image_url : `${API_BASE_URL}${res.data.image_url}`);
                }
            }
        } catch (error) {
            console.error('Error fetching about data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(false);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && !formData[key]) return;
            data.append(key, formData[key]);
        });

        try {
            await axios.put(`${API_BASE_URL}/api/about/admin`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchAboutData();
        } catch (error) {
            console.error('Error updating about section:', error);
            alert('Erreur lors de la mise à jour.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-navy uppercase tracking-tight">À Propos de SULOC</h1>
                        <p className="text-gray-500 font-medium">Gérez le contenu de la section "À propos" de la page d'accueil</p>
                    </div>
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl font-bold border border-green-100 animate-in fade-in slide-in-from-top duration-300">
                            <CheckCircle2 size={18} /> Mise à jour réussie
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Side */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
                                <Info size={20} className="text-suloc-blue" /> Informations Générales
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Titre (FR)</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold text-lg"
                                            value={formData.title_fr}
                                            onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Titre (EN)</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold text-lg"
                                            value={formData.title_en}
                                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Description Principale (FR)</label>
                                        <textarea
                                            rows="8" required
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium leading-relaxed resize-none"
                                            value={formData.content_fr}
                                            onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Description Principale (EN)</label>
                                        <textarea
                                            rows="8" required
                                            className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium leading-relaxed resize-none"
                                            value={formData.content_en}
                                            onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
                                <Target size={20} className="text-suloc-gold" /> Mission & Vision
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Notre Mission (FR)</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                        value={formData.mission_fr}
                                        onChange={(e) => setFormData({ ...formData, mission_fr: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Notre Mission (EN)</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                        value={formData.mission_en}
                                        onChange={(e) => setFormData({ ...formData, mission_en: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Notre Vision (FR)</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                        value={formData.vision_fr}
                                        onChange={(e) => setFormData({ ...formData, vision_fr: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Notre Vision (EN)</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                        value={formData.vision_en}
                                        onChange={(e) => setFormData({ ...formData, vision_en: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Nos Valeurs (FR)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                        value={formData.values_fr}
                                        onChange={(e) => setFormData({ ...formData, values_fr: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Nos Valeurs (EN)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                        value={formData.values_en}
                                        onChange={(e) => setFormData({ ...formData, values_en: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Side */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
                                <ImageIcon size={20} className="text-suloc-blue" /> Image Illustrative
                            </h3>
                            <div className="relative group">
                                <div className="relative aspect-[4/5] bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100 overflow-hidden group-hover:border-suloc-blue/30 transition-all flex items-center justify-center">
                                    {previewImage ? (
                                        <img src={previewImage} alt="About Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-sm font-bold text-gray-400">Ajouter une image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-center text-gray-400 font-medium">Recommandé: Image verticale, 1200x1500px</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-navy hover:bg-black text-white py-6 rounded-[2rem] font-black text-xl transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {submitting ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <Save size={24} />
                            )}
                            Enregistrer les Changements
                        </button>

                        <div className="bg-suloc-gold/5 p-6 rounded-[2rem] border border-suloc-gold/10">
                            <h4 className="flex items-center gap-2 text-suloc-gold font-black text-sm uppercase mb-3">
                                <Star size={16} /> Astuce
                            </h4>
                            <p className="text-xs text-suloc-gold/80 leading-relaxed font-bold">
                                Une description bien rédigée renforce la confiance de vos clients. Soyez clair, professionnel et mettez en avant vos points forts.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAbout;

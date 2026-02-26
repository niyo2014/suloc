import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Edit2, Trash2, MoveUp, MoveDown,
    Save, X, Image as ImageIcon, Check, AlertCircle,
    Eye, EyeOff
} from 'lucide-react';

 // API_BASE_URL refined

const AdminHero = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [formData, setFormData] = useState({
        title_fr: '',
        title_en: '',
        subtitle_fr: '',
        subtitle_en: '',
        description_fr: '',
        description_en: '',
        learn_more_link: '',
        whatsapp_number: '25762400920',
        cta_text_fr: 'En savoir plus',
        cta_text_en: 'Learn more',
        is_active: true,
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Optimized image URL helper
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // If it starts with img/ (legacy) or /img/, try to point to the main site root if possible, 
        // but for now, the backend doesn't serve it.
        // However, if we are in admin, it should ideally point to the backend or a proxy.
        return `${(import.meta.env.VITE_API_BASE_URL || '/api')}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await axios.get(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/admin/slides`, {
                withCredentials: true
            });
            setSlides(res.data);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (slide = null) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title_fr: slide.title_fr || '',
                title_en: slide.title_en || '',
                subtitle_fr: slide.subtitle_fr || '',
                subtitle_en: slide.subtitle_en || '',
                description_fr: slide.description_fr || '',
                description_en: slide.description_en || '',
                learn_more_link: slide.learn_more_link || '',
                whatsapp_number: slide.whatsapp_number || '25762400920',
                cta_text_fr: slide.cta_text_fr || 'En savoir plus',
                cta_text_en: slide.cta_text_en || 'Learn more',
                is_active: slide.is_active,
                image: null
            });
            setPreviewImage(getImageUrl(slide.image_url));
        } else {
            setEditingSlide(null);
            setFormData({
                title_fr: '',
                title_en: '',
                subtitle_fr: '',
                subtitle_en: '',
                description_fr: '',
                description_en: '',
                learn_more_link: '',
                whatsapp_number: '25762400920',
                cta_text_fr: 'En savoir plus',
                cta_text_en: 'Learn more',
                is_active: true,
                image: null
            });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
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

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && !formData[key]) return;
            data.append(key, formData[key]);
        });

        try {
            if (editingSlide) {
                await axios.put(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/admin/slides/${editingSlide.id}`, data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/admin/slides`, data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            setIsModalOpen(false);
            fetchSlides();
        } catch (error) {
            console.error('Error saving slide:', error);
            alert('Erreur lors de l\'enregistrement du slide.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce slide ?')) return;

        try {
            await axios.delete(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/admin/slides/${id}`, {
                withCredentials: true
            });
            fetchSlides();
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    const handleReorder = async (slideIds) => {
        try {
            await axios.patch(`${(import.meta.env.VITE_API_BASE_URL || '/api')}/api/hero/admin/slides/reorder`, { slideIds }, {
                withCredentials: true
            });
            fetchSlides();
        } catch (error) {
            console.error('Error reordering slides:', error);
        }
    };

    const moveSlide = (index, direction) => {
        const newSlides = [...slides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= slides.length) return;

        const [removed] = newSlides.splice(index, 1);
        newSlides.splice(newIndex, 0, removed);

        handleReorder(newSlides.map(s => s.id));
    };

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-navy">Gestion du Slideshow</h1>
                    <p className="text-gray-500">Gérez les images et le contenu de la bannière d'accueil</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-suloc-blue text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-navy transition-all shadow-lg"
                >
                    <Plus size={20} /> Nouveau Slide
                </button>
            </div>

            {slides.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="h-24 w-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <ImageIcon size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-3xl font-black text-navy mb-3">Le Slideshow est Vide</h3>
                    <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
                        Nous avons détecté que la base de données contient des slides, mais ils ne s'affichent pas.
                        Cela peut arriver si la connexion API est perturbée.
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-suloc-blue text-white px-10 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 hover:bg-navy transition-all shadow-2xl mx-auto"
                    >
                        <Plus size={24} /> Créer un Nouveau Slide
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={getImageUrl(slide.image_url)}
                                    alt={slide.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {slide.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                    <span className="bg-navy/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        Ordre: {index + 1}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-navy mb-1">{slide.title_fr}</h3>
                                        <p className="text-sm text-suloc-gold font-bold uppercase tracking-widest">{slide.subtitle_fr}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => moveSlide(index, 'up')}
                                            disabled={index === 0}
                                            className="p-2 bg-gray-50 text-gray-400 hover:text-suloc-blue rounded-xl disabled:opacity-30"
                                        >
                                            <MoveUp size={18} />
                                        </button>
                                        <button
                                            onClick={() => moveSlide(index, 'down')}
                                            disabled={index === slides.length - 1}
                                            className="p-2 bg-gray-50 text-gray-400 hover:text-suloc-blue rounded-xl disabled:opacity-30"
                                        >
                                            <MoveDown size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{slide.description_fr}</p>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleOpenModal(slide)}
                                            className="flex items-center gap-2 text-sm font-bold text-suloc-blue hover:text-navy transition-colors"
                                        >
                                            <Edit2 size={16} /> Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 size={16} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-navy/20">
                    <div className="bg-white rounded-[3rem] shadow-4xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-navy">
                                    {editingSlide ? 'Modifier le Slide' : 'Nouveau Slide'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:text-navy rounded-2xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    {/* Image Upload */}
                                    <div className="relative group">
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-4">Image de Fond</label>
                                        <div className="relative h-64 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 overflow-hidden group-hover:border-suloc-blue/30 transition-all flex items-center justify-center">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                                                    <p className="text-sm font-bold text-gray-400">Cliquez pour ajouter une image</p>
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

                                    <div>
                                        <label className="block text-sm font-black text-navy uppercase tracking-widest mb-4">Statut</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${formData.is_active
                                                ? 'bg-green-50 text-green-600 border-2 border-green-100'
                                                : 'bg-red-50 text-red-600 border-2 border-red-100'
                                                }`}
                                        >
                                            {formData.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                                            {formData.is_active ? 'Slide Visible' : 'Slide Masqué'}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Titre (FR)</label>
                                            <input
                                                type="text" required
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.title_fr}
                                                onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Titre (EN)</label>
                                            <input
                                                type="text" required
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.title_en}
                                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Sous-titre (FR)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.subtitle_fr}
                                                onChange={(e) => setFormData({ ...formData, subtitle_fr: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Sous-titre (EN)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.subtitle_en}
                                                onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Description (FR)</label>
                                            <textarea
                                                rows="3"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                                value={formData.description_fr}
                                                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Description (EN)</label>
                                            <textarea
                                                rows="3"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium resize-none"
                                                value={formData.description_en}
                                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Bouton (FR)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.cta_text_fr}
                                                onChange={(e) => setFormData({ ...formData, cta_text_fr: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Bouton (EN)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.cta_text_en}
                                                onChange={(e) => setFormData({ ...formData, cta_text_en: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Lien "En savoir plus"</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.learn_more_link}
                                                onChange={(e) => setFormData({ ...formData, learn_more_link: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-navy uppercase tracking-widest mb-3">Numéro WhatsApp</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold"
                                                value={formData.whatsapp_number}
                                                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-suloc-blue hover:bg-navy text-white py-5 rounded-3xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3"
                                        >
                                            {submitting ? 'Enregistrement...' : 'Enregistrer le Slide'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHero;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Loader, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        currency: 'USD',
        mileage: '',
        color: '',
        engine_size: '',
        doors: 4,
        seats: 5,
        transmission: 'automatic',
        fuel_type: 'petrol',
        vehicle_condition: 'used',
        status: 'available',
        description_fr: '',
        description_en: '',
        is_featured: false,
        is_active: true,
        order_index: 0
    });

    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [currentMainImageUrl, setCurrentMainImageUrl] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchVehicleData();
        }
    }, [id]);

    const fetchVehicleData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/${id}`);
            const v = response.data.vehicle;

            setFormData({
                brand: v.brand,
                model: v.model,
                year: v.year,
                price: v.price,
                currency: v.currency,
                mileage: v.mileage,
                color: v.color,
                engine_size: v.engine_size,
                doors: v.doors,
                seats: v.seats,
                transmission: v.transmission,
                fuel_type: v.fuel_type,
                vehicle_condition: v.vehicle_condition,
                status: v.status,
                description_fr: v.description_fr || '',
                description_en: v.description_en || '',
                is_featured: v.is_featured,
                is_active: v.is_active,
                order_index: v.order_index
            });
            setCurrentMainImageUrl(v.main_image);
            // Gallery images would typically be fetched here if included in the endpoint
            // or via a separate call if not. Assuming getVehicleById includes them or we need to fetch them separately?
            // Checking vehicleController: getVehicleById implies standard fetch. 
            // Previous steps didn't explicit include gallery in getVehicleById public endpoint? 
            // Let's check. Ah, public endpoint might only return active?
            // Actually getVehicleById implies finding unique.
            // Let's assume for now we might need to fetch images if they are not in the response.
            // But typical prisma include would have them.
            if (v.vehicle_images) {
                setExistingGalleryImages(v.vehicle_images);
            }
        } catch (err) {
            console.error('Error fetching vehicle:', err);
            setError('Impossible de charger les données du véhicule.');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Append Main Image
            if (mainImage) {
                data.append('main_image', mainImage);
            } else if (isEditMode && currentMainImageUrl) {
                data.append('main_image', currentMainImageUrl); // Pass string to keep existing
            }

            // Append Gallery Images (New uploads) - Only for Create mode
            // For Edit mode, they are uploaded via a separate endpoint to avoid double upload and Multer errors
            if (!isEditMode) {
                galleryImages.forEach(file => {
                    data.append('gallery_images', file);
                });
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };

            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/vehicles/admin/${id}`, data, config);
                // Handle Gallery Upload separate if PUT replaces? 
                // Our backend createVehicle handles gallery_images. 
                // Our backend updateVehicle handles main_image replacement but NOT gallery array addition directly in the code I wrote?
                // Let's check updateVehicle in vehicleController.js.
                // It processes main_image. It does NOT process gallery_images array loop.
                // So for Edit mode, we need to call the upload endpoint separately for new gallery images.

                if (galleryImages.length > 0) {
                    const galleryData = new FormData();
                    galleryImages.forEach(file => galleryData.append('gallery_images', file));
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vehicles/admin/${id}/images`, galleryData, config);
                }

            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/vehicles/admin`, data, config);
            }

            navigate('/admin/vehicles');
        } catch (err) {
            console.error('Error saving vehicle:', err);
            setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'enregistrement.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGalleryImage = async (imageId) => {
        if (!window.confirm('Supprimer cette image ?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vehicles/admin/${id}/images/${imageId}`, {
                withCredentials: true
            });
            setExistingGalleryImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression');
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-suloc-blue"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl pb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/vehicles')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informations Générales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                            <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
                            <input type="text" name="model" required value={formData.model} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Année *</label>
                            <input type="number" name="year" required value={formData.year} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                                <select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="CDF">CDF (FC)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Spécifications Techniques</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none">
                                <option value="automatic">Automatique</option>
                                <option value="manual">Manuelle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                            <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none">
                                <option value="petrol">Essence</option>
                                <option value="diesel">Diesel</option>
                                <option value="hybrid">Hybride</option>
                                <option value="electric">Électrique</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select name="vehicle_condition" value={formData.vehicle_condition} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none">
                                <option value="used">Occasion</option>
                                <option value="new">Neuf</option>
                                <option value="certified">Certifié</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Moteur (ex: 2.0L)</label>
                            <input type="text" name="engine_size" value={formData.engine_size} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none" />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Images</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Principale</label>
                        {currentMainImageUrl && !mainImage && (
                            <div className="mb-4 relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                                <img src={currentMainImageUrl} alt="Main" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <ImageUploader
                            maxFiles={1}
                            label="Changer l'image principale"
                            onFilesSelected={(files) => setMainImage(files[0])}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Galerie Photos</label>

                        {/* Existing Gallery (Edit Mode) */}
                        {isEditMode && existingGalleryImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {existingGalleryImages.map(img => (
                                    <div key={img.id} className="relative group rounded-lg overflow-hidden h-24 border border-gray-200">
                                        <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGalleryImage(img.id)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <ImageUploader
                            maxFiles={10}
                            label="Ajouter des photos à la galerie"
                            onFilesSelected={(files) => setGalleryImages(prev => [...prev, ...files])}
                        />
                    </div>
                </div>

                {/* Status & Description */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status de vente</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none">
                            <option value="available">Disponible</option>
                            <option value="negotiating">En négociation</option>
                            <option value="sold">Vendu</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR) *</label>
                            <textarea name="description_fr" rows="6" required value={formData.description_fr} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                            <textarea name="description_en" rows="6" value={formData.description_en} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-suloc-blue focus:border-transparent outline-none"></textarea>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4 text-suloc-blue rounded focus:ring-suloc-blue" />
                            <span className="text-gray-700 text-sm font-medium">Mettre en vedette (Page d'accueil)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-suloc-blue rounded focus:ring-suloc-blue" />
                            <span className="text-gray-700 text-sm font-medium">Actif (Visible sur le site)</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-suloc-blue text-white py-3 rounded-xl font-bold hover:bg-suloc-blue-dark transition-colors shadow-md flex items-center justify-center gap-2"
                >
                    {loading ? <Loader className="animate-spin" /> : <Save />}
                    {isEditMode ? 'Enregistrer les modifications' : 'Créer le véhicule'}
                </button>
            </form>
        </div>
    );
};

export default VehicleForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

const VisaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        country_name_fr: '',
        country_name_en: '',
        country_code: '', // e.g. US, FR (optional, for flags)
        service_fee: '',
        currency: 'USD',
        processing_time: '',
        requirements_fr: '',
        requirements_en: '',
        documents_needed_fr: '',
        documents_needed_en: '',
        is_active: true,
        order_index: 0
    });

    useEffect(() => {
        if (isEditMode) {
            fetchVisaDetails();
        }
    }, [id]);

    const fetchVisaDetails = async () => {
        try {
            // Re-using the public endpoint fetch logic but filtering, 
            // OR ideally we should have a GET /api/visas/admin/:id
            // For now, let's fetch all via admin endpoint and find (inefficient but works for small dataset)
            // Or create a direct GET endpoint.
            // Let's assume we can fetch all and find, or just GET /api/visas/admin/:id? No, usually GET /api/vehicles/:id is public.
            // We'll use the public endpoint if available or fetch all.
            // Actually, let's try GET /api/visas first (public) - it might not return inactive ones.
            // Better to fetch from admin list.
            const response = await axios.get('/api/visas/admin/all', { withCredentials: true });
            const visa = response.data.find(v => v.id === parseInt(id));
            if (visa) {
                setFormData({
                    country_name_fr: visa.country_name_fr || '',
                    country_name_en: visa.country_name_en || '',
                    country_code: visa.country_code || '',
                    service_fee: visa.service_fee || '',
                    currency: visa.currency || 'USD',
                    processing_time: visa.processing_time || '',
                    requirements_fr: visa.requirements_fr || '',
                    requirements_en: visa.requirements_en || '',
                    documents_needed_fr: visa.documents_needed_fr || '',
                    documents_needed_en: visa.documents_needed_en || '',
                    is_active: visa.is_active,
                    order_index: visa.order_index || 0
                });
            } else {
                setError('Service non trouvé.');
            }
        } catch (err) {
            console.error('Error fetching details:', err);
            setError('Erreur de chargement.');
        } finally {
            setFetching(false);
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
            const endpoint = isEditMode
                ? `/api/visas/admin/${id}`
                : '/api/visas/admin';

            const method = isEditMode ? 'put' : 'post';

            await axios[method](endpoint, formData, {
                withCredentials: true
            });

            navigate('/admin/visas');
        } catch (err) {
            console.error('Error saving visa:', err);
            setError('Une erreur est survenue lors de la sauvegarde.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-suloc-blue" size={32} />
        </div>
    );

    return (
        <div className="container mx-auto max-w-4xl py-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/visas" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Modifier le service' : 'Nouveau service de Visa'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Country FR */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays (Français) *</label>
                        <input
                            type="text"
                            name="country_name_fr"
                            required
                            value={formData.country_name_fr}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>

                    {/* Country EN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays (Anglais)</label>
                        <input
                            type="text"
                            name="country_name_en"
                            value={formData.country_name_en}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>

                    {/* Service Fee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frais de service</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="service_fee"
                                value={formData.service_fee}
                                onChange={handleChange}
                                placeholder="Montant"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                            />
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="BIF">BIF</option>
                            </select>
                        </div>
                    </div>

                    {/* Processing Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Délai de traitement</label>
                        <input
                            type="text"
                            name="processing_time"
                            value={formData.processing_time}
                            onChange={handleChange}
                            placeholder="Ex: 5-7 jours ouvrables"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>

                    {/* Country Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code Pays (2 lettres)</label>
                        <input
                            type="text"
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            maxLength="3"
                            placeholder="Ex: FR"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue uppercase"
                        />
                    </div>

                    {/* Order Index */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                        <input
                            type="number"
                            name="order_index"
                            value={formData.order_index}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conditions (Français)</label>
                        <textarea
                            name="requirements_fr"
                            rows="4"
                            value={formData.requirements_fr}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conditions (Anglais)</label>
                        <textarea
                            name="requirements_en"
                            rows="4"
                            value={formData.requirements_en}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>
                </div>

                {/* Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documents Requis (Français)</label>
                        <textarea
                            name="documents_needed_fr"
                            rows="4"
                            value={formData.documents_needed_fr}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documents Requis (Anglais)</label>
                        <textarea
                            name="documents_needed_en"
                            rows="4"
                            value={formData.documents_needed_en}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-suloc-blue focus:border-suloc-blue"
                        />
                    </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-2 mb-8">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-5 w-5 text-suloc-blue focus:ring-suloc-blue border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="text-gray-700 font-medium">
                        Activer ce service (Visible sur le site)
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-suloc-blue text-white px-6 py-3 rounded-lg hover:bg-suloc-blue-dark transition-colors font-bold flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isEditMode ? 'Enregistrer les modifications' : 'Créer le service'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VisaForm;

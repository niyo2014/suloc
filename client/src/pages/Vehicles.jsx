import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, RotateCcw, Car } from 'lucide-react';
import axios from 'axios';

const Vehicles = () => {
    const { t } = useTranslation();
    const [vehicles, setVehicles] = useState([]);
    const [filters, setFilters] = useState({});
    const [filterOptions, setFilterOptions] = useState({
        brands: [],
        years: [],
        conditions: [],
        transmissions: [],
        fuel_types: []
    });
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({
        brand: '',
        model: '',
        year: '',
        price_min: '',
        price_max: '',
        condition: '',
        transmission: '',
        fuel_type: '',
        status: ''
    });

    useEffect(() => {
        fetchFilterOptions();
        fetchVehicles();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles/filters`);
            setFilterOptions(response.data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchVehicles = async (filterParams = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vehicles`, {
                params: filterParams
            });
            setVehicles(response.data.vehicles || []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        const cleanFilters = Object.fromEntries(
            Object.entries(activeFilters).filter(([_, v]) => v !== '')
        );
        fetchVehicles(cleanFilters);
    };

    const resetFilters = () => {
        setActiveFilters({
            brand: '',
            model: '',
            year: '',
            price_min: '',
            price_max: '',
            condition: '',
            transmission: '',
            fuel_type: '',
            status: ''
        });
        fetchVehicles();
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: { label: t('veh_filter_available', 'Disponible'), class: 'bg-green-500' },
            negotiating: { label: t('veh_filter_negotiating', 'En Négociation'), class: 'bg-orange-500' },
            sold: { label: t('veh_filter_sold', 'Vendu'), class: 'bg-red-600' }
        };
        return badges[status] || badges.available;
    };

    return (
        <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="bg-suloc-blue text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('veh_catalog_title', 'Catalogue de Véhicules')}</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {t('veh_catalog_desc', 'Découvrez notre sélection de véhicules neufs et d\'occasion')}
                    </p>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    {/* Filter Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-md mb-12 border border-gray-100">
                        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {/* Brand */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_brand', 'Marque')}
                                </label>
                                <select
                                    value={activeFilters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all_brands', 'Toutes les marques')}</option>
                                    {filterOptions.brands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_model', 'Modèle')}
                                </label>
                                <input
                                    type="text"
                                    value={activeFilters.model}
                                    onChange={(e) => handleFilterChange('model', e.target.value)}
                                    placeholder="Ex: RAV4"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_year', 'Année')}
                                </label>
                                <select
                                    value={activeFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all_years', 'Toutes les années')}</option>
                                    {filterOptions.years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Transmission */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_transmission', 'Transmission')}
                                </label>
                                <select
                                    value={activeFilters.transmission}
                                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all', 'Toutes')}</option>
                                    <option value="automatic">{t('veh_filter_auto', 'Automatique')}</option>
                                    <option value="manual">{t('veh_filter_manual', 'Manuelle')}</option>
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_fuel', 'Carburant')}
                                </label>
                                <select
                                    value={activeFilters.fuel_type}
                                    onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all', 'Tous')}</option>
                                    <option value="petrol">{t('veh_filter_petrol', 'Essence')}</option>
                                    <option value="diesel">{t('veh_filter_diesel', 'Diesel')}</option>
                                    <option value="hybrid">{t('veh_filter_hybrid', 'Hybride')}</option>
                                    <option value="electric">{t('veh_filter_electric', 'Électrique')}</option>
                                </select>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_condition', 'État')}
                                </label>
                                <select
                                    value={activeFilters.condition}
                                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all', 'Tous')}</option>
                                    <option value="new">{t('veh_filter_new', 'Neuf')}</option>
                                    <option value="used">{t('veh_filter_used', 'Occasion')}</option>
                                    <option value="certified">{t('veh_filter_certified', 'Certifié')}</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_status', 'Statut')}
                                </label>
                                <select
                                    value={activeFilters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                >
                                    <option value="">{t('veh_filter_all', 'Tous')}</option>
                                    <option value="available">{t('veh_filter_available', 'Disponible')}</option>
                                    <option value="negotiating">{t('veh_filter_negotiating', 'En Négociation')}</option>
                                    <option value="sold">{t('veh_filter_sold', 'Vendu')}</option>
                                </select>
                            </div>

                            {/* Price Min */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_price_min', 'Prix Min')}
                                </label>
                                <input
                                    type="number"
                                    value={activeFilters.price_min}
                                    onChange={(e) => handleFilterChange('price_min', e.target.value)}
                                    placeholder="Min"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                />
                            </div>

                            {/* Price Max */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {t('veh_filter_price_max', 'Prix Max')}
                                </label>
                                <input
                                    type="number"
                                    value={activeFilters.price_max}
                                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                    placeholder="Max"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-blue bg-gray-50"
                                />
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-3 lg:col-span-1 xl:col-span-1 flex items-end space-x-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-suloc-blue text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
                                >
                                    <Filter size={18} /> {t('veh_filter_btn_filter', 'Filtrer')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-lg hover:bg-gray-300 transition"
                                    title={t('veh_filter_btn_reset', 'Réinitialiser')}
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-pulse text-suloc-blue text-xl">{t('home_loading_msg', 'Chargement...')}</div>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-block p-6 rounded-full bg-blue-100 text-suloc-blue mb-4">
                                <Car size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {t('veh_no_results_title', 'Aucun véhicule trouvé')}
                            </h2>
                            <p className="text-gray-600 mb-8">
                                {t('veh_no_results_desc', 'Essayez de modifier vos critères de recherche')}
                            </p>
                            <a
                                href="/#contact"
                                className="bg-suloc-gold text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
                            >
                                {t('veh_btn_custom', 'Demander un véhicule personnalisé')}
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vehicles.map((vehicle) => {
                                const statusBadge = getStatusBadge(vehicle.status);
                                return (
                                    <div
                                        key={vehicle.id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition duration-300 border border-gray-100"
                                    >
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            {vehicle.is_featured && (
                                                <div className="absolute top-4 left-4 bg-suloc-gold text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wide">
                                                    {t('veh_badge_featured', 'En Vedette')}
                                                </div>
                                            )}

                                            <Link to={`/vehicles/${vehicle.id}`}>
                                                {vehicle.main_image ? (
                                                    <img
                                                        src={vehicle.main_image}
                                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                        <Car size={64} />
                                                    </div>
                                                )}

                                                <div className={`absolute bottom-4 left-4 ${statusBadge.class} text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wide shadow-lg`}>
                                                    {statusBadge.label}
                                                </div>

                                                {vehicle.status === 'sold' && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[5]">
                                                        <span className="border-4 border-white text-white font-black text-2xl px-6 py-2 uppercase transform -rotate-12">
                                                            {t('veh_sold_stamp', 'VENDU')}
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-gray-500 text-sm font-medium mb-1">
                                                        {vehicle.year}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-suloc-blue group-hover:text-suloc-gold transition">
                                                        <Link to={`/vehicles/${vehicle.id}`}>
                                                            {vehicle.brand} {vehicle.model}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="bg-blue-50 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                                    {vehicle.vehicle_condition}
                                                </div>
                                            </div>

                                            {/* Key Specs */}
                                            <div className="flex items-center space-x-4 my-4 text-sm text-gray-600 border-t border-b border-gray-100 py-3">
                                                <div className="flex items-center" title="Transmission">
                                                    ⚙️ {vehicle.transmission?.substring(0, 4)}.
                                                </div>
                                                <div className="flex items-center" title="Carburant">
                                                    ⛽ {vehicle.fuel_type}
                                                </div>
                                                <div className="flex items-center" title="Kilométrage">
                                                    🏁 {new Intl.NumberFormat().format(vehicle.mileage)} km
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-2xl font-bold text-suloc-blue">
                                                    ${new Intl.NumberFormat().format(vehicle.price)}
                                                    <span className="text-sm font-normal text-gray-500 ml-1">
                                                        {vehicle.currency}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/vehicles/${vehicle.id}`}
                                                    className="inline-block border-2 border-suloc-blue text-suloc-blue px-4 py-2 rounded-lg font-bold hover:bg-suloc-blue hover:text-white transition text-sm"
                                                >
                                                    {t('veh_btn_details', 'Détails')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Vehicles;

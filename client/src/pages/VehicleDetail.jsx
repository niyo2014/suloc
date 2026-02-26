import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, X, Phone, MessageCircle, Mail } from 'lucide-react';
import axios from 'axios';

const VehicleDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
                setVehicle(response.data.vehicle);
            } catch (error) {
                console.error('Error fetching vehicle:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-suloc-blue">{t('home_loading_msg', 'Loading...')}</div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('veh_not_found', 'Vehicle not found')}</h2>
                <Link to="/vehicles" className="text-suloc-blue hover:underline">
                    {t('veh_back_catalog', 'Back to catalog')}
                </Link>
            </div>
        );
    }

    const allImages = [
        vehicle.main_image,
        ...(vehicle.vehicle_images || []).map(img => img.image_url)
    ].filter(Boolean);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const navigateLightbox = (direction) => {
        setCurrentImageIndex((prev) =>
            (prev + direction + allImages.length) % allImages.length
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: { label: t('veh_filter_available', 'Disponible'), class: 'bg-green-100 text-green-800' },
            negotiating: { label: t('veh_filter_negotiating', 'En Négociation'), class: 'bg-orange-100 text-orange-800' },
            sold: { label: t('veh_filter_sold', 'Vendu'), class: 'bg-red-100 text-red-800' }
        };
        return badges[status] || badges.available;
    };

    const statusBadge = getStatusBadge(vehicle.status);

    return (
        <div className="animate-in fade-in duration-700">
            {/* Breadcrumb */}
            <section className="bg-gray-50 py-4 border-b">
                <div className="container mx-auto px-6">
                    <nav className="flex space-x-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-suloc-gold">{t('nav_home', 'Accueil')}</Link>
                        <span>&gt;</span>
                        <Link to="/vehicles" className="hover:text-suloc-gold">{t('nav_vehicles', 'Véhicules')}</Link>
                        <span>&gt;</span>
                        <span className="text-suloc-gold font-semibold">
                            {vehicle.brand} {vehicle.model}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-suloc-blue mb-2">
                                {vehicle.brand} {vehicle.model}
                                <span className={`ml-3 text-sm ${statusBadge.class} px-3 py-1 rounded-full align-middle uppercase tracking-wider font-bold`}>
                                    {statusBadge.label}
                                </span>
                            </h1>
                            <p className="text-gray-500 text-lg mb-6">
                                {vehicle.year} • {vehicle.vehicle_condition}
                            </p>

                            {/* Main Image */}
                            <div
                                className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative group cursor-zoom-in"
                                onClick={() => openLightbox(0)}
                            >
                                {vehicle.main_image ? (
                                    <>
                                        <img
                                            src={vehicle.main_image}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="w-full h-auto object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                            <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                🔍
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {/* Gallery Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 mb-8">
                                    {allImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-suloc-gold' : 'border-gray-200'} cursor-pointer hover:border-suloc-gold transition aspect-square`}
                                            onClick={() => openLightbox(index)}
                                        >
                                            <img
                                                src={img}
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Vehicle Specs */}
                            <div className="bg-gray-50 rounded-xl p-8 mb-8">
                                <h2 className="text-xl font-bold text-suloc-blue mb-6 border-b border-gray-200 pb-2">
                                    {t('veh_specs_title', 'Spécifications')}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_label_mileage', 'Kilométrage')}</span>
                                        <span className="font-semibold text-gray-800">
                                            {new Intl.NumberFormat().format(vehicle.mileage)} km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_filter_fuel', 'Carburant')}</span>
                                        <span className="font-semibold text-gray-800">{vehicle.fuel_type}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_filter_transmission', 'Transmission')}</span>
                                        <span className="font-semibold text-gray-800">{vehicle.transmission}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_label_engine', 'Moteur')}</span>
                                        <span className="font-semibold text-gray-800">{vehicle.engine_size}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_label_color', 'Couleur')}</span>
                                        <span className="font-semibold text-gray-800">{vehicle.color}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm">{t('veh_label_doors_seats', 'Portes / Sièges')}</span>
                                        <span className="font-semibold text-gray-800">
                                            {vehicle.doors} / {vehicle.seats}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose max-w-none text-gray-700">
                                <h2 className="text-2xl font-bold text-suloc-blue mb-4">{t('form_label_message', 'Description')}</h2>
                                <p className="whitespace-pre-line">
                                    {i18n.language === 'en'
                                        ? (vehicle.description_en || vehicle.description_fr)
                                        : (vehicle.description_fr || vehicle.description_en)}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar CTA */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 sticky top-24">
                                <div className="mb-6">
                                    <span className="block text-gray-500 mb-1">{t('veh_price', 'Prix')}</span>
                                    <div className="text-4xl font-bold text-suloc-gold">
                                        ${new Intl.NumberFormat().format(vehicle.price)}
                                        <span className="text-xl ml-2">{vehicle.currency}</span>
                                    </div>
                                </div>


                                {vehicle.status !== 'sold' && (
                                    <div className="space-y-4">
                                        <a
                                            href={`https://wa.me/25762400920?text=${encodeURIComponent(t('veh_wa_interest', 'Bonjour SULOC, je suis intéressé par le véhicule : {brand} {model}').replace('{brand}', vehicle.brand).replace('{model}', vehicle.model))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={20} /> WhatsApp
                                        </a>
                                        <a
                                            href="/#contact"
                                            className="block w-full text-center bg-suloc-blue text-white font-bold py-4 rounded-lg hover:bg-blue-800 transition shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Mail size={20} /> {t('veh_btn_offer', 'Demander une offre')}
                                        </a>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-suloc-blue mb-2">{t('veh_help_title', 'Besoin d\'aide ?')}</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {t('veh_help_desc', 'Appelez nos experts pour plus d\'infos :')}
                                    </p>
                                    <a
                                        href="tel:+25762400920"
                                        className="text-suloc-blue font-bold hover:underline flex items-center gap-2"
                                    >
                                        <Phone size={18} /> +257 62 400 920
                                    </a>

                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h3 className="font-bold text-suloc-blue mb-3">{t('veh_quick_details', 'Détails rapides')}</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{t('veh_filter_year', 'Année')}</span>
                                                <span className="font-semibold text-gray-900">{vehicle.year}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{t('veh_label_mileage', 'Kilométrage')}</span>
                                                <span className="font-semibold text-gray-900">{new Intl.NumberFormat().format(vehicle.mileage)} km</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{t('veh_filter_fuel', 'Carburant')}</span>
                                                <span className="font-semibold text-gray-900 capitalize">{vehicle.fuel_type}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{t('veh_filter_transmission', 'Transmission')}</span>
                                                <span className="font-semibold text-gray-900 capitalize">{vehicle.transmission}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">{t('veh_label_engine', 'Moteur')}</span>
                                                <span className="font-semibold text-gray-900">{vehicle.engine_size}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-[999] flex flex-col items-center justify-center p-4 md:p-10">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white text-3xl hover:text-suloc-gold transition z-[1001]"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={() => navigateLightbox(-1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-suloc-gold transition z-[1001] p-4"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button
                        onClick={() => navigateLightbox(1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-suloc-gold transition z-[1001] p-4"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={`View ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-full border border-gray-700">
                        {currentImageIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetail;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    ShoppingCart
} from 'lucide-react';
import useSystemStatus from '../../hooks/useSystemStatus';

const AdminVehicles = () => {
    const { isModuleFrozen } = useSystemStatus();
    const isFrozen = isModuleFrozen('vehicles');

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    // Status badges helper
    const getStatusBadge = (status) => {
        switch (status) {
            case 'available':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle size={12} /> Disponible</span>;
            case 'negotiating':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1"><AlertCircle size={12} /> En négo</span>;
            case 'sold':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><ShoppingCart size={12} /> Vendu</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/vehicles/admin/all', {
                withCredentials: true
            });
            setVehicles(response.data.vehicles);
            setError(null);
        } catch (err) {
            console.error('Error fetching admin vehicles:', err);
            setError('Impossible de charger les véhicules. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.')) {
            return;
        }

        try {
            await axios.delete(`/api/vehicles/admin/${id}`, {
                withCredentials: true
            });
            setVehicles(vehicles.filter(v => v.id !== id));
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            alert('Erreur lors de la suppression du véhicule.');
        }
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-suloc-blue"></div>
        </div>
    );

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Véhicules</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez votre inventaire, ajoutez de nouveaux véhicules et mettez à jour les statuts.</p>
                </div>
                <Link
                    to="/admin/vehicles/add"
                    className={`bg-suloc-blue text-white px-4 py-2 rounded-lg hover:bg-suloc-blue-dark transition-colors flex items-center gap-2 shadow-sm font-medium text-sm ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Plus size={18} />
                    Ajouter un véhicule
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 text-sm border border-red-100">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par marque ou modèle..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Véhicule</th>
                                <th className="px-6 py-3 text-left">Prix</th>
                                <th className="px-6 py-3 text-center">Année</th>
                                <th className="px-6 py-3 text-center">Statut</th>
                                <th className="px-6 py-3 text-center">Visibilité</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                                        Aucun véhicule trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {vehicle.main_image ? (
                                                        <img src={vehicle.main_image} alt={vehicle.model} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                            <Car size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">{vehicle.brand} {vehicle.model}</div>
                                                    <div className="text-xs text-gray-500">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'} • {vehicle.fuel_type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: vehicle.currency || 'USD' }).format(vehicle.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                                            {vehicle.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(vehicle.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${vehicle.is_active ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {vehicle.is_active ? 'Actif' : 'Masqué'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/vehicles/${vehicle.id}`} target="_blank" className="text-gray-400 hover:text-suloc-blue transition-colors p-1" title="Voir sur le site">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/admin/vehicles/edit/${vehicle.id}`}
                                                    className={`text-blue-500 hover:text-blue-700 transition-colors p-1 ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}
                                                    title="Modifier"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    disabled={isFrozen}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-500 flex justify-between">
                    <span>Affichage de {filteredVehicles.length} véhicules</span>
                    {/* Pagination could go here */}
                </div>
            </div>
        </div>
    );
};

export default AdminVehicles;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Globe
} from 'lucide-react';
import useSystemStatus from '../../hooks/useSystemStatus';

const AdminVisas = () => {
    const { isModuleFrozen } = useSystemStatus();
    const isFrozen = isModuleFrozen('visa');

    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchVisas();
    }, []);

    const fetchVisas = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/visas/admin/all', {
                withCredentials: true
            });
            setVisas(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching admin visas:', err);
            setError('Impossible de charger les services de visa. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service de visa ?')) {
            return;
        }

        try {
            await axios.delete(`/api/visas/admin/${id}`, {
                withCredentials: true
            });
            setVisas(visas.filter(v => v.id !== id));
        } catch (err) {
            console.error('Error deleting visa:', err);
            alert('Erreur lors de la suppression.');
        }
    };

    const filteredVisas = visas.filter(visa =>
        (visa.country_name_fr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visa.country_name_en || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Visas</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez les services de visa, les pays et les conditions d'entrée.</p>
                </div>
                <Link
                    to="/admin/visas/add"
                    className={`bg-suloc-blue text-white px-4 py-2 rounded-lg hover:bg-suloc-blue-dark transition-colors flex items-center gap-2 shadow-sm font-medium text-sm ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Plus size={18} />
                    Ajouter un service
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
                        placeholder="Rechercher un pays..."
                        className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Pays (FR / EN)</th>
                                <th className="px-6 py-3 text-left">Frais</th>
                                <th className="px-6 py-3 text-center">Délai</th>
                                <th className="px-6 py-3 text-center">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredVisas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                                        Aucun service de visa trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredVisas.map((visa) => (
                                    <tr key={visa.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-suloc-blue font-bold text-xs">
                                                    {visa.country_code || <Globe size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">{visa.country_name_fr}</div>
                                                    <div className="text-xs text-gray-500">{visa.country_name_en}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {visa.service_fee
                                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: visa.currency || 'USD' }).format(visa.service_fee)
                                                : <span className="text-gray-400 italic">Sur demande</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                                            {visa.processing_time || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${visa.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {visa.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/visas/edit/${visa.id}`}
                                                    className={`text-blue-500 hover:text-blue-700 transition-colors p-1 ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}
                                                    title="Modifier"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(visa.id)}
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
            </div>
        </div>
    );
};

export default AdminVisas;

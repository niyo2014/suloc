import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, Edit, Eye, ArrowRight } from 'lucide-react';

const API_BASE_URL = '';

const AdminVisaAssistance = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Status Mapping from PHP
    const statuses = {
        'received': { label: 'Reçue', class: 'bg-gray-100 text-gray-800' },
        'analyzing': { label: 'Analyse', class: 'bg-blue-100 text-blue-800' },
        'docs_incomplete': { label: 'Incomplet', class: 'bg-orange-100 text-orange-800' },
        'docs_complete': { label: 'Complet', class: 'bg-indigo-100 text-indigo-800' },
        'submitted': { label: 'Déposé', class: 'bg-purple-100 text-purple-800' },
        'pending_response': { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
        'accepted': { label: 'Accepté', class: 'bg-green-100 text-green-800' },
        'rejected': { label: 'Refusé', class: 'bg-red-100 text-red-800' },
        'closed': { label: 'Clôturé', class: 'bg-gray-400 text-white' }
    };

    const query = new URLSearchParams(location.search);
    const filter = query.get('status') || 'all';

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/visas/admin/assistance?status=${filter}`, {
                withCredentials: true
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (status) => {
        navigate(`?status=${status}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#003366] flex items-center">
                        Demandes Assistance Visa
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-lg text-sm transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Tous
                        </button>
                        {Object.entries(statuses).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => handleFilterChange(key)}
                                className={`px-4 py-2 rounded-lg text-sm transition ${filter === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                {data.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#003366] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Client</th>
                                    <th className="px-6 py-4 text-left font-semibold">Trajet / Type</th>
                                    <th className="px-6 py-4 text-center font-semibold">Statut</th>
                                    <th className="px-6 py-4 text-left font-semibold">Date Soumission</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#003366] mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">Aucune demande trouvée.</td>
                                    </tr>
                                ) : (
                                    requests.map(request => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#003366]">{request.full_name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{request.email}</div>
                                                <div className="text-xs text-blue-600 font-medium">{request.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span>{request.origin_country}</span>
                                                    <ArrowRight size={14} className="text-gray-400" />
                                                    <span className="font-semibold">{request.destination_country}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 uppercase tracking-tight">
                                                    Visa {request.visa_type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statuses[request.status]?.class || 'bg-gray-100'}`}>
                                                    {statuses[request.status]?.label || request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(request.created_at).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => navigate(`/admin/visa-assistance/${request.id}`)}
                                                        className="text-blue-600 hover:text-blue-800 transition"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <a
                                                        href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:text-green-800 transition"
                                                    >
                                                        <MessageCircle size={20} />
                                                    </a>
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
        </div>
    );
};

export default AdminVisaAssistance;

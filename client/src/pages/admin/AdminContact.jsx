import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Trash2, Search, Filter, Mail, Phone,
    Calendar, CheckCircle, Clock, Reply,
    FileText, User, MessageSquare, Download,
    ChevronDown, X, Trash
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const AdminContact = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/contact/admin/submissions`, {
                withCredentials: true
            });
            setSubmissions(res.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/contact/admin/submissions/${id}`, { status }, {
                withCredentials: true
            });
            fetchSubmissions();
            if (selectedSubmission && selectedSubmission.id === id) {
                setSelectedSubmission({ ...selectedSubmission, status });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/contact/admin/submissions/${id}`, {
                withCredentials: true
            });
            fetchSubmissions();
            setSelectedSubmission(null);
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'read': return 'bg-purple-100 text-purple-700';
            case 'replied': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const exportToCSV = () => {
        const headers = ['Nom', 'Email', 'Téléphone', 'Service', 'Message', 'Statut', 'Date'];
        const csvData = submissions.map(sub => [
            sub.name, sub.email, sub.phone, sub.service_type,
            sub.message.replace(/,/g, ' '), sub.status, sub.created_at
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + csvData.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contact_submissions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-navy uppercase tracking-tight">Soumissions de Contact</h1>
                    <p className="text-gray-500 font-medium">Gérez les messages envoyés depuis le site web</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-white text-navy px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm border border-gray-100"
                >
                    <Download size={20} /> Exporter CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col md:row items-center gap-6">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, message..."
                        className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="bg-gray-50 border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-suloc-blue/10 outline-none font-bold appearance-none min-w-[180px]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tous les Statuts</option>
                        <option value="new">Nouveaux</option>
                        <option value="read">Lus</option>
                        <option value="replied">Répondus</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-sm font-black text-navy uppercase tracking-widest">Client</th>
                                <th className="px-8 py-6 text-sm font-black text-navy uppercase tracking-widest">Service</th>
                                <th className="px-8 py-6 text-sm font-black text-navy uppercase tracking-widest">Date</th>
                                <th className="px-8 py-6 text-sm font-black text-navy uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-sm font-black text-navy uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSubmissions.map((sub) => (
                                <tr
                                    key={sub.id}
                                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${sub.status === 'new' ? 'font-black' : ''}`}
                                    onClick={() => setSelectedSubmission(sub)}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${sub.status === 'new' ? 'bg-suloc-blue' : 'bg-gray-300'
                                                }`}>
                                                {sub.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-navy">{sub.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{sub.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {sub.service_type || 'Général'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-gray-500 text-sm font-medium">
                                        {new Date(sub.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-suloc-blue hover:text-navy font-bold text-sm">Voir Détails</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-navy/20">
                    <div className="bg-white rounded-[3rem] shadow-4xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-suloc-blue rounded-2xl flex items-center justify-center text-white shadow-xl">
                                        <MessageSquare size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-navy">Détails du Message</h2>
                                        <p className="text-gray-400 font-medium">Soumission #{selectedSubmission.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} className="p-3 bg-gray-50 text-gray-400 hover:text-navy rounded-2xl">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Informations Client</p>
                                    <div className="space-y-4 font-bold text-navy">
                                        <p className="flex items-center gap-3"><User size={18} className="text-suloc-blue" /> {selectedSubmission.name}</p>
                                        <p className="flex items-center gap-3"><Mail size={18} className="text-suloc-gold" /> {selectedSubmission.email}</p>
                                        <p className="flex items-center gap-3"><Phone size={18} className="text-green-500" /> {selectedSubmission.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Détails de la demande</p>
                                    <div className="space-y-4 font-bold text-navy">
                                        <p className="flex items-center gap-3"><FileText size={18} className="text-purple-500" /> {selectedSubmission.service_type || 'Général'}</p>
                                        <p className="flex items-center gap-3"><Calendar size={18} className="text-red-500" /> {new Date(selectedSubmission.created_at).toLocaleString()}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(selectedSubmission.id, 'read')}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${selectedSubmission.status === 'read' ? 'bg-purple-100 text-purple-700' : 'bg-white border'}`}
                                            >Lu</button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedSubmission.id, 'replied')}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${selectedSubmission.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-white border'}`}
                                            >Répondu</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-10">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Message</p>
                                <p className="text-navy font-medium leading-relaxed whitespace-pre-wrap">
                                    {selectedSubmission.message}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <a
                                    href={`mailto:${selectedSubmission.email}?subject=Re: SULOC Contact`}
                                    className="flex-grow bg-suloc-blue hover:bg-navy text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3"
                                >
                                    <Reply size={24} /> Répondre par Email
                                </a>
                                <button
                                    onClick={() => handleDelete(selectedSubmission.id)}
                                    className="p-5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContact;

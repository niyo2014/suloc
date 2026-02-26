import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Search, Trash2, Edit, CheckCircle, XCircle, Clock,
    Ship, Filter, RefreshCw, Download, Calendar,
    AlertTriangle, FileText, Send, CheckSquare, X, ChevronDown,
    MoreHorizontal, FileSpreadsheet, File as FilePdf
} from 'lucide-react';
import useSystemStatus from '../../hooks/useSystemStatus';

const AdminLogistics = () => {
    const { isModuleFrozen } = useSystemStatus();
    const isFrozen = isModuleFrozen('logistics');

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [portFilter, setPortFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [modalStatus, setModalStatus] = useState('');
    const exportDropdownRef = useRef(null);

    useEffect(() => {
        fetchRequests();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
                setIsExportDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/logistics/admin/requests', {
                withCredentials: true
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManage = (req) => {
        setSelectedRequest(req);
        setModalStatus(req.status);
        setIsManageModalOpen(true);
    };

    const handleSaveStatus = async () => {
        try {
            await axios.put(`/api/logistics/admin/requests/${selectedRequest.id}/status`,
                { status: modalStatus },
                { withCredentials: true }
            );
            setRequests(requests.map(req => req.id === selectedRequest.id ? { ...req, status: modalStatus } : req));
            setIsManageModalOpen(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setPortFilter('all');
        setDateFrom('');
        setDateTo('');
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.client_name?.toLowerCase().includes(search.toLowerCase()) ||
            req.commodity_type?.toLowerCase().includes(search.toLowerCase()) ||
            req.client_phone?.includes(search);

        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        const matchesPort = portFilter === 'all' || req.transit_port === portFilter;

        // Date filtering
        const reqDate = new Date(req.created_at);
        const matchesDateFrom = !dateFrom || reqDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || reqDate <= new Date(dateTo + 'T23:59:59');

        return matchesSearch && matchesStatus && matchesPort && matchesDateFrom && matchesDateTo;
    });

    // Stats
    const stats = {
        total: requests.length,
        mombasa: requests.filter(r => r.transit_port === 'Mombasa').length,
        dar: requests.filter(r => r.transit_port === 'Dar_es_Salaam').length,
        new: requests.filter(r => r.status === 'new').length,
        in_transit: requests.filter(r => r.status === 'in_transit').length
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'new': return { label: 'Nouveau', color: 'text-blue-600', bg: 'bg-blue-50', icon: <FileText size={16} /> };
            case 'quote_sent': return { label: 'Devis Envoyé', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Send size={16} /> };
            case 'docs_pending': return { label: 'Documents Manquants', color: 'text-amber-600', bg: 'bg-amber-50', icon: <AlertTriangle size={16} /> };
            case 'in_transit': return { label: 'En Transit', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: <Ship size={16} /> };
            case 'completed': return { label: 'Livré/Terminé', color: 'text-green-600', bg: 'bg-green-50', icon: <CheckSquare size={16} /> };
            case 'cancelled': return { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-50', icon: <X size={16} /> };
            default: return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', icon: <Clock size={16} /> };
        }
    };

    // Robust Download Helper
    const downloadFile = (blob, fileName) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Export Logic
    const exportToExcel = () => {
        try {
            if (!filteredRequests.length) {
                alert("Aucune donnée à exporter");
                return;
            }

            const data = filteredRequests.map(req => {
                let formattedDate = 'N/A';
                try {
                    if (req.created_at) {
                        formattedDate = new Date(req.created_at).toLocaleDateString();
                    }
                } catch (e) {
                    console.error("Error formatting date:", e);
                }

                return {
                    ID: `#${req.id}`,
                    Client: req.client_name,
                    Telephone: req.client_phone,
                    Email: req.client_email || 'N/A',
                    Origine: req.origin_country,
                    Destination: req.destination_country,
                    Port: req.transit_port?.replace('_', ' ') || 'N/A',
                    Marchandise: req.commodity_type || 'N/A',
                    Container: req.container_size?.replace('ft_', '') + 'ft',
                    Incoterm: req.incoterm || 'N/A',
                    Statut: getStatusInfo(req.status).label,
                    Date: formattedDate
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Logistique");

            // Explicit blob creation for reliable download
            const wbOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = `SULOC_Logistique_${new Date().toISOString().split('T')[0]}.xlsx`;
            downloadFile(blob, fileName);

            setIsExportDropdownOpen(false);
        } catch (error) {
            console.error("Excel Export Error:", error);
            alert(`Erreur lors de l'export Excel: ${error.message}`);
        }
    };

    const exportToPDF = () => {
        try {
            if (!filteredRequests.length) {
                alert("Aucune donnée à exporter");
                return;
            }

            const doc = new jsPDF('landscape');
            doc.text("Rapport Logistique SULOC", 14, 15);

            const tableColumn = ["ID", "Client", "Route", "Port", "Cargo", "Size", "Statut", "Date"];
            const tableRows = filteredRequests.map(req => [
                `#${req.id}`,
                req.client_name,
                `${req.origin_country} -> ${req.destination_country}`,
                req.transit_port?.replace('_', ' '),
                req.commodity_type || 'N/A',
                req.container_size?.replace('ft_', '') + 'ft',
                getStatusInfo(req.status).label,
                new Date(req.created_at).toLocaleDateString()
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: 'grid',
                headStyles: { fillColor: [30, 58, 138], textColor: 255 }
            });

            // Explicit blob creation for reliable download
            const blob = doc.output('blob');
            const fileName = `SULOC_Logistique_${new Date().toISOString().split('T')[0]}.pdf`;
            downloadFile(blob, fileName);

            setIsExportDropdownOpen(false);
        } catch (error) {
            console.error("PDF Export Error:", error);
            alert(`Erreur lors de l'export PDF: ${error.message}`);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Centre de Commande Logistique</h1>
                    <p className="text-slate-500 mt-1">Gérez et suivez les importations en temps réel</p>
                </div>

                <div className="relative" ref={exportDropdownRef}>
                    <button
                        onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-100"
                    >
                        <Download size={18} />
                        Exporter
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExportDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={exportToExcel}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                            >
                                <FileSpreadsheet size={18} className="text-emerald-500" />
                                Vers Excel (.xlsx)
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-red-700 transition border-t border-slate-50"
                            >
                                <FilePdf size={18} className="text-red-500" />
                                Vers PDF (.pdf)
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {[
                    { label: 'TOTAL DEMANDES', value: stats.total, color: 'border-slate-200' },
                    { label: 'CORRIDOR MOMBASA', value: stats.mombasa, color: 'border-blue-200 bg-blue-50/30 text-blue-700' },
                    { label: 'CORRIDOR DAR', value: stats.dar, color: 'border-emerald-200 bg-emerald-50/30 text-emerald-700' },
                    { label: 'NOUVELLES', value: stats.new, color: 'border-orange-200 bg-orange-50/30 text-orange-700' },
                    { label: 'EN TRANSIT', value: stats.in_transit, color: 'border-indigo-200 bg-indigo-50/30 text-indigo-700' }
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl bg-white border-2 ${stat.color} shadow-sm transition hover:shadow-md`}>
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-3 opacity-60">{stat.label}</p>
                        <p className="text-4xl font-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Du (Date)</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-800 outline-none" />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Au (Date)</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-800 outline-none" />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Port</label>
                        <select value={portFilter} onChange={e => setPortFilter(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-800 outline-none appearance-none">
                            <option value="all">Tous les ports</option>
                            <option value="Mombasa">Mombasa</option>
                            <option value="Dar_es_Salaam">Dar es Salaam</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Statut</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-800 outline-none appearance-none">
                            <option value="all">Tous les statuts</option>
                            <option value="new">Nouveau</option>
                            <option value="quote_sent">Devis Envoyé</option>
                            <option value="docs_pending">Documents Manquants</option>
                            <option value="in_transit">En Transit</option>
                            <option value="completed">Livré/Terminé</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </div>
                    <div className="col-span-1 relative">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Rechercher</label>
                        <input
                            type="text"
                            placeholder="Nom, Cargo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-slate-800 outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-slate-800 text-white rounded-xl px-6 py-2 transition hover:bg-slate-900 flex items-center justify-center">
                            <Filter size={18} />
                        </button>
                        <button onClick={resetFilters} className="bg-slate-100 text-slate-500 rounded-xl px-4 py-2 hover:bg-slate-200 transition">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-thicker">
                            <th className="px-8 py-5">ID</th>
                            <th className="px-8 py-5">Client</th>
                            <th className="px-8 py-5 text-center">Route / Port</th>
                            <th className="px-8 py-5 text-center">Cargo / Size</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="6" className="py-20 text-center text-slate-400 animate-pulse font-bold">Chargement du Centre de Commande...</td></tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-medium">Aucune donnée correspondant à vos filtres</td></tr>
                        ) : (
                            filteredRequests.map(req => {
                                const status = getStatusInfo(req.status);
                                return (
                                    <tr key={req.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                        <td className="px-8 py-6 font-bold text-slate-400">#{req.id}</td>
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-slate-800 leading-tight uppercase">{req.client_name}</div>
                                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{req.client_phone}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="text-[10px] font-bold text-slate-300 uppercase mb-2 flex items-center justify-center gap-1.5">
                                                {req.origin_country} <span className="text-[8px]">...</span> {req.destination_country}
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${req.transit_port === 'Mombasa' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                <Anchor size={10} /> {req.transit_port?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="font-bold text-slate-700 text-xs uppercase">{req.commodity_type || 'N/A'}</div>
                                            <div className="text-[10px] text-slate-400 mt-1">{req.container_size?.replace('ft_', '')}ft ({req.incoterm})</div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleManage(req)}
                                                disabled={isFrozen}
                                                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Edit size={14} /> Gérer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manage Modal */}
            {isManageModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsManageModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800">Gérer la demande #{selectedRequest.id}</h2>
                            <button onClick={() => setIsManageModalOpen(false)} className="text-slate-300 hover:text-slate-800 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Statut de la demande</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'new', ...getStatusInfo('new') },
                                    { id: 'quote_sent', ...getStatusInfo('quote_sent') },
                                    { id: 'in_progress', ...getStatusInfo('in_progress') },
                                    { id: 'docs_pending', ...getStatusInfo('docs_pending') },
                                    { id: 'in_transit', ...getStatusInfo('in_transit') },
                                    { id: 'completed', ...getStatusInfo('completed') },
                                    { id: 'cancelled', ...getStatusInfo('cancelled') }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setModalStatus(option.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${modalStatus === option.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={option.color}>{option.icon}</span>
                                            <span className="font-bold text-sm">{option.label}</span>
                                        </div>
                                        {modalStatus === option.id && <CheckCircle size={18} className="text-blue-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 flex gap-4">
                            <button
                                onClick={() => setIsManageModalOpen(false)}
                                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSaveStatus}
                                disabled={isFrozen}
                                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-[#1e3a8a] text-white hover:bg-blue-900 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogistics;

// Helper icons
const Anchor = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="5" r="3" />
        <path d="M12 22V8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
);

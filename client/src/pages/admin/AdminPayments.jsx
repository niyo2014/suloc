const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Plus, Filter, Banknote, Clock, CheckCircle,
    AlertTriangle, Eye, ShieldCheck, Printer, FileDown,
    User, Smartphone, MapPin, Receipt, X, RefreshCw, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSystemStatus from '../../hooks/useSystemStatus';

 

const AdminPayments = () => {
    const { isModuleFrozen } = useSystemStatus();
    const isFrozen = isModuleFrozen('payments');

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        ready: 0,
        paid: 0
    });

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');

    // Modals
    const [showNewTransferModal, setShowNewTransferModal] = useState(false);
    const [showGateModal, setShowGateModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [showImageZoom, setShowImageZoom] = useState(false);
    const [zoomedImageUrl, setZoomedImageUrl] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Form State (New Transfer)
    const [newTransfer, setNewTransfer] = useState({
        sender_name: '',
        sender_address: '',
        receiver_name: '',
        receiver_id_number: '',
        receiver_phone: '',
        receiver_address: '',
        amount: '',
        payment_service_id: '',
        payment_method: 'cash',
        currency: 'USD'
    });

    const [operators, setOperators] = useState([]);
    const [globalFeePercent, setGlobalFeePercent] = useState(5.97);

    useEffect(() => {
        fetchData();
        fetchOperators();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/payment/admin/requests');
            setRequests(response.data);

            // Basic stats calculation
            const s = {
                total: response.data.length,
                pending: response.data.filter(r => r.payout_status === 'Pending').length,
                ready: response.data.filter(r => r.payout_status === 'Ready').length,
                paid: response.data.filter(r => r.payout_status === 'Paid').length
            };
            setStats(s);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOperators = async () => {
        try {
            const res = await axios.get('/api/payment/operators');
            setOperators(res.data);
        } catch (error) {
            console.error("Error fetching operators:", error);
        }
    };

    const handleStatusUpdate = async (id, updates) => {
        try {
            await axios.patch(`/api/payment/admin/requests/${id}`, updates);
            fetchData();
            setShowBankModal(false);
            setShowGateModal(false);
        } catch (error) {
            alert("Erreur lors de la mise à jour");
        }
    };

    const [newTransferFiles, setNewTransferFiles] = useState({
        receiver_photo: null,
        bank_slip: null
    });

    const handleCreateTransfer = async (e) => {
        e.preventDefault();
        try {
            const amt = parseFloat(newTransfer.amount);
            const feeAmt = (amt * globalFeePercent) / 100;

            const formData = new FormData();

            // Append text fields
            Object.keys(newTransfer).forEach(key => {
                formData.append(key, newTransfer[key]);
            });

            // Append calculated fields
            formData.append('transfer_fee_percentage', globalFeePercent);
            formData.append('transfer_fee_amount', feeAmt);
            formData.append('total_to_pay', amt + feeAmt);
            formData.append('amount_to_receive', amt);

            // Append files
            if (newTransferFiles.receiver_photo) {
                formData.append('receiver_photo', newTransferFiles.receiver_photo);
            }
            if (newTransferFiles.bank_slip) {
                formData.append('bank_slip', newTransferFiles.bank_slip);
            }

            await axios.post('/api/payment/request', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setShowNewTransferModal(false);
            fetchData();
            setNewTransfer({
                sender_name: '', sender_address: '',
                receiver_name: '', receiver_id_number: '',
                receiver_phone: '', receiver_address: '',
                amount: '', payment_service_id: '',
                payment_method: 'cash', currency: 'USD'
            });
            setNewTransferFiles({ receiver_photo: null, bank_slip: null });
        } catch (error) {
            alert("Erreur lors de la création");
        }
    };

    // 3-Point Payout Logic
    const [gateCode, setGateCode] = useState('');
    const handleDisburse = async (e) => {
        e.preventDefault();
        if (gateCode.toUpperCase() === selectedRequest.verification_code) {
            await handleStatusUpdate(selectedRequest.id, {
                payout_status: 'Paid',
                status: 'completed'
            });
            setGateCode('');
        } else {
            alert("CODE SECRET INCORRECT ! Accès refusé.");
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = !search ||
            req.verification_code?.toLowerCase().includes(search.toLowerCase()) ||
            req.receiver_name?.toLowerCase().includes(search.toLowerCase()) ||
            req.sender_name?.toLowerCase().includes(search.toLowerCase()) ||
            req.receiver_phone?.includes(search);

        const matchesStatus = !statusFilter || req.payout_status === statusFilter;
        const matchesMethod = !methodFilter || req.payment_method === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Banknote className="text-suloc-blue" size={32} />
                        SULOC <span className="text-suloc-blue">Payment Control</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Gestion des flux monétaires et vérification 3-points.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/payments/services"
                        className={`flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <Settings size={20} />
                        Paramètres & Taux
                    </Link>
                    <button
                        onClick={() => setShowNewTransferModal(true)}
                        disabled={isFrozen}
                        className="flex items-center gap-2 bg-suloc-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-suloc-blue/20 hover:bg-navy transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        Nouveau Transfert
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Demandes', value: stats.total, icon: <Receipt />, color: 'blue' },
                    { label: 'En Attente', value: stats.pending, icon: <Clock />, color: 'amber' },
                    { label: 'Prêt pour Retrait', value: stats.ready, icon: <ShieldCheck />, color: 'emerald' },
                    { label: 'Déjà Payés', value: stats.paid, icon: <CheckCircle />, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Filters */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-grow relative min-w-[300px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Référence, Nom, Téléphone..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue focus:bg-white rounded-2xl outline-none transition font-medium"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-suloc-blue transition font-bold text-gray-600"
                >
                    <option value="">Tous les Statuts</option>
                    <option value="Pending">En Attente</option>
                    <option value="Ready">Prêt pour Retrait</option>
                    <option value="Paid">Payés</option>
                </select>
                <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-suloc-blue transition font-bold text-gray-600"
                >
                    <option value="">Tous les Modes</option>
                    <option value="cash">Cash 💵</option>
                    <option value="bank">Banque 🏦</option>
                </select>
                <button
                    onClick={fetchData}
                    className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition shadow-lg active:rotate-180 duration-500"
                >
                    <RefreshCw size={24} />
                </button>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Référence / Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Acteurs</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Montant</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-suloc-blue"></div>
                                            <p className="text-gray-400 font-bold italic">Chargement des transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Receipt size={64} className="text-gray-300" />
                                            <p className="text-gray-500 font-black uppercase text-sm tracking-widest">Aucune donnée trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-gray-900 group-hover:text-suloc-blue transition-colors">
                                            {req.verification_code ? req.verification_code : <span className="text-gray-300 italic">En attente...</span>}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1 capitalize">
                                            {new Date(req.created_at).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-suloc-blue font-black overflow-hidden shadow-sm ring-2 ring-white ring-offset-2">
                                                {req.receiver_photo ? (
                                                    <img src={req.receiver_photo.startsWith('http') ? req.receiver_photo : `${API_BASE_URL}${req.receiver_photo}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    req.receiver_name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-gray-900">{req.receiver_name}</div>
                                                <div className="text-[10px] font-bold text-suloc-blue opacity-70">ID: {req.receiver_id_number}</div>
                                                <div className="text-[9px] text-gray-400 tracking-tight mt-0.5 italic">De: {req.client_name || req.sender_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-lg font-black text-gray-900">
                                            {parseFloat(req.amount).toFixed(2)} <span className="text-xs text-gray-400 opacity-50 italic">{req.currency}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-red-500/60 lowercase mt-0.5">
                                            +{parseFloat(req.transfer_fee_amount).toFixed(2)} frais
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase inline-flex items-center justify-center w-fit
                            ${req.payout_status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    req.payout_status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                                                        req.payout_status === 'Paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                                            >
                                                {req.payout_status}
                                            </span>

                                            {req.payment_verification_status === 'pending' && (
                                                <button
                                                    onClick={() => { setSelectedRequest(req); setShowBankModal(true); }}
                                                    disabled={isFrozen}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase hover:bg-red-100 transition flex items-center gap-2 w-fit italic disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <AlertTriangle size={12} /> Bordereau à Vérifier
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {req.payout_status === 'Ready' ? (
                                            <button
                                                onClick={() => { setSelectedRequest(req); setShowGateModal(true); }}
                                                disabled={isFrozen}
                                                className="bg-suloc-gold text-navy px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-suloc-gold/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ backgroundColor: isFrozen ? '#e5e7eb' : '#d4af37', color: isFrozen ? '#9ca3af' : '#0a2342' }}
                                            >
                                                VÉRIFIER & PAYER
                                            </button>
                                        ) : req.payout_status === 'Paid' ? (
                                            <div className="text-emerald-600 font-black text-[10px] flex items-center justify-end gap-1 uppercase italic tracking-tighter">
                                                <CheckCircle size={14} /> Décaissement Terminé
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-[10px] font-bold italic uppercase tracking-widest">En Versement</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 3-Point Payout Gate */}
            {showGateModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-gray-900 p-8 md:p-10 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                                <ShieldCheck size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-1 italic">Gate Keeper Gate</h3>
                                <p className="text-suloc-blue font-bold flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] opacity-80 underline underline-offset-4">Identity Verification Protocol</p>
                            </div>
                            <X size={28} className="cursor-pointer text-white/40 hover:text-white relative z-10" onClick={() => setShowGateModal(false)} />
                        </div>

                        <div className="p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Bénéficiaire Attendu</label>
                                        <div className="text-2xl font-black text-gray-900 leading-tight">{selectedRequest.receiver_name}</div>
                                        <div className="text-sm font-black text-suloc-blue mt-2 flex items-center gap-2 italic">
                                            <User size={14} /> ID: {selectedRequest.receiver_id_number}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-2">
                                            <Smartphone size={14} /> {selectedRequest.receiver_phone}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                                        <label className="block text-[10px] font-black text-emerald-800 uppercase mb-2 italic">Cash à Remettre</label>
                                        <div className="text-4xl font-black text-emerald-700">
                                            {parseFloat(selectedRequest.amount_to_receive).toFixed(2)} <span className="text-xl opacity-40">{selectedRequest.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-full h-64 rounded-3xl overflow-hidden shadow-2xl ring-[12px] ring-white transform rotate-1 border border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer hover:ring-suloc-blue transition-all group"
                                        onClick={() => {
                                            if (selectedRequest.receiver_photo) {
                                                const imageUrl = selectedRequest.receiver_photo.startsWith('http')
                                                    ? selectedRequest.receiver_photo
                                                    : `${API_BASE_URL}${selectedRequest.receiver_photo}`;
                                                setZoomedImageUrl(imageUrl);
                                                setShowImageZoom(true);
                                            }
                                        }}
                                    >
                                        {selectedRequest.receiver_photo ? (
                                            <div className="relative w-full h-full">
                                                <img src={selectedRequest.receiver_photo.startsWith('http') ? selectedRequest.receiver_photo : `${API_BASE_URL}${selectedRequest.receiver_photo}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="text-white text-center">
                                                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                        <p className="text-xs font-black uppercase">Cliquer pour agrandir</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-8">
                                                <User size={64} className="text-gray-200 mx-auto" />
                                                <p className="text-[10px] font-black text-gray-300 uppercase mt-4">Pas de photo disponible</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 px-6 py-2 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase italic tracking-widest shadow-xl">Vérification Visuelle Obligatoire</div>
                                </div>
                            </div>

                            <form onSubmit={handleDisburse} className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase text-center mb-6 tracking-[0.4em] opacity-60 italic">Code Présenté par le Client</label>
                                    <input
                                        type="text"
                                        value={gateCode}
                                        onChange={(e) => setGateCode(e.target.value.toUpperCase())}
                                        required
                                        placeholder="SU-XXX-XXX"
                                        className="w-full text-center py-8 text-5xl font-mono font-black border-4 border-gray-100 rounded-[2.5rem] bg-gray-50 focus:border-suloc-blue focus:bg-white transition-all outline-none tracking-[0.2em] shadow-inner uppercase"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowGateModal(false)}
                                        className="flex-1 py-6 bg-gray-100 text-gray-500 font-black rounded-3xl hover:bg-gray-200 transition text-lg active:scale-95"
                                    >
                                        ANNULER
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isFrozen}
                                        className="flex-1 py-6 bg-suloc-blue text-white rounded-3xl font-black text-xl shadow-2xl shadow-suloc-blue/20 hover:bg-navy transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        AUTORISER LE PAIEMENT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* New Transfer Modal */}
            {showNewTransferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/90 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-[#0a2342] text-white rounded-[3rem] shadow-4xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 scrollbar-hide border border-white/10">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black flex items-center gap-4 italic">
                                    <span className="w-12 h-12 bg-suloc-blue/20 text-suloc-blue rounded-2xl flex items-center justify-center border border-suloc-blue/20">
                                        <Plus size={28} />
                                    </span>
                                    Nouveau Transfert SULOC
                                </h2>
                                <button onClick={() => setShowNewTransferModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={28} className="text-white/60 hover:text-white" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTransfer} className="space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Section 1: Expéditeur */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="w-6 h-6 bg-suloc-blue text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                                            Détails de l'Expéditeur
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-suloc-blue transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTransfer.sender_name}
                                                    onChange={(e) => setNewTransfer({ ...newTransfer, sender_name: e.target.value })}
                                                    placeholder="Nom complet de l'expéditeur"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                                />
                                            </div>
                                            <div className="relative group">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-suloc-blue transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTransfer.sender_address}
                                                    onChange={(e) => setNewTransfer({ ...newTransfer, sender_address: e.target.value })}
                                                    placeholder="Adresse physique / Pays"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative group">
                                                    <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                                    <input
                                                        type="number"
                                                        required
                                                        value={newTransfer.amount}
                                                        onChange={(e) => setNewTransfer({ ...newTransfer, amount: e.target.value })}
                                                        placeholder="Montant USD"
                                                        className="w-full pl-14 pr-6 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-black text-xl text-white placeholder:text-white/20"
                                                    />
                                                </div>
                                                <select
                                                    required
                                                    value={newTransfer.payment_service_id}
                                                    onChange={(e) => setNewTransfer({ ...newTransfer, payment_service_id: e.target.value })}
                                                    className="w-full px-6 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-[#1a3a5f] rounded-2xl outline-none transition font-bold text-white appearance-none"
                                                >
                                                    <option value="" className="bg-[#0a2342]">Opérateur</option>
                                                    {operators.map(op => (
                                                        <option key={op.id} value={op.id} className="bg-[#0a2342]">{op.operator_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex justify-between items-center shadow-xl">
                                                <div>
                                                    <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 italic">Taxes SULOC ({globalFeePercent}%)</div>
                                                    <div className="text-2xl font-black text-suloc-gold italic" style={{ color: '#d4af37' }}>
                                                        {((parseFloat(newTransfer.amount) || 0) * globalFeePercent / 100).toFixed(2)} <span className="text-sm opacity-50">USD</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 italic">Total à percevoir</div>
                                                    <div className="text-3xl font-black text-emerald-400">
                                                        {((parseFloat(newTransfer.amount) || 0) * (1 + globalFeePercent / 100)).toFixed(2)} <span className="text-base opacity-50">USD</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Bénéficiaire */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                            <span className="w-6 h-6 bg-white/10 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                                            Détails du Bénéficiaire
                                        </h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                required
                                                value={newTransfer.receiver_name}
                                                onChange={(e) => setNewTransfer({ ...newTransfer, receiver_name: e.target.value })}
                                                placeholder="Nom complet du bénéficiaire"
                                                className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTransfer.receiver_id_number}
                                                    onChange={(e) => setNewTransfer({ ...newTransfer, receiver_id_number: e.target.value })}
                                                    placeholder="N° Carte ID / Passport"
                                                    className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTransfer.receiver_phone}
                                                    onChange={(e) => setNewTransfer({ ...newTransfer, receiver_phone: e.target.value })}
                                                    placeholder="N° Téléphone Mobile"
                                                    className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={newTransfer.receiver_address}
                                                onChange={(e) => setNewTransfer({ ...newTransfer, receiver_address: e.target.value })}
                                                placeholder="Ville / Adresse de retrait"
                                                className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-suloc-blue focus:bg-white/10 rounded-2xl outline-none transition font-semibold text-white placeholder:text-white/20"
                                            />

                                            {/* Receiver Photo Upload */}
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="receiver_photo"
                                                    onChange={(e) => setNewTransferFiles({ ...newTransferFiles, receiver_photo: e.target.files[0] })}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="receiver_photo"
                                                    className={`w-full flex flex-col items-center justify-center gap-3 p-6 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                                                        ${newTransferFiles.receiver_photo ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:border-suloc-blue/50 hover:bg-white/10'}`}
                                                >
                                                    {newTransferFiles.receiver_photo ? (
                                                        <div className="w-full h-32 relative">
                                                            <img
                                                                src={URL.createObjectURL(newTransferFiles.receiver_photo)}
                                                                className="w-full h-full object-cover rounded-2xl"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                                <RefreshCw className="text-white" size={24} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Smartphone size={32} className="text-white/20" />
                                                    )}
                                                    <div className="text-center">
                                                        <p className="text-xs font-black uppercase tracking-widest italic truncate max-w-[200px]">
                                                            {newTransferFiles.receiver_photo ? newTransferFiles.receiver_photo.name : 'Capture Photo Requise'}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mt-1">Image du bénéficiaire (Obligatoire)</p>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
                                                <label className={`flex-1 text-center py-4 rounded-xl cursor-pointer transition font-black text-[10px] uppercase tracking-widest ${newTransfer.payment_method === 'cash' ? 'bg-suloc-blue text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
                                                    <input type="radio" value="cash" checked={newTransfer.payment_method === 'cash'} onChange={(e) => setNewTransfer({ ...newTransfer, payment_method: e.target.value })} className="hidden" />
                                                    Perception Cash 💵
                                                </label>
                                                <label className={`flex-1 text-center py-4 rounded-xl cursor-pointer transition font-black text-[10px] uppercase tracking-widest ${newTransfer.payment_method === 'bank' ? 'bg-suloc-blue text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
                                                    <input type="radio" value="bank" checked={newTransfer.payment_method === 'bank'} onChange={(e) => setNewTransfer({ ...newTransfer, payment_method: e.target.value })} className="hidden" />
                                                    Versement Banque 🏦
                                                </label>
                                            </div>

                                            {/* Bank Slip Upload (Conditionally shown if bank method is selected) */}
                                            {newTransfer.payment_method === 'bank' && (
                                                <div className="relative group animate-in slide-in-from-top-4 duration-300">
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        id="bank_slip"
                                                        onChange={(e) => setNewTransferFiles({ ...newTransferFiles, bank_slip: e.target.files[0] })}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="bank_slip"
                                                        className={`w-full flex flex-col items-center justify-center gap-3 p-6 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                                                            ${newTransferFiles.bank_slip ? 'border-suloc-gold/50 bg-suloc-gold/5' : 'border-white/10 bg-white/5 hover:border-suloc-gold/50 hover:bg-white/10'}`}
                                                    >
                                                        {newTransferFiles.bank_slip ? (
                                                            <div className="w-full h-32 relative">
                                                                {newTransferFiles.bank_slip.type.includes('image') ? (
                                                                    <img
                                                                        src={URL.createObjectURL(newTransferFiles.bank_slip)}
                                                                        className="w-full h-full object-cover rounded-2xl"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
                                                                        <FileDown className="text-suloc-gold" size={32} />
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                                    <RefreshCw className="text-white" size={24} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Receipt size={32} className="text-white/20" />
                                                        )}
                                                        <div className="text-center">
                                                            <p className="text-xs font-black uppercase tracking-widest italic truncate max-w-[200px]" style={{ color: newTransferFiles.bank_slip ? '#d4af37' : 'inherit' }}>
                                                                {newTransferFiles.bank_slip ? newTransferFiles.bank_slip.name : 'Joindre le Bordereau'}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-white/30 uppercase mt-1">Image ou PDF du versement</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isFrozen}
                                    className="w-full py-8 bg-suloc-blue hover:bg-navy text-white rounded-[2.5rem] font-black text-2xl shadow-2xl transition transform hover:-translate-y-1 active:scale-95 italic border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ENREGISTRER LA TRANSACTION SULOC
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bank Slip Verification Modal */}
            {showBankModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-3xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Banknote className="text-suloc-blue" size={24} />
                                Vérification Bancaire
                            </h3>
                            <X size={24} className="cursor-pointer text-gray-300 hover:text-gray-900 transition-colors" onClick={() => setShowBankModal(false)} />
                        </div>
                        <div className="p-8">
                            <div className="mb-8 bg-gray-100 rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-4">
                                {selectedRequest.bank_slip_proof ? (
                                    <div className="w-full">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Preuve de Versement</p>
                                        <div className="w-full h-48 bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-200 flex items-center justify-center">
                                            {selectedRequest.bank_slip_proof.toLowerCase().endsWith('.pdf') ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileDown size={40} className="text-suloc-blue" />
                                                    <a
                                                        href={selectedRequest.bank_slip_proof.startsWith('http') ? selectedRequest.bank_slip_proof : `${API_BASE_URL}${selectedRequest.bank_slip_proof}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-black text-suloc-blue underline hover:text-navy transition"
                                                    >
                                                        Visualiser le PDF
                                                    </a>
                                                </div>
                                            ) : (
                                                <img
                                                    src={selectedRequest.bank_slip_proof.startsWith('http') ? selectedRequest.bank_slip_proof : `${API_BASE_URL}${selectedRequest.bank_slip_proof}`}
                                                    className="w-full h-full object-contain cursor-pointer"
                                                    onClick={() => { const imageUrl = selectedRequest.bank_slip_proof.startsWith('http') ? selectedRequest.bank_slip_proof : `${API_BASE_URL}${selectedRequest.bank_slip_proof}`; setZoomedImageUrl(imageUrl); setShowImageZoom(true); }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <AlertTriangle size={48} className="text-amber-500" />
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Confirmation Requis</p>
                                            <p className="text-sm font-bold text-gray-700 leading-relaxed italic">Veuillez vérifier que les fonds ont été reçus sur le compte SULOC avant d'autoriser la génération du code de retrait.</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleStatusUpdate(selectedRequest.id, {
                                        payment_verification_status: 'verified',
                                        payout_status: 'Ready',
                                        status: 'in_progress'
                                    })}
                                    disabled={isFrozen}
                                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 transition transform active:scale-95 italic disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    DÉCLARER VALIDE & ACTIVER
                                </button>
                                <button
                                    onClick={() => setShowBankModal(false)}
                                    className="w-full py-6 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-3xl font-black text-lg transition active:scale-95"
                                >
                                    RETOUR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Zoom Modal */}
            {showImageZoom && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowImageZoom(false)}
                >
                    <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowImageZoom(false)}
                            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                        >
                            <X size={32} className="text-white" />
                        </button>
                        <img
                            src={zoomedImageUrl}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                            <p className="text-white text-sm font-black uppercase tracking-widest">Vérification Visuelle - Photo du Bénéficiaire</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPayments;

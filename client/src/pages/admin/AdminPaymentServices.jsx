import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Edit, Trash2, Save, X, Globe, DollarSign,
    Percent, ChevronLeft, Image as ImageIcon, Check, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSystemStatus from '../../hooks/useSystemStatus';

const AdminPaymentServices = () => {
    const { isModuleFrozen } = useSystemStatus();
    const isFrozen = isModuleFrozen('payments');

    const [operators, setOperators] = useState([]);
    const [settings, setSettings] = useState({
        daily_rate_bif: '0',
        daily_rate_cdf: '0',
        transfer_fee_percentage: '5.97'
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOperator, setEditingOperator] = useState(null);

    // Form state for operator
    const [formData, setFormData] = useState({
        operator_name: '',
        operator_logo: '',
        description_fr: '',
        description_en: '',
        exchange_rate: '',
        currency_pair: 'USD/',
        is_active: true,
        order_index: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [opRes, setRes] = await Promise.all([
                axios.get('/api/payment/operators'),
                axios.get('/api/payment/admin/settings')
            ]);
            setOperators(opRes.data);
            setSettings(setRes.data);
        } catch (error) {
            console.error("Error fetching services data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/payment/admin/settings', settings);
            alert("Paramètres mis à jour !");
        } catch (error) {
            alert("Erreur lors de la mise à jour");
        }
    };

    const handleOperatorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOperator) {
                await axios.put(`/api/payment/admin/operators/${editingOperator.id}`, formData);
            } else {
                await axios.post('/api/payment/admin/operators', formData);
            }
            setShowModal(false);
            setEditingOperator(null);
            setFormData({
                operator_name: '', operator_logo: '',
                description_fr: '', description_en: '',
                exchange_rate: '', currency_pair: 'USD/',
                is_active: true, order_index: 0
            });
            fetchData();
        } catch (error) {
            alert("Erreur lors de l'enregistrement de l'opérateur");
        }
    };

    const handleDeleteOperator = async (id) => {
        if (window.confirm("Supprimer cet opérateur ?")) {
            try {
                await axios.delete(`/api/payment/admin/operators/${id}`);
                fetchData();
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const openEdit = (op) => {
        setEditingOperator(op);
        setFormData({
            operator_name: op.operator_name,
            operator_logo: op.operator_logo || '',
            description_fr: op.description_fr || '',
            description_en: op.description_en || '',
            exchange_rate: op.exchange_rate || '',
            currency_pair: op.currency_pair || 'USD/',
            is_active: op.is_active,
            order_index: op.order_index || 0
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/payments" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Opérateurs & Taux</h1>
                        <p className="text-gray-500 font-medium">Contrôle global des tarifs et partenaires.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingOperator(null); setFormData({
                            operator_name: '', operator_logo: '',
                            description_fr: '', description_en: '',
                            exchange_rate: '', currency_pair: 'USD/',
                            is_active: true, order_index: 0
                        }); setShowModal(true);
                    }}
                    disabled={isFrozen}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={20} />
                    Ajouter un Opérateur
                </button>
            </div>

            {/* Global Rates Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <Globe className="text-suloc-blue" size={24} />
                    Contrôle Global SULOC
                </h2>

                <form onSubmit={handleSettingUpdate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">USD → BIF (Burundi)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">1$ =</span>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.daily_rate_bif || '0'}
                                onChange={(e) => setSettings({ ...settings, daily_rate_bif: e.target.value })}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold text-gray-700 transition"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">USD → CDF (Congo)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">1$ =</span>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.daily_rate_cdf || '0'}
                                onChange={(e) => setSettings({ ...settings, daily_rate_cdf: e.target.value })}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold text-gray-700 transition"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Frais Commission (%)</label>
                        <div className="relative">
                            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="number"
                                step="0.01"
                                value={settings.transfer_fee_percentage || '5.97'}
                                onChange={(e) => setSettings({ ...settings, transfer_fee_percentage: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold text-gray-700 transition"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isFrozen}
                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition flex items-center justify-center gap-2 shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        Mettre à jour
                    </button>
                </form>
            </div>

            {/* Operators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-8 h-64 animate-pulse flex flex-col justify-between">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : operators.map((op) => (
                    <div key={op.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                                {op.operator_logo ? (
                                    <img src={op.operator_logo} className="w-full h-full object-contain" />
                                ) : (
                                    <ImageIcon size={32} className="text-gray-200" />
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(op)}
                                    disabled={isFrozen}
                                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteOperator(op.id)}
                                    disabled={isFrozen}
                                    className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-gray-900">{op.operator_name}</h3>
                                {op.is_active ?
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500"></span> :
                                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                }
                            </div>
                            <p className="text-xs font-bold text-gray-400 line-clamp-2 italic">{op.description_fr || 'Pas de description.'}</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase italic">Taux Spécifique</p>
                                <p className="text-lg font-black text-gray-900 mt-1">
                                    {op.exchange_rate ? `1$ = ${op.exchange_rate}` : '-'} <span className="text-xs font-bold text-suloc-blue">{op.currency_pair?.split('/')[1]}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-300 uppercase italic">Ordre</p>
                                <p className="text-lg font-black text-gray-900 mt-1">#{op.order_index}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Operator Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 scrollbar-hide">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-gray-900 italic">
                                    {editingOperator ? 'Modifier' : 'Ajouter'} Opérateur
                                </h2>
                                <X className="cursor-pointer text-gray-300 hover:text-gray-900" size={28} onClick={() => setShowModal(false)} />
                            </div>

                            <form onSubmit={handleOperatorSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nom de l'Opérateur *</label>
                                        <input
                                            type="text" required
                                            value={formData.operator_name}
                                            onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Lien du Logo (URL)</label>
                                        <input
                                            type="url"
                                            value={formData.operator_logo}
                                            onChange={(e) => setFormData({ ...formData, operator_logo: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Taux Spécifique</label>
                                        <input
                                            type="number" step="0.0001"
                                            value={formData.exchange_rate}
                                            onChange={(e) => setFormData({ ...formData, exchange_rate: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Paire (ex: USD/BIF)</label>
                                        <input
                                            type="text"
                                            value={formData.currency_pair}
                                            onChange={(e) => setFormData({ ...formData, currency_pair: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description (FR)</label>
                                        <textarea
                                            value={formData.description_fr}
                                            onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                                            rows="3"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description (EN)</label>
                                        <textarea
                                            value={formData.description_en}
                                            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                            rows="3"
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-suloc-blue rounded-2xl outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={formData.order_index}
                                            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                            className="w-20 px-4 py-2 bg-white border rounded-xl font-bold"
                                        />
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Ordre d'affichage</span>
                                    </div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-6 h-6 rounded-lg text-suloc-blue border-gray-300 focus:ring-suloc-blue"
                                        />
                                        <span className="text-xs font-black text-gray-900 uppercase italic">Opérateur Actif</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isFrozen}
                                    className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-3xl font-black text-xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 italic disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ENREGISTRER L'OPÉRATEUR
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentServices;

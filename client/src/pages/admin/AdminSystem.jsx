import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Power, Snowflake, AlertTriangle, ShieldAlert,
    CheckCircle2, Lock, Unlock, Database, Activity,
    Save, RefreshCcw, HardDrive, Cpu
} from 'lucide-react';
import { useSystemStatus } from '../../context/SystemContext';

const AdminSystem = () => {
    const [status, setStatus] = useState({
        maintenance_mode: false,
        frozen_modules: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const { fetchStatus: refreshGlobalStatus } = useSystemStatus();

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/system/status', {
                withCredentials: true
            });
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching system status:', error);
            setMessage({ type: 'error', text: 'Impossible de charger le statut système.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMaintenance = () => {
        setStatus(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }));
    };

    const handleToggleFreeze = (moduleName) => {
        setStatus(prev => {
            const frozen = [...prev.frozen_modules];
            if (frozen.includes(moduleName)) {
                return { ...prev, frozen_modules: frozen.filter(m => m !== moduleName) };
            } else {
                return { ...prev, frozen_modules: [...frozen, moduleName] };
            }
        });
    };

    const handleFreezeAll = () => {
        setStatus(prev => ({ ...prev, frozen_modules: modules.map(m => m.id) }));
    };

    const handleUnfreezeAll = () => {
        setStatus(prev => ({ ...prev, frozen_modules: [] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const response = await axios.put('/api/system/status', status, {
                withCredentials: true
            });
            setMessage({ type: 'success', text: response.data.message });
            // Refresh global context immediately
            refreshGlobalStatus();
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
        } finally {
            setSaving(false);
        }
    };

    const modules = [
        { id: 'payments', label: 'Système de Paiements', icon: <Database size={20} /> },
        { id: 'logistics', label: 'Logistique & Suivi', icon: <Activity size={20} /> },
        { id: 'visa', label: 'Demandes de Visa', icon: <ShieldAlert size={20} /> },
        { id: 'vehicles', label: 'Gestion Véhicules', icon: <HardDrive size={20} /> }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-900/40">
                        <Cpu className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Command Center</h1>
                        <p className="text-gray-500 font-medium">Zone de Contrôle Absolu - Creator Only</p>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest border border-red-200 px-3 py-1 rounded-full bg-red-50">Security Level 0</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">ROOT_ACCESS_GRANTED</span>
                </div>
            </div>

            {message && (
                <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Global Kill Switch */}
                <div className={`relative overflow-hidden rounded-3xl p-8 border-2 transition-all duration-500 shadow-2xl ${status.maintenance_mode
                    ? 'bg-red-900 border-red-500 shadow-red-900/20'
                    : 'bg-white border-gray-100 shadow-gray-200/50'
                    }`}>
                    {status.maintenance_mode && (
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Power size={120} className="text-white" />
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                        <h2 className={`text-2xl font-black mb-4 flex items-center gap-3 ${status.maintenance_mode ? 'text-white' : 'text-gray-900'}`}>
                            <Power className={status.maintenance_mode ? 'text-white' : 'text-red-600'} size={28} />
                            Arrêt d'Urgence Global
                        </h2>
                        <p className={`mb-8 text-lg font-medium leading-relaxed ${status.maintenance_mode ? 'text-red-100' : 'text-gray-500'}`}>
                            Le "Mode Maintenance" verrouillera l'ensemble du système. Les utilisateurs et administrateurs ne pourront plus se connecter ou accéder aux pages.
                            <span className="block mt-2 font-bold underline decoration-2">Seul le Creator peut contourner ce verrou.</span>
                        </p>

                        <div className="mt-auto">
                            <button
                                onClick={handleToggleMaintenance}
                                className={`group flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 ${status.maintenance_mode
                                    ? 'bg-white text-red-900 shadow-lg'
                                    : 'bg-red-600 text-white shadow-xl shadow-red-600/30 hover:brightness-110'
                                    }`}
                            >
                                {status.maintenance_mode ? <Lock size={24} /> : <Unlock size={24} />}
                                {status.maintenance_mode ? 'DÉSACTIVER MAINTENANCE' : 'ACTIVER MAINTENANCE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modular Freeze */}
                <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                <Snowflake className="text-blue-400" size={28} />
                                Verrouillage Modulaire (Freeze)
                            </h2>
                            <p className="text-gray-400 font-medium text-sm">
                                Geler un module empêche toute modification par les administrateurs.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleUnfreezeAll}
                                className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-[10px] font-black uppercase hover:bg-gray-700 transition border border-gray-700"
                            >
                                Tout Libérer
                            </button>
                            <button
                                onClick={handleFreezeAll}
                                className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600/30 transition border border-blue-600/30"
                            >
                                Tout Geler
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map(mod => {
                            const isFrozen = status.frozen_modules.includes(mod.id);
                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => handleToggleFreeze(mod.id)}
                                    className={`flex flex-col gap-4 p-5 rounded-2xl border-2 transition-all group ${isFrozen
                                        ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-900/40'
                                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className={`p-2 rounded-xl ${isFrozen ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600 transition'}`}>
                                            {mod.icon}
                                        </div>
                                        {isFrozen && <Snowflake size={16} className="text-blue-400 animate-pulse" />}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-black uppercase tracking-tight ${isFrozen ? 'text-white' : 'text-gray-400'}`}>
                                            {mod.label}
                                        </div>
                                        <div className={`text-xs font-bold mt-1 ${isFrozen ? 'text-blue-300' : 'text-gray-600'}`}>
                                            {isFrozen ? 'STATUT: GELÉ (LECTURE SEULE)' : 'STATUT: ACTIF (ÉCRITURE LIBRE)'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex justify-end sticky bottom-8">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-suloc-blue text-white px-10 py-5 rounded-3xl font-black text-xl hover:brightness-110 shadow-2xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
                >
                    {saving ? <RefreshCcw className="animate-spin" size={24} /> : <Save size={24} />}
                    {saving ? 'MISSION EN COURS...' : (
                        status.frozen_modules.length > 0
                            ? `APPLIQUER POUR ${status.frozen_modules.length} MODULE${status.frozen_modules.length > 1 ? 'S' : ''}`
                            : 'APPLIQUER LES PROTOCOLES'
                    )}
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}} />
        </div>
    );
};

export default AdminSystem;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserPlus, Search, Edit2, Trash2, Lock, Unlock,
    Shield, Mail, User, CheckCircle2, AlertCircle, X,
    ChevronDown, Filter, MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        email: '',
        role: 'admin',
        permissions: [],
        is_blocked: false
    });

    const availablePermissions = [
        { id: 'manage_content', label: 'Gérer le Contenu' },
        { id: 'manage_visa', label: 'Gérer les Visas' },
        { id: 'manage_logistics', label: 'Gérer la Logistique' },
        { id: 'manage_payments', label: 'Gérer les Paiements' },
        { id: 'manage_vehicles', label: 'Gérer les Véhicules' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users', {
                withCredentials: true
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setErrorMsg('Erreur lors du chargement des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePermissionChange = (permId) => {
        setFormData(prev => {
            const perms = [...prev.permissions];
            if (perms.includes(permId)) {
                return { ...prev, permissions: perms.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...perms, permId] };
            }
        });
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            full_name: '',
            email: '',
            role: 'admin',
            permissions: [],
            is_blocked: false
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '', // Leave blank
            full_name: user.full_name || '',
            email: user.email || '',
            role: user.role,
            permissions: user.permissions || [],
            is_blocked: user.is_blocked
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, formData, {
                    withCredentials: true
                });
                setSuccessMsg('Utilisateur mis à jour avec succès.');
            } else {
                await axios.post('/api/users', formData, {
                    withCredentials: true
                });
                setSuccessMsg('Utilisateur créé avec succès.');
            }
            setIsModalOpen(false);
            fetchUsers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Une erreur est survenue.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`, {
                withCredentials: true
            });
            setSuccessMsg('Utilisateur supprimé.');
            setShowDeleteConfirm(null);
            fetchUsers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setErrorMsg('Erreur lors de la suppression.');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'creator': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'super_admin': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-suloc-blue">Gestion des Utilisateurs</h1>
                    <p className="text-gray-500 mt-1">Gérez les accès et les permissions de votre équipe</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-suloc-blue text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2"
                >
                    <UserPlus size={20} />
                    Ajouter un Utilisateur
                </button>
            </div>

            {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg flex items-center animate-fade-in">
                    <CheckCircle2 className="mr-3" size={20} /> {successMsg}
                </div>
            )}

            {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-center animate-fade-in">
                    <AlertCircle className="mr-3" size={20} /> {errorMsg}
                </div>
            )}

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email ou utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-suloc-blue/10 outline-none transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none appearance-none font-medium text-gray-700"
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Administrateur</option>
                            {currentUser?.role === 'creator' && <option value="creator">Creator</option>}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle & Permissions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-32 mb-2"></div><div className="h-3 bg-gray-50 rounded w-48"></div></td>
                                        <td className="px-6 py-6"><div className="h-6 bg-gray-100 rounded-full w-24"></div></td>
                                        <td className="px-6 py-6"><div className="h-6 bg-gray-100 rounded-full w-16"></div></td>
                                        <td className="px-6 py-6"><div className="h-8 bg-gray-100 rounded w-20 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-suloc-blue/10 flex items-center justify-center text-suloc-blue font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{user.username}</div>
                                                    <div className="text-sm text-gray-500">{user.full_name || 'Sans nom'} • {user.email || 'Pas d\'email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role.toUpperCase().replace('_', ' ')}
                                                </span>
                                                {user.role === 'admin' && user.permissions?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {user.permissions.map(p => (
                                                            <span key={p} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                                {p.split('_')[1]}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_blocked ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    <Lock size={12} /> Bloqué
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <CheckCircle2 size={12} /> Actif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                {user.id !== currentUser?.id && user.role !== 'creator' && (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-suloc-blue text-white">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                {editingUser ? <Edit2 size={24} className="text-suloc-gold" /> : <UserPlus size={24} className="text-suloc-gold" />}
                                {editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition p-1">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nom d'utilisateur *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text" name="username" required
                                        value={formData.username} onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-suloc-blue/10 transition"
                                        placeholder="ex: admin_john"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Mot de passe {editingUser ? '(Laisser vide pour garder l\'actuel)' : '*'}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password" name="password" required={!editingUser}
                                        value={formData.password} onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-suloc-blue/10 transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet</label>
                                    <input
                                        type="text" name="full_name"
                                        value={formData.full_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-suloc-blue/10 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email" name="email"
                                            value={formData.email} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-suloc-blue/10 transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rôle</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="role" value={formData.role} onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-suloc-blue/10 appearance-none transition"
                                    >
                                        <option value="admin">Administrateur (Restreint)</option>
                                        <option value="super_admin">Super Admin (Tout accès)</option>
                                        {currentUser?.role === 'creator' && <option value="creator">Creator</option>}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            {formData.role === 'admin' && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Permissions Spécifiques</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {availablePermissions.map(perm => (
                                            <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(perm.id)}
                                                        onChange={() => handlePermissionChange(perm.id)}
                                                        className="h-5 w-5 rounded border-gray-300 text-suloc-blue focus:ring-suloc-blue/20"
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{perm.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                                <input
                                    type="checkbox" name="is_blocked" id="is_blocked"
                                    checked={formData.is_blocked} onChange={handleInputChange}
                                    className="h-5 w-5 rounded border-red-300 text-red-600 focus:ring-red-600/20"
                                />
                                <label htmlFor="is_blocked" className="text-sm font-bold text-red-700 cursor-pointer flex items-center gap-2">
                                    <Lock size={16} /> Bloquer ce compte
                                </label>
                            </div>
                        </form>

                        <div className="p-8 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-[2] py-4 bg-suloc-blue text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-blue-900/20 transition"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}></div>
                    <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer l'utilisateur ?</h3>
                        <p className="text-gray-500 mb-8">Cette action est irréversible. Toutes les données liées seront supprimées.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scaleIn 0.2s ease-out;
                }
            `}} />
        </div>
    );
};

export default AdminUsers;

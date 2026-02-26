import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Car, FileText, Settings, LogOut, ArrowLeft, Ship, Banknote, Image as ImageIcon, Info, MessageSquare, MessageCircle, Users, ShieldAlert, Lock } from 'lucide-react';
import useSystemStatus from '../../hooks/useSystemStatus';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { isModuleFrozen } = useSystemStatus();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path)
            ? 'bg-suloc-blue text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 hover:text-suloc-blue';
    };

    const getModuleKey = () => {
        if (location.pathname.includes('/admin/payments')) return 'payments';
        if (location.pathname.includes('/admin/logistics')) return 'logistics';
        if (location.pathname.includes('/admin/visas')) return 'visa';
        if (location.pathname.includes('/admin/vehicles')) return 'vehicles';
        return null;
    };

    const currentModule = getModuleKey();
    const isFrozen = currentModule ? isModuleFrozen(currentModule) : false;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-suloc-blue">
                            <span className="text-suloc-gold">SU</span>LOC
                        </span>
                        <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-500 border border-gray-200">ADMIN</span>
                    </Link>
                </div>

                <div className="flex flex-col flex-grow p-4 gap-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2">Menu Principal</div>

                    <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/dashboard')}`}>
                        <LayoutDashboard size={20} />
                        <span>Tableau de bord</span>
                    </Link>

                    <Link to="/admin/vehicles" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/vehicles')}`}>
                        <Car size={20} />
                        <span>Véhicules</span>
                    </Link>

                    <Link to="/admin/visas" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/visas')}`}>
                        <FileText size={20} />
                        <span>Visas</span>
                    </Link>

                    <Link to="/admin/visa-assistance" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/visa-assistance')}`}>
                        <MessageCircle size={20} />
                        <span>Assistance Visa</span>
                    </Link>

                    <Link to="/admin/logistics" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/logistics')}`}>
                        <Ship size={20} />
                        <span>Logistique</span>
                    </Link>

                    <Link to="/admin/payments" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/payments')}`}>
                        <Banknote size={20} />
                        <span>Transferts</span>
                    </Link>

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-2">Contenu Site</div>

                    <Link to="/admin/hero" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/hero')}`}>
                        <ImageIcon size={20} />
                        <span>Slideshow d'accueil</span>
                    </Link>

                    <Link to="/admin/about" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/about')}`}>
                        <Info size={20} />
                        <span>À propos</span>
                    </Link>

                    <Link to="/admin/contact" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/contact')}`}>
                        <MessageSquare size={20} />
                        <span>Messages Contact</span>
                    </Link>

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-2">Système</div>



                    {user?.role === 'creator' && (
                        <Link to="/admin/system" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/system')}`}>
                            <ShieldAlert size={20} className="text-red-500" />
                            <span className="text-red-600 font-bold italic">Command Center</span>
                        </Link>
                    )}

                    <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/users')}`}>
                        <Users size={20} />
                        <span>Utilisateurs</span>
                    </Link>

                    <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/admin/settings')}`}>
                        <Settings size={20} />
                        <span>Paramètres</span>
                    </Link>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-10 w-10 rounded-full bg-suloc-blue text-white flex items-center justify-center font-bold shadow-sm">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/" className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-md transition-colors">
                            <ArrowLeft size={14} />
                            Site
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-2 text-xs font-medium text-white bg-red-500 hover:bg-red-600 p-2 rounded-md transition-colors shadow-sm"
                        >
                            <LogOut size={14} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shadow-sm z-20">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-suloc-blue">
                            <span className="text-suloc-gold">SU</span>LOC
                        </span>
                    </Link>
                    <button className="p-2 text-gray-600">
                        <Settings size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                    {isFrozen && (
                        <div className="mb-6 bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-red-900 font-black italic uppercase tracking-tight">Module en Lecture Seule</h3>
                                    <p className="text-red-700 text-xs font-bold italic">Le protocole de sécurité a été activé. Les modifications sont temporairement désactivées.</p>
                                </div>
                            </div>
                            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                                Frozen Mode
                            </div>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

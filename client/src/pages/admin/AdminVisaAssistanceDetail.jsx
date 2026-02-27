const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    MessageCircle,
    Mail,
    Plane,
    FileText,
    History,
    Download,
    CheckCircle2,
    AlertCircle,
    Save,
    Trash2
} from 'lucide-react';


const AdminVisaAssistanceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [templates, setTemplates] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [formStatus, setFormStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [assignedAgentId, setAssignedAgentId] = useState('');
    const [checklist, setChecklist] = useState({});

    const statuses = {
        'received': 'Reçue',
        'analyzing': 'En cours d\'analyse',
        'docs_incomplete': 'Documents incomplets',
        'docs_complete': 'Dossier complet',
        'submitted': 'Déposé',
        'pending_response': 'En attente de réponse',
        'accepted': 'Accepté',
        'rejected': 'Refusé',
        'closed': 'Clôturé'
    };

    const checklistItems = {
        'passport': 'Passeport valide (> 6 mois)',
        'photo': 'Photos d\'identité conformes',
        'form': 'Formulaire de demande signé',
        'invitation': 'Lettre d\'invitation / Réservation hôtel',
        'insurance': 'Assurance voyage',
        'proof_funds': 'Preuve de moyens financiers',
        'itinerary': 'Itinéraire de vol',
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, adminsRes, settingsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/visas/admin/assistance/${id}`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/api/admins`, { withCredentials: true }).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/visas/admin/assistance/settings`, { withCredentials: true })
            ]);

            setRequest(reqRes.data);
            setAdmins(adminsRes.data);
            setTemplates(settingsRes.data);

            setFormStatus(reqRes.data.status);
            setAdminNotes(reqRes.data.admin_notes || '');
            setAssignedAgentId(reqRes.data.assigned_agent_id || '');
            setChecklist(JSON.parse(reqRes.data.checklist_status || '{}'));

        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMsg('Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    const handleChecklistChange = (key) => {
        setChecklist(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await axios.put(`${API_BASE_URL}/api/visas/admin/assistance/${id}`, {
                status: formStatus,
                admin_notes: adminNotes,
                assigned_agent_id: assignedAgentId,
                checklist_status: checklist
            }, {
                withCredentials: true
            });

            setSuccessMsg('Demande mise à jour avec succès.');
            // Refresh history
            fetchData();
        } catch (error) {
            console.error('Error updating request:', error);
            setErrorMsg('Erreur lors de la mise à jour.');
        } finally {
            setSaving(false);
        }
    };

    const getNotificationPreview = () => {
        let templateKey = '';
        if (formStatus === 'received') templateKey = 'template_received';
        else if (formStatus === 'docs_incomplete') templateKey = 'template_docs_incomplete';
        else if (formStatus === 'docs_complete') templateKey = 'template_docs_complete';
        else if (formStatus === 'accepted' || formStatus === 'rejected') templateKey = 'template_result';

        if (templateKey && templates[templateKey]) {
            return templates[templateKey]
                .replace('{client_name}', request.full_name)
                .replace('{destination}', request.destination_country);
        }
        return null;
    };

    const previewMessage = getNotificationPreview();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div>
            </div>
        );
    }

    if (!request) return <div className="p-10 text-center">Demande non trouvée.</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/admin/visa-assistance" className="text-[#003366] hover:text-[#C5A059] font-bold flex items-center transition">
                        <ArrowLeft className="mr-2" size={20} /> Retour à la liste
                    </Link>
                    <div className="flex gap-3">
                        <a
                            href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition flex items-center font-bold shadow-md"
                        >
                            <MessageCircle className="mr-2" size={18} /> WhatsApp
                        </a>
                        <a
                            href={`mailto:${request.email}`}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center font-bold shadow-md"
                        >
                            <Mail className="mr-2" size={18} /> Email
                        </a>
                    </div>
                </div>

                {successMsg && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-lg flex items-center">
                        <CheckCircle2 className="mr-3" size={20} /> {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-lg flex items-center">
                        <AlertCircle className="mr-3" size={20} /> {errorMsg}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Management */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Customer Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-[#003366] mb-8 pb-4 border-b border-gray-100">Informations de la demande</h2>
                            <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</label>
                                    <p className="text-lg font-bold text-gray-800">{request.full_name}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coordonnées</label>
                                    <p className="text-gray-800 font-medium">{request.phone}</p>
                                    <p className="text-sm text-blue-600">{request.email}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</label>
                                    <p className="text-lg font-bold text-[#003366] flex items-center">
                                        {request.origin_country} <Plane className="mx-3 opacity-30" size={16} /> {request.destination_country}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type de Visa</label>
                                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-xs border border-blue-100 uppercase tracking-wider">
                                        {request.visa_type}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dates & Durée</label>
                                    <p className="text-gray-800 font-medium">Départ: {request.departure_date ? new Date(request.departure_date).toLocaleDateString() : 'Non précisé'}</p>
                                    <p className="text-sm text-gray-600">Durée: {request.duration_stay || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Objectif</label>
                                    <p className="text-sm text-gray-700 italic leading-relaxed">{request.travel_purpose || 'Aucun détail fourni'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Management Form */}
                        <div className="bg-white rounded-2xl shadow-md border-t-8 border-[#003366] p-8">
                            <h2 className="text-xl font-bold text-[#003366] mb-8">Gestion & Statut</h2>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Statut de la demande</label>
                                        <select
                                            value={formStatus}
                                            onChange={(e) => setFormStatus(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition"
                                        >
                                            {Object.entries(statuses).map(([val, label]) => (
                                                <option key={val} value={val}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Agent Assigné</label>
                                        <select
                                            value={assignedAgentId}
                                            onChange={(e) => setAssignedAgentId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition"
                                        >
                                            <option value="">Non assigné</option>
                                            {admins.map(admin => (
                                                <option key={admin.id} value={admin.id}>{admin.full_name || admin.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Suggestion Preview */}
                                {previewMessage && (
                                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                        <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                                            <MessageCircle className="mr-2" size={16} /> Message de notification suggéré
                                        </h4>
                                        <p className="text-sm text-indigo-800 italic mb-4 leading-relaxed whitespace-pre-line">{previewMessage}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = `https://wa.me/${request.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(previewMessage)}`;
                                                window.open(url, '_blank');
                                            }}
                                            className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-200 hover:bg-gray-50 transition shadow-sm flex items-center"
                                        >
                                            <MessageCircle className="mr-2" size={14} /> Préparer WhatsApp
                                        </button>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 underline decoration-[#C5A059] decoration-2 underline-offset-4 uppercase tracking-tighter">Checklist Documentaire</label>
                                        <div className="space-y-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            {Object.entries(checklistItems).map(([key, label]) => (
                                                <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition ${checklist[key] ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200 group-hover:border-blue-300'}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={!!checklist[key]}
                                                            onChange={() => handleChecklistChange(key)}
                                                        />
                                                        {checklist[key] && <CheckCircle2 className="text-white" size={14} />}
                                                    </div>
                                                    <span className={`text-sm transition ${checklist[key] ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 underline decoration-[#C5A059] decoration-2 underline-offset-4 uppercase tracking-tighter">Notes Internes</label>
                                        <textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows="8"
                                            className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition"
                                            placeholder="Commentaires internes..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#003366] text-white px-10 py-4 rounded-full font-bold hover:brightness-110 transition shadow-xl flex items-center disabled:opacity-70"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-3" size={20} /> Enregistrer les modifications
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Documents & Logs */}
                    <div className="space-y-8">
                        {/* Documents Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-[#003366] mb-6 flex items-center">
                                <FileText className="mr-2 text-[#C5A059]" size={20} /> Documents Téléversés
                            </h3>
                            {!request.visa_assistance_docs || request.visa_assistance_docs.length === 0 ? (
                                <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">Aucun document joint.</p>
                            ) : (
                                <div className="space-y-4">
                                    {request.visa_assistance_docs.map(doc => (
                                        <a
                                            key={doc.id}
                                            href={`${API_BASE_URL}/uploads/visa_docs/${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3.5 border border-gray-100 rounded-2xl hover:bg-blue-50 transition group"
                                        >
                                            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl mr-4 group-hover:bg-[#C5A059] group-hover:text-white transition">
                                                <Download size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-gray-800 truncate">{doc.file_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{Math.round(doc.file_size / 1024)} KB</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* History Logs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-[#003366] mb-6 flex items-center">
                                <History className="mr-2 text-[#C5A059]" size={20} /> Historique
                            </h3>
                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3">
                                {request.visa_assistance_logs?.map(log => (
                                    <div key={log.id} className="relative pl-6 pb-2 border-l-2 border-blue-50 last:border-0 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-white"></div>
                                        <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
                                            {new Date(log.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{log.action_description}</p>
                                        {log.admin_users && (
                                            <p className="text-[10px] text-[#C5A059] font-black mt-1 uppercase tracking-tighter">
                                                Par: {log.admin_users.full_name || log.admin_users.username}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVisaAssistanceDetail;

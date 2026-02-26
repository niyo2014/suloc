import { Settings, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Maintenance = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-2xl relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="mb-8 flex justify-center">
                    <div className="p-6 bg-red-900/30 border-2 border-red-500 rounded-3xl animate-bounce">
                        <Settings className="text-red-500" size={80} />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                    {t('maint_title_part1', 'Travaux de')} <span className="text-red-500 underline decoration-red-600/30 underline-offset-8">{t('maint_title_part2', 'Maintenance')}</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed font-medium italic">
                    {t('maint_desc', 'Notre plateforme SULOC subit actuellement une mise à jour de sécurité critique. Le système sera de retour en ligne sous peu. Merci de votre patience.')}
                </p>

                <div className="flex flex-col items-center gap-6">
                    <div className="group relative inline-block p-[2px] rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-2xl shadow-red-900/40">
                        <div className="px-10 py-6 bg-slate-900 rounded-[22px] flex flex-col items-center">
                            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 font-black mb-3 italic">{t('maint_protocol', 'Protocole de Sécurité Actif')}</div>
                            <div className="flex items-center text-red-500 font-black text-xl md:text-2xl justify-center tracking-tight">
                                <span className="h-4 w-4 rounded-full bg-red-600 mr-4 animate-ping"></span>
                                {t('maint_status', 'OFFLINE - ARRÊT D\'URGENCE')}
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-400 hover:text-white rounded-2xl transition-all font-bold text-sm tracking-widest uppercase italic group"
                    >
                        <Lock size={16} className="group-hover:text-red-500 transition-colors" />
                        {t('maint_btn_login', 'Se Connecter')}
                    </Link>
                </div>

                <div className="mt-16 text-gray-600 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gray-800"></div>
                    &copy; {new Date().getFullYear()} SULOC CONTROL CENTER
                    <div className="h-[1px] w-12 bg-gray-800"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
            `}} />
        </div>
    );
};

export default Maintenance;

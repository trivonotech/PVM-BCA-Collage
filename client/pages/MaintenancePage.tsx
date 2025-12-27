import { ShieldAlert, Info, Clock, Home, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MaintenancePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B3B] font-poppins relative overflow-hidden p-6">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mt-64 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -mr-64 -mb-64 animate-pulse delay-700"></div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
                    {/* Icon Section */}
                    <div className="relative w-24 h-24 mx-auto mb-10">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-3xl rotate-12 animate-pulse"></div>
                        <div className="absolute inset-0 bg-purple-500/20 rounded-3xl -rotate-12 animate-pulse delay-700"></div>
                        <div className="relative bg-white rounded-3xl shadow-xl w-full h-full flex items-center justify-center">
                            <ShieldAlert className="w-12 h-12 text-blue-600 animate-bounce" />
                        </div>
                    </div>

                    {/* Text Header */}
                    <div className="space-y-4 mb-10">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            System <span className="text-blue-400">Upgrade</span>
                        </h1>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        <p className="text-blue-100/70 text-lg leading-relaxed max-w-md mx-auto">
                            We're currently performing some scheduled maintenance to improve your experience. Hang tight, we'll be back in a flash.
                        </p>
                    </div>

                    {/* Status Card */}
                    <div className="bg-blue-900/40 border border-blue-400/20 rounded-2xl p-6 flex items-start gap-4 text-left mb-10">
                        <div className="bg-blue-400/10 p-2 rounded-lg">
                            <Info className="w-6 h-6 text-blue-400 shrink-0" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Estimated Time</h3>
                            <p className="text-blue-100/60 text-sm">
                                Our engineers are working 24/7. Most upgrades finish within 30-60 minutes. Thank you for your patience.
                            </p>
                        </div>
                    </div>

                    {/* Progress Footer */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                        <div className="flex items-center gap-2 text-blue-200/50 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            Active Since: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="h-1 w-1 bg-blue-200/20 rounded-full hidden md:block"></div>
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Optimizing Database
                        </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-white/5">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold group"
                        >
                            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Reload Page
                        </button>
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="text-white/20 hover:text-blue-400 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                        >
                            <Settings className="w-3 h-3" />
                            Admin Access
                        </button>
                    </div>
                </div>

                {/* System ID */}
                <p className="mt-8 text-center text-white/10 text-[10px] font-mono tracking-widest uppercase">
                    Status: 503 Service Unavailable | Node: PVM-BCA-CLUSTER-01
                </p>
            </div>
        </div>
    );
}

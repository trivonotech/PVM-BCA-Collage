import { ShieldAlert, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MaintenancePage() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-50 rounded-full opacity-50 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <ShieldAlert className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Under Maintenance
                    </h1>

                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        To ensure optimal performance and security, we are currently performing scheduled maintenance.
                        We will be back shortly.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-left mb-8">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900">What's happening?</h3>
                            <p className="text-sm text-blue-700/80 mt-1">
                                Our security systems have temporarily limited access to manage high traffic volumes. Data remains safe and secure.
                            </p>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 font-mono">
                        Error Code: 503_SERVICE_UNAVAILABLE
                    </div>

                    {/* Secret Admin Entry */}
                    <div className="mt-12 opacity-0 hover:opacity-100 transition-opacity duration-500">
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="text-xs text-gray-300 hover:text-indigo-500 underline"
                        >
                            Admin Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

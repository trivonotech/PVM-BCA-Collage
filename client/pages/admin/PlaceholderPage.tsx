import AdminLayout from '@/components/admin/AdminLayout';
import { Construction, Sparkles, Clock, Rocket } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
    description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
    return (
        <AdminLayout>
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-blue-50 relative overflow-hidden text-center">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-60"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-60"></div>

                        <div className="relative z-10 space-y-8">
                            {/* Icon Animation Container */}
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl rotate-6 animate-pulse"></div>
                                <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl -rotate-6 animate-pulse delay-700"></div>
                                <div className="relative bg-white rounded-2xl shadow-xl border border-blue-50 w-full h-full flex items-center justify-center">
                                    <Construction className="w-12 h-12 text-blue-600 animate-bounce" />
                                </div>
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                    {title}
                                </h1>
                                <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                                <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                                    {description || 'We are currently crafting a premium experience for this module. Our team is working hard to bring this feature to life.'}
                                </p>
                            </div>

                            {/* Progress Indicators */}
                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 text-left">
                                    <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400">Status</p>
                                        <p className="text-sm font-bold text-blue-900">In Progress</p>
                                    </div>
                                </div>
                                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3 text-left">
                                    <Rocket className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">Launch</p>
                                        <p className="text-sm font-bold text-indigo-900">Coming Soon</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pulse Indicator */}
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Syncing with development servers...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

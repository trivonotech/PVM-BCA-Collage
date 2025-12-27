import { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Shield } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

interface SecurityConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SecurityConfigModal({ isOpen, onClose }: SecurityConfigModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        maxRefreshes: 5,
        refreshWindow: 15, // seconds
        blockDuration: 30, // minutes
        enableRefreshCheck: true,
        enableRateLimit: true,
        maintenanceMode: false,
        isActive: false // Added Login Security (Shield) state
    });

    // Load initial settings & Handle Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const loadSettings = async () => {
                try {
                    const snap = await getDoc(doc(db, 'settings', 'security'));
                    if (snap.exists()) {
                        const data = snap.data();
                        const savedConfig = data.config || {};
                        setConfig(prev => ({
                            ...prev,
                            ...savedConfig,
                            isActive: data.isActive !== undefined ? data.isActive : false
                        }));
                    }
                } catch (e) {
                    /* Silent fail */
                }
            };
            loadSettings();
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'settings', 'security'), {
                isActive: config.isActive, // Save root toggle
                config: {
                    ...config,
                    refreshWindow: Number(config.refreshWindow), // Ensure numbers
                    maxRefreshes: Number(config.maxRefreshes),
                    blockDuration: Number(config.blockDuration)
                }
            }, { merge: true });
            onClose();
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to save settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-800">Security Rules</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 0. MAIN LOGIN SECURITY TOGGLE (The one user is looking for) */}
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                    Login Security Shield
                                </h4>
                                <p className="text-xs text-indigo-700/80 mt-1">
                                    Enables Email Link Verification & Lockout Protection.
                                    <br />(Turn OFF for Direct Login / Bypass)
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer"
                                    checked={config.isActive}
                                    onChange={e => setConfig({ ...config, isActive: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-indigo-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-indigo-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Refresh Detection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-700">Refresh Detection</h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer"
                                    checked={config.enableRefreshCheck}
                                    onChange={e => setConfig({ ...config, enableRefreshCheck: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className={`grid grid-cols-2 gap-4 transition-opacity ${config.enableRefreshCheck ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Max Refreshes</label>
                                <input type="number" min="3" max="50"
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={config.maxRefreshes}
                                    onChange={e => setConfig({ ...config, maxRefreshes: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Time Window (Sec)</label>
                                <input type="number" min="5" max="60"
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={config.refreshWindow}
                                    onChange={e => setConfig({ ...config, refreshWindow: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Punishment */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Penalty Settings</h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Block Duration (Minutes)</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min="1" max="1440" step="1"
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    value={config.blockDuration}
                                    onChange={e => setConfig({ ...config, blockDuration: Number(e.target.value) })}
                                />
                                <span className="text-sm font-bold text-gray-700 w-16 text-right">{config.blockDuration} m</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">How long the user will be locked out.</p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Lockdown Mode (Panic Button) */}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-bold text-red-700 flex items-center gap-2">
                                    Full Site Maintenance (Lockdown)
                                </h4>
                                <p className="text-xs text-red-600/80 mt-1">
                                    Emergency Only. Makes the public site inaccessible. Admin panel remains working.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer mt-1">
                                <input type="checkbox" className="sr-only peer"
                                    checked={config.maintenanceMode}
                                    onChange={e => setConfig({ ...config, maintenanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={() => setConfig({ maxRefreshes: 5, refreshWindow: 15, blockDuration: 30, enableRefreshCheck: true, enableRateLimit: true, maintenanceMode: false, isActive: true })}
                        className="p-2.5 text-gray-500 hover:bg-white hover:text-gray-700 rounded-lg border border-transparent hover:border-gray-200 transition"
                        title="Reset Defaults"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Rules</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

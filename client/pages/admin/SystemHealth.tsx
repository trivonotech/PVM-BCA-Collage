import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Activity, CheckCircle2, AlertCircle, Server, Zap, AlertTriangle, ExternalLink, ShieldAlert, Settings } from 'lucide-react';
import UsageDetailsModal from '@/components/admin/UsageDetailsModal';
import SecurityConfigModal from '@/components/admin/SecurityConfigModal';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SystemHealth() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
    const [latency, setLatency] = useState<number | null>(null);
    const [recentErrors, setRecentErrors] = useState<any[]>([]);
    const [showUsageModal, setShowUsageModal] = useState(false);
    const [showSecurityConfig, setShowSecurityConfig] = useState(false);

    // Counts for Usage Estimation
    const [counts, setCounts] = useState({
        events: 0,
        students: 0,
        news: 0,
        faculty: 0,
        courses: 0,
        placements: 0
    });

    // Security Switch State
    const [securityEnabled, setSecurityEnabled] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    // Toggle Logic
    const toggleSecurity = async () => {
        try {
            setToggleLoading(true);
            const { setDoc, doc } = await import('firebase/firestore');
            await setDoc(doc(db, 'settings', 'security'), { isActive: !securityEnabled }, { merge: true });
            // State will update via listener below
        } catch (e) {
            console.error(e);
            alert('Failed to toggle security.');
        } finally {
            setToggleLoading(false);
        }
    };

    useEffect(() => {
        // 1. Fetch Analytics for Total Visits (needed for Reads estimate)
        const unsubAnalytics = onSnapshot(doc(db, 'analytics', 'aggregate'), (doc) => {
            if (doc.exists()) {
                setStats(doc.data());
                setDbStatus('online');
            } else {
                setStats({ totalVisits: 0 });
                setDbStatus('online');
            }
            setLoading(false);
        }, () => setDbStatus('offline'));

        // 1.5 Security Setting Listener
        const unsubSecurity = onSnapshot(doc(db, 'settings', 'security'), (snap) => {
            if (snap.exists()) {
                setSecurityEnabled(snap.data().isActive);
            } else {
                // AUTO-INIT: If missing, create default config
                const initConfig = async () => {
                    try {
                        const { setDoc, doc } = await import('firebase/firestore');
                        await setDoc(doc(db, 'settings', 'security'), {
                            isActive: false,
                            config: {
                                maxRefreshes: 5,
                                refreshWindow: 15,
                                blockDuration: 30,
                                enableRefreshCheck: true,
                                enableRateLimit: true
                            }
                        });
                    } catch (e) { console.error("Auto-init failed", e); }
                };
                initConfig();
            }
        });

        // 2. Latency Check
        const checkLatency = async () => {
            const start = performance.now();
            try {
                await getDocs(query(collection(db, 'settings'), limit(1)));
                const end = performance.now();
                setLatency(Math.round(end - start));
            } catch (e) {
                setLatency(null);
            }
        };
        checkLatency();
        const latencyInterval = setInterval(checkLatency, 30000);

        // 3. Recent Errors
        const fetchErrors = async () => {
            try {
                const logsQ = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(10));
                const snap = await getDocs(logsQ);
                setRecentErrors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) { console.error(e); }
        };
        fetchErrors();

        // 4. Fetch Item Counts (One-time fetch for this page)
        const fetchCounts = async () => {
            const getCount = async (col: string) => (await getDocs(collection(db, col))).size;
            const [ev, st, ne, fa, co, pl] = await Promise.all([
                getCount('events'), getCount('students'), getCount('news'),
                getCount('users'), getCount('courses'), getCount('placements')
            ]);
            setCounts({ events: ev, students: st, news: ne, faculty: fa, courses: co, placements: pl });
        };
        fetchCounts();

        return () => {
            unsubAnalytics();
            clearInterval(latencyInterval);
        };
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse">Loading System Status...</div>;

    const getHealthColor = (ms: number | null) => {
        if (!ms) return 'text-red-500';
        if (ms < 200) return 'text-green-500';
        if (ms < 800) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <AdminLayout title="System Health & Performance">
            <div className="space-y-6">
                <UsageDetailsModal
                    isOpen={showUsageModal}
                    onClose={() => setShowUsageModal(false)}
                    counts={{
                        ...counts,
                        totalVisits: stats?.totalVisits || 0
                    }}
                />
                <SecurityConfigModal
                    isOpen={showSecurityConfig}
                    onClose={() => setShowSecurityConfig(false)}
                />

                {/* Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 1. Database Connection */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity className="w-24 h-24 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-700">Connectivity</span>
                        </div>
                        <p className={`text-2xl font-bold ${dbStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                            {dbStatus === 'online' ? 'Operational' : 'Offline'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Firebase Firestore</p>
                    </div>

                    {/* 2. Latency */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-24 h-24 text-yellow-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold text-gray-700">Response Time</span>
                        </div>
                        <p className={`text-2xl font-bold ${getHealthColor(latency)}`}>
                            {latency ? `${latency}ms` : 'Timeout'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Server Latency</p>
                    </div>

                    {/* 3. Security Shield */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldAlert className={`w-24 h-24 ${securityEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className={`w-5 h-5 ${securityEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="font-semibold text-gray-700">Security Shield</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowSecurityConfig(true)}
                                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition"
                                    title="Configure Rules"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                                {/* Toggle Switch */}
                                <button
                                    onClick={toggleSecurity}
                                    disabled={toggleLoading}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${securityEnabled ? 'bg-green-600' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${securityEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                            {securityEnabled ? 'Active' : 'Disabled'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {recentErrors.filter(e => e.message?.toLowerCase().includes('security') || e.message?.toLowerCase().includes('block') || e.message?.toLowerCase().includes('bot')).length} Threats Blocked
                        </p>
                    </div>

                    {/* 4. Usage Limits */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition"
                        onClick={() => setShowUsageModal(true)}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Server className="w-24 h-24 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Server className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-700">Resource Usage</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            View Details <ExternalLink className="w-4 h-4" />
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Storage, Reads & Writes</p>
                    </div>
                </div>

                {/* Error Logs */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-red-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h3 className="font-bold text-gray-800">System Weaknesses & Error Logs</h3>
                        </div>
                        <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {recentErrors.length} Recent
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {recentErrors.length > 0 ? (
                            recentErrors.map((err, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50 transition flex items-start gap-4">
                                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 break-words">{err.message}</p>
                                        <p className="text-xs text-gray-500 mt-1 font-mono">{err.component || 'Unknown Component'}</p>
                                        {err.userAgent && (
                                            <p className="text-[10px] text-gray-400 mt-1 truncate">{err.userAgent}</p>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 whitespace-nowrap">
                                        {err.timestamp?.toDate ? err.timestamp.toDate().toLocaleString() : 'Just now'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">System Healthy</h3>
                                <p className="text-gray-500">No critical errors detected in recent logs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
    doc,
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    setDoc,
    getCountFromServer
} from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    Server,
    Zap,
    AlertTriangle,
    ExternalLink,
    ShieldAlert,
    Settings,
    Database,
    Cpu,
    Network,
    Lock
} from 'lucide-react';
import UsageDetailsModal from '@/components/admin/UsageDetailsModal';
import SecurityConfigModal from '@/components/admin/SecurityConfigModal';
import SessionManagerModal from '@/components/admin/SessionManagerModal';
import AdminLayout from '@/components/admin/AdminLayout';
import { logAdminActivity } from '@/lib/ActivityLogger';

export default function SystemHealth() {
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
    const [latency, setLatency] = useState<number | null>(null);
    const [recentErrors, setRecentErrors] = useState<any[]>([]);
    const [recentSessions, setRecentSessions] = useState<any[]>([]);
    const [showUsageModal, setShowUsageModal] = useState(false);
    const [showSecurityConfig, setShowSecurityConfig] = useState(false);
    const [showSessionManager, setShowSessionManager] = useState(false);

    // Counts for Usage Estimation
    const [counts, setCounts] = useState({
        events: 0,
        students: 0,
        news: 0,
        faculty: 0,
        courses: 0,
        placements: 0
    });

    const [securityEnabled, setSecurityEnabled] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const toggleSecurity = async () => {
        try {
            setToggleLoading(true);
            await setDoc(doc(db, 'settings', 'security'), { isActive: !securityEnabled }, { merge: true });
            toast({
                title: "Security Shield",
                description: `Protection ${!securityEnabled ? 'Activated' : 'Deactivated'}`,
                className: "bg-[#0B0B3B] text-white border-blue-500/50"
            });
            logAdminActivity({
                action: 'SECURITY_TOGGLE',
                target: 'Security Shield',
                details: `${!securityEnabled ? 'Activated' : 'Deactivated'} Security Shield`
            });
        } catch (e) {
            toast({
                title: "Action Failed",
                description: 'Failed to update security parameters.',
                variant: "destructive"
            });
        } finally {
            setToggleLoading(false);
        }
    };

    useEffect(() => {
        // 1. Connectivity & Stats
        const unsubAnalytics = onSnapshot(doc(db, 'analytics', 'aggregate'), (snap) => {
            if (snap.exists()) {
                setStats(snap.data());
                setDbStatus('online');
            } else {
                setStats({ totalVisits: 0 });
                setDbStatus('online');
            }
            setLoading(false);
        }, () => setDbStatus('offline'));

        // 2. Security Configuration
        const unsubSecurity = onSnapshot(doc(db, 'settings', 'security'), (snap) => {
            if (snap.exists()) {
                setSecurityEnabled(snap.data().isActive);
            }
        });

        // 3. Fast Response Check
        const checkLatency = async () => {
            const start = performance.now();
            try {
                await getDocs(query(collection(db, 'settings'), limit(1)));
                setLatency(Math.round(performance.now() - start));
            } catch (e) {
                setLatency(null);
            }
        };
        checkLatency();
        const latencyInterval = setInterval(checkLatency, 30000);

        // 4. Critical Error Logs
        const fetchErrors = async () => {
            try {
                const logsQ = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(5));
                const snap = await getDocs(logsQ);
                setRecentErrors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) { console.error("Error logs fetch failed"); }
        };
        fetchErrors();

        // 5. Active Sessions
        const fetchSessions = async () => {
            try {
                const sessQ = query(collection(db, 'admin_sessions'), orderBy('timestamp', 'desc'), limit(20));
                const snap = await getDocs(sessQ);
                const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

                const active = snap.docs.filter(d => {
                    const data = d.data();
                    const lastActive = data.lastActive?.toDate ? data.lastActive.toDate() : (data.timestamp?.toDate ? data.timestamp.toDate() : new Date());
                    return data.status !== 'revoked' && lastActive > fifteenMinsAgo;
                });
                setRecentSessions(active.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) { console.error("Session monitor failed"); }
        };
        fetchSessions();
        const sessionInterval = setInterval(fetchSessions, 60000);

        // 6. OPTIMIZED: Database Insights using getCountFromServer
        const fetchCounts = async () => {
            const getFastCount = async (col: string) => {
                const snapshot = await getCountFromServer(collection(db, col));
                return snapshot.data().count;
            };

            try {
                const [ev, st, ne, fa, co, pl] = await Promise.all([
                    getFastCount('events'), getFastCount('students'), getFastCount('news'),
                    getFastCount('users'), getFastCount('courses'), getFastCount('placements')
                ]);
                setCounts({ events: ev, students: st, news: ne, faculty: fa, courses: co, placements: pl });
            } catch (e) { console.error("Aggregator failed"); }
        };
        fetchCounts();

        return () => {
            unsubAnalytics();
            unsubSecurity();
            clearInterval(latencyInterval);
            clearInterval(sessionInterval);
        };
    }, []);

    const getLatencyStatus = (ms: number | null) => {
        if (!ms) return { label: 'Offline', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (ms < 150) return { label: 'Optimal', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
        if (ms < 500) return { label: 'Standard', color: 'text-blue-500', bg: 'bg-blue-500/10' };
        return { label: 'Slow', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    };

    const latencyStatus = getLatencyStatus(latency);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <UsageDetailsModal
                    isOpen={showUsageModal}
                    onClose={() => setShowUsageModal(false)}
                    counts={{ ...counts, totalVisits: stats?.totalVisits || 0 }}
                />
                <SecurityConfigModal
                    isOpen={showSecurityConfig}
                    onClose={() => setShowSecurityConfig(false)}
                />
                <SessionManagerModal
                    isOpen={showSessionManager}
                    onClose={() => setShowSessionManager(false)}
                />

                {/* Header with Glassmorphism Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Activity className="w-10 h-10 text-blue-600" />
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Overview</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time infrastructure health and security metrics</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbStatus === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${dbStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wider text-gray-700">Live Services</span>
                    </div>
                </div>

                {/* Performance Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Database Health */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-500/5 border border-blue-50 flex flex-col justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors">
                                <Database className="w-6 h-6 text-blue-600 group-hover:text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${dbStatus === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {dbStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Data Pipeline</p>
                            <h3 className="text-3xl font-black text-gray-800">Operational</h3>
                        </div>
                    </div>

                    {/* Latency */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-500/5 border border-indigo-50 flex flex-col justify-between group hover:border-indigo-200 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                                <Network className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${latencyStatus.bg} ${latencyStatus.color}`}>
                                {latencyStatus.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Response Lag</p>
                            <h3 className="text-3xl font-black text-gray-800">{latency ? `${latency}ms` : '---'}</h3>
                        </div>
                    </div>

                    {/* Security Toggle Card */}
                    <div className="bg-[#0B0B3B] rounded-[2rem] p-6 shadow-2xl border border-white/10 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <ShieldAlert className="w-40 h-40 text-white" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <Lock className="w-6 h-6 text-blue-400" />
                            </div>
                            <button
                                onClick={toggleSecurity}
                                disabled={toggleLoading}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${securityEnabled ? 'bg-blue-500' : 'bg-white/20'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${securityEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="relative z-10 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-bold text-blue-300/50 uppercase tracking-widest mb-1">Shield Status</p>
                                <h3 className="text-3xl font-black text-white">{securityEnabled ? 'Armed' : 'Disarmed'}</h3>
                            </div>
                            <button
                                onClick={() => setShowSecurityConfig(true)}
                                className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Resource Usage */}
                    <div
                        onClick={() => setShowUsageModal(true)}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 shadow-2xl border border-white/10 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg text-white">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Instance Assets</p>
                            <h3 className="text-2xl font-black text-white">Resource Metrics</h3>
                        </div>
                    </div>
                </div>

                {/* Active Sessions Strip */}
                <div
                    onClick={() => setShowSessionManager(true)}
                    className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-500/5 border border-blue-50 flex flex-wrap items-center justify-between gap-6 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Server className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Advanced Fleet Monitor</h3>
                            <p className="text-blue-600 text-sm font-bold flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                {recentSessions.length} Devices active on central grid
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex -space-x-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm tracking-wide group-hover:bg-blue-600 transition-colors">
                            Manage Sessions
                        </div>
                    </div>
                </div>

                {/* Error Console */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-500/5 border border-red-50 overflow-hidden">
                    <div className="p-8 border-b border-red-50 bg-red-50/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">System Vulnerability Logs</h3>
                                <p className="text-sm text-red-600 font-bold uppercase tracking-widest">Live Security Feed</p>
                            </div>
                        </div>
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                            {recentErrors.length} Critical Events
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-20 text-center animate-pulse">
                                <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full mx-auto animate-spin mb-4"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest">Decrypting Logs...</p>
                            </div>
                        ) : recentErrors.length > 0 ? (
                            recentErrors.map((err, idx) => (
                                <div key={idx} className="p-6 hover:bg-red-50/30 transition-all flex items-start gap-4 md:gap-6 group">
                                    <div className="hidden md:block w-1 bg-red-100 group-hover:bg-red-600 transition-colors self-stretch rounded-full"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2.5 py-1 rounded-lg">
                                                {err.component || 'CORE'}
                                            </span>
                                            <div className="flex-1 min-w-[100px] md:min-w-0">
                                                <p className="text-sm font-black text-gray-900 leading-tight line-clamp-2">
                                                    {err.message?.split('\n')[0]}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg">
                                                <Zap className="w-3 h-3 text-red-400" />
                                                {err.timestamp?.toDate ? err.timestamp.toDate().toLocaleString('en-US', {
                                                    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                }) : 'Real-time'}
                                            </div>
                                        </div>

                                        {err.message && err.message.includes('\n') && (
                                            <div className="mt-2 bg-red-50/50 rounded-xl p-3 border border-red-100/50">
                                                <pre className="text-[11px] font-mono text-red-600/80 overflow-x-auto whitespace-pre-wrap max-h-[120px] scrollbar-thin scrollbar-thumb-red-200">
                                                    {err.message}
                                                </pre>
                                            </div>
                                        )}

                                        {!err.message?.includes('\n') && err.message && err.message.length > 100 && (
                                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                                {err.message}
                                            </p>
                                        )}

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-[10px] font-mono text-gray-400 truncate opacity-60 group-hover:opacity-100 transition-opacity max-w-[70%]">
                                                ENV: {err.userAgent || 'Production Environment'}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Unresolved</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-600 transition-all shadow-sm">
                                            <AlertCircle className="w-4 h-4 text-red-600 group-hover:text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Perimeter Secured</h3>
                                <p className="text-gray-500 font-medium">No system anomalies detected in current cycle.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

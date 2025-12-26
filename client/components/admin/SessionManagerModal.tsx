import { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Globe, Clock, LogOut, CheckCircle2, History, ChevronLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

interface SessionManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SessionManagerModal({ isOpen, onClose }: SessionManagerModalProps) {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingActivities, setViewingActivities] = useState<any[] | null>(null);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const { toast } = useToast();
    const currentSessionId = localStorage.getItem('currentSessionId');

    // Helper to safely convert timestamps (Date or Firestore Timestamp)
    const safeDate = (ts: any) => {
        if (!ts) return null;
        if (typeof ts.toDate === 'function') return ts.toDate();
        if (ts instanceof Date) return ts;
        return new Date(ts); // Fallback for strings/numbers
    };

    const formatDate = (ts: any) => {
        const date = safeDate(ts);
        return date ? date.toLocaleString() : 'Just now';
    };

    const formatTime = (ts: any) => {
        const date = safeDate(ts);
        return date ? date.toLocaleTimeString() : 'Just now';
    };

    useEffect(() => {
        if (!isOpen) return;

        const q = query(collection(db, 'admin_sessions'), orderBy('timestamp', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Filter out already revoked sessions from view if desired, or show them as inactive
            setSessions(sessData.filter((s: any) => s.status !== 'revoked'));
            setLoading(false);
        }, (error) => {
            console.error("Failed to fetch sessions:", error);
            // Don't show toast here to avoid spamming if permission denied usually works eventually or silent fail
            setLoading(false);
        });

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            unsubscribe();
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Real-time Activity Listener
    useEffect(() => {
        if (!selectedSession?.id) {
            setViewingActivities(null);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, 'activity_logs'),
            where('sessionId', '==', selectedSession.id),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setViewingActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Activity listener failed", error);
            toast({ title: "Error", description: "Could not sync activity history.", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedSession?.id]);

    const [revokingId, setRevokingId] = useState<string | null>(null);

    const confirmRevoke = async () => {
        if (!revokingId) return;
        const sessionId = revokingId;

        try {
            await updateDoc(doc(db, 'admin_sessions', sessionId), {
                status: 'revoked',
                revokedAt: new Date()
            });
            toast({
                title: "Device Logged Out",
                description: "The session has been revoked. They will be logged out immediately.",
                className: "bg-green-500 text-white border-none",
            });
        } catch (error) {
            console.error("Revoke failed", error);
            toast({
                title: "Action Failed",
                description: "Could not revoke session.",
                variant: "destructive",
            });
        } finally {
            setRevokingId(null);
        }
    };

    const openActivityView = (session: any) => {
        setSelectedSession(session);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Monitor className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Active Sessions</h3>
                            <p className="text-xs text-gray-500">Manage devices logged into Admin Panel</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : viewingActivities ? (
                        /* Activity View */
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={() => { setViewingActivities(null); setSelectedSession(null); }}
                                className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline mb-4"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Sessions
                            </button>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedSession.adminName || 'Admin'}</h4>
                                    <p className="text-xs text-gray-500">{selectedSession.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-blue-600">{selectedSession.device}</p>
                                    <p className="text-[10px] text-gray-400">{selectedSession.ip}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Session Timeline</h5>
                                {viewingActivities.length > 0 ? (
                                    viewingActivities.map((log) => (
                                        <div key={log.id} className="bg-white border border-gray-100 p-3 rounded-xl flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <History className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.action === 'VIEW_PAGE' ? 'bg-gray-100 text-gray-600' :
                                                        log.action === 'CREATE_DATA' ? 'bg-green-100 text-green-700' :
                                                            log.action === 'DELETE_DATA' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {formatTime(log.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-gray-800 mt-1">
                                                    {log.action === 'VIEW_PAGE' ? `Opened ${log.target}` : log.details}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500 italic text-sm">
                                        No actions recorded for this session.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No active sessions found.
                        </div>
                    ) : (
                        sessions.map((session) => {
                            const isCurrent = session.id === currentSessionId;
                            return (
                                <div key={session.id} className={`p-4 rounded-xl border ${isCurrent ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'} transition flex flex-col md:flex-row md:items-center justify-between gap-4 group`}>
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className={`p-3 rounded-xl shrink-0 ${session.device === 'Mobile' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {session.device === 'Mobile' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-gray-800 break-words">
                                                    {session.adminName || 'Admin'}
                                                </h4>
                                                <span className="text-gray-400 text-xs font-normal">({session.device})</span>
                                                {isCurrent && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">This Device</span>}
                                            </div>

                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> {session.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(session.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                    <p className="text-[10px] text-gray-400 font-mono">{session.ip}</p>
                                                    <button
                                                        onClick={() => openActivityView(session)}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap"
                                                    >
                                                        <History className="w-3 h-3" /> Activity
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center md:flex-col md:items-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
                                        {!isCurrent && (
                                            <button
                                                onClick={() => setRevokingId(session.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-xs font-bold border border-red-100 md:opacity-0 md:group-hover:opacity-100 w-full md:w-auto justify-center"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                <span>Logout</span>
                                            </button>
                                        )}

                                        <div className={`flex items-center gap-2 ${!isCurrent ? 'md:group-hover:hidden' : ''}`}>
                                            {isCurrent ? (
                                                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold text-[10px] flex items-center gap-1 border border-green-100">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE NOW
                                                </div>
                                            ) : (() => {
                                                const lastActive = safeDate(session.lastActive) || safeDate(session.timestamp);
                                                const isRecentlyActive = lastActive && (Date.now() - lastActive.getTime() < 15 * 60 * 1000);

                                                return isRecentlyActive ? (
                                                    <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full font-bold text-[10px] flex items-center gap-1 border border-green-100">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> ONLINE
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full font-bold text-[10px] flex items-center gap-1 border border-gray-100">
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full" /> AWAY
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            {/* Clean Custom Confirmation Modal (Overlay) */}
            {revokingId && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-[1px] animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 w-full max-w-sm text-center transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Logout Device?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This will immediately terminate access for this session. Are you sure?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRevokingId(null)}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRevoke}
                                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

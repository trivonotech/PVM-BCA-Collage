import { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Globe, Clock, LogOut, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

interface SessionManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SessionManagerModal({ isOpen, onClose }: SessionManagerModalProps) {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const currentSessionId = localStorage.getItem('currentSessionId');

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
        });

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            unsubscribe();
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleRevokeSession = async (sessionId: string) => {
        if (!confirm("Are you sure you want to log out this device remotely?")) return;

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
        }
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
                        <div className="text-center py-8 text-gray-400">Loading sessions...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No active sessions found.
                        </div>
                    ) : (
                        sessions.map((session) => {
                            const isCurrent = session.id === currentSessionId;
                            return (
                                <div key={session.id} className={`p-4 rounded-xl border ${isCurrent ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'} transition flex items-center justify-between group`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${session.device === 'Mobile' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {session.device === 'Mobile' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800">
                                                    {session.device}
                                                    {isCurrent && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">This Device</span>}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Globe className="w-3 h-3" /> {session.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {session.timestamp?.toDate ? session.timestamp.toDate().toLocaleString() : 'Just now'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 font-mono">{session.ip}</p>
                                        </div>
                                    </div>

                                    {!isCurrent && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium border border-transparent hover:border-red-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    )}
                                    {isCurrent && (
                                        <div className="px-4 py-2 text-green-600 font-medium text-sm flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" /> Active
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

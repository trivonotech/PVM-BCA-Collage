import { useState, useEffect, ReactNode } from 'react';
import { ShieldAlert, Ban } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLocation } from 'react-router-dom';
import MaintenancePage from '@/pages/MaintenancePage';

interface SecurityMonitorProps {
    children: ReactNode;
}

export const SecurityMonitor = ({ children }: SecurityMonitorProps) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    const [config, setConfig] = useState(() => {
        const cached = localStorage.getItem('security_settings_cache');
        return cached ? JSON.parse(cached).config : {
            maxRefreshes: 5,
            refreshWindow: 15,
            blockDuration: 30,
            enableRefreshCheck: true,
            enableRateLimit: true
        };
    });

    const [isActive, setIsActive] = useState(() => {
        const cached = localStorage.getItem('security_settings_cache');
        return cached ? JSON.parse(cached).isActive : false;
    });

    useEffect(() => {
        // Fetch Global Security Setting
        const unsub = onSnapshot(doc(db, 'settings', 'security'), (snap: any) => {
            if (snap.exists()) {
                const data = snap.data();
                setIsActive(data.isActive);
                if (data.config) {
                    setConfig(prev => ({ ...prev, ...data.config }));
                }

                // Update Cache
                localStorage.setItem('security_settings_cache', JSON.stringify({
                    isActive: data.isActive,
                    config: data.config || config
                }));
            }
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        // Check initial block state
        const storedBlock = localStorage.getItem('security_block');
        if (storedBlock) {
            const { expiresAt, reason } = JSON.parse(storedBlock);
            if (Date.now() < expiresAt) {
                setIsBlocked(true);
                setBlockReason(reason);
                setTimeLeft(Math.ceil((expiresAt - Date.now()) / 1000));
            } else {
                localStorage.removeItem('security_block');
            }
        }

        // --- Rate Limiting Logic ---
        if (!isActive) return; // Skip if Security Shield is OFF

        // 1. Refresh Detection
        if (config.enableRefreshCheck) {
            const REFRESH_LIMIT = config.maxRefreshes;
            const TIME_WINDOW = config.refreshWindow * 1000; // ms

            const timestamp = Date.now();
            const storedRefreshes = localStorage.getItem('security_refresh_log');
            let refreshLog: number[] = storedRefreshes ? JSON.parse(storedRefreshes) : [];

            // Filter old timestamps
            refreshLog = refreshLog.filter(t => (timestamp - t) < TIME_WINDOW);
            refreshLog.push(timestamp);

            localStorage.setItem('security_refresh_log', JSON.stringify(refreshLog));

            if (refreshLog.length > REFRESH_LIMIT) {
                triggerBlock("High Rate Traffic (Rapid Refreshing) Detected");
                return;
            }
        }

        let actionCount = 0;
        const LIMIT = 50; // Max actions per 30 seconds
        const INTERVAL = 30000;

        const resetInterval = setInterval(() => {
            actionCount = 0;
        }, INTERVAL);

        const handleActivity = () => {
            if (isBlocked) return;

            actionCount++;
            if (actionCount > LIMIT) {
                triggerBlock("High Rate Traffic / Spamming Detected");
            }
        };

        window.addEventListener('click', handleActivity);
        window.addEventListener('keydown', handleActivity);
        // Tracking Scroll is too sensitive, usually skipped

        return () => {
            clearInterval(resetInterval);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [isBlocked, isActive]);

    // Timer countdown effect
    useEffect(() => {
        if (!isActive) {
            setIsBlocked(false);
            localStorage.removeItem('security_block');
            return;
        }

        if (!isBlocked || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsBlocked(false);
                    localStorage.removeItem('security_block');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isBlocked, timeLeft]);

    const triggerBlock = (reason: string) => {
        const duration = (config.blockDuration || 30) * 60 * 1000; // Dynamic Duration
        const expiresAt = Date.now() + duration;

        localStorage.setItem('security_block', JSON.stringify({
            expiresAt,
            reason
        }));

        setIsBlocked(true);
        setBlockReason(reason);
        setTimeLeft(duration / 1000);

        // Optional: Log this event to 'system_logs' if we had access here, 
        // but let's keep it isolated to avoid loop if DB is the bottleneck.
    };

    // --- Lockdown / Maintenance Mode Enforcement ---
    const location = useLocation();
    if (config.maintenanceMode && !location.pathname.startsWith('/admin')) {
        return <MaintenancePage />;
    }

    if (isBlocked && isActive) {
        return (
            <div className="fixed inset-0 z-[9999] bg-red-950 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="p-6 bg-red-900/50 rounded-full mb-8 animate-pulse">
                    <ShieldAlert className="w-24 h-24 text-red-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-4 tracking-tighter uppercase">
                    Access Denied
                </h1>
                <div className="bg-black/40 p-6 rounded-2xl border border-red-500/30 max-w-lg w-full backdrop-blur-md">
                    <p className="text-xl font-bold text-red-200 mb-2">
                        System Protective Firewall Activated
                    </p>
                    <p className="text-red-300/80 mb-6">
                        {blockReason || "Suspicious traffic pattern detected from this device."}
                    </p>

                    <div className="flex items-center justify-center gap-3 text-red-400 font-mono text-sm bg-black/50 py-2 rounded-lg">
                        <Ban className="w-4 h-4" />
                        <span>IP Block Active for: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
                    </div>
                </div>
                <p className="mt-8 text-red-800 text-sm max-w-md">
                    Your actions triggered our automated defense system.
                    Please stop rapid refreshing or automated requests.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};

import { Server, Database, HardDrive, Wifi, Info } from 'lucide-react';
import { useEffect } from 'react';

interface UsageDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    counts: {
        events: number;
        students: number;
        news: number;
        faculty: number;
        courses: number;
        placements: number;
        totalVisits: number;
    };
}

export default function UsageDetailsModal({ isOpen, onClose, counts }: UsageDetailsModalProps) {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Spark Plan (Free) Limits
    const LIMITS = {
        reads: 50000,
        writes: 20000,
        storageMB: 1024, // 1 GB
        bandwidthGB: 10 // 10 GB
    };

    // Estimates
    // Reads: Visits * 8 (Home + 4 widgets + Auth + etc)
    const estReads = (counts.totalVisits || 0) * 8;

    // Writes: Total items created * 3 (Create + Update + Delete checks)
    const totalDocs = counts.events + counts.students + counts.news + counts.faculty + (counts.courses || 0) + (counts.placements || 0);

    // Storage: Avg image size 0.5MB * total items with images (events/students/news/courses/placements)
    // We assume most docs have an image or associated data
    const estStorageMB = (totalDocs * 0.5).toFixed(1);

    const getPercentage = (val: number, limit: number) => Math.min((val / limit) * 100, 100);

    const UsageBar = ({ label, icon: Icon, val, limit, unit, color }: any) => {
        const pct = getPercentage(val, limit);
        return (
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <span className="font-medium text-sm">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                        {val.toLocaleString()} / {limit.toLocaleString()} {unit}
                    </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? 'bg-red-500' : clsFromColor(color)}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">{pct.toFixed(1)}% Used</p>
            </div>
        );
    };

    const clsFromColor = (c: string) => {
        if (c.includes('purple')) return 'bg-purple-500';
        if (c.includes('blue')) return 'bg-blue-500';
        if (c.includes('orange')) return 'bg-orange-500';
        if (c.includes('green')) return 'bg-green-500';
        return 'bg-gray-500';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Server className="w-5 h-5 text-green-400" />
                            Firebase Limits
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Daily Quota & Storage usage (Spark Plan)</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        ✖
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-700">
                            These are <strong>estimates</strong> based on your content.
                            Resets every day at midnight (Pacific Time).
                        </p>
                    </div>

                    <UsageBar
                        label="Firestore Reads (Daily)"
                        icon={Database}
                        val={estReads}
                        limit={LIMITS.reads}
                        unit="ops"
                        color="text-blue-500"
                    />

                    <UsageBar
                        label="Firestore Writes (Daily)"
                        icon={Database}
                        val={totalDocs * 2} /* Rough estimate */
                        limit={LIMITS.writes}
                        unit="ops"
                        color="text-orange-500"
                    />

                    <UsageBar
                        label="Storage (Total)"
                        icon={HardDrive}
                        val={Number(estStorageMB)}
                        limit={LIMITS.storageMB}
                        unit="MB"
                        color="text-purple-500"
                    />

                    <UsageBar
                        label="Network Bandwidth"
                        icon={Wifi}
                        val={0.5} /* Hard to calc, mock low usage */
                        limit={LIMITS.bandwidthGB}
                        unit="GB"
                        color="text-green-500"
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white py-2 rounded-xl font-semibold hover:bg-black transition"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

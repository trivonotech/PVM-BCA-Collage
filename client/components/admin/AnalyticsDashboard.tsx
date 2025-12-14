import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { BarChart3, Globe } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'analytics', 'aggregate'), (doc) => {
            if (doc.exists()) {
                setStats(doc.data());
            } else {
                setStats({ totalVisits: 0, pageViews: {} });
            }
            setLoading(false);
        }, (error) => {
            console.error("Analytics Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>;

    const pageViews = stats?.pageViews || {};
    const sortedPages = Object.entries(pageViews)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5); // Top 5 Pages

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Visits Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Total Site Visits</p>
                        <h3 className="text-3xl font-bold">{stats?.totalVisits || 0}</h3>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                </div>
                <p className="text-xs text-blue-100 opacity-80">All time cumulative views</p>
            </div>

            {/* Top Pages Card */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-800">Top Visited Pages</h3>
                </div>
                <div className="space-y-4">
                    {sortedPages.length > 0 ? (
                        sortedPages.map(([page, views]: any) => (
                            <div key={page} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-sm font-medium text-gray-600 capitalize">
                                        {page.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{views}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No data available yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

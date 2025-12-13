import AdminLayout from '@/components/admin/AdminLayout';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDocs, limit, where } from 'firebase/firestore';
import {
    Calendar,
    Trophy,
    Dumbbell,
    Lightbulb,
    Newspaper,
    Users,
    Award,
    Briefcase,
    TrendingUp,
} from 'lucide-react';

interface Activity {
    id: string;
    action: string;
    item: string;
    time: string;
    type: 'event' | 'student' | 'workshop' | 'news' | 'achievement' | 'placement';
    timestamp: any;
}

export default function AdminDashboard() {
    const [counts, setCounts] = useState({
        events: 0,
        sports: 0,
        workshops: 0,
        news: 0,
        students: 0,
        faculty: 0,
    });
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Snapshot for Counts & Activity
        // We can use onSnapshot for real-time updates or getDocs for one-time fetch.
        // For dashboard, real-time is nice.

        const unsubs: (() => void)[] = [];

        // Events
        const eventsQ = query(collection(db, 'events'));
        unsubs.push(onSnapshot(eventsQ, (snap) => {
            const allEvents = snap.docs.map(d => d.data());
            setCounts(prev => ({
                ...prev,
                events: snap.size,
                sports: allEvents.filter(e => e.category === 'Sports').length,
                workshops: allEvents.filter(e => e.category === 'Workshop').length
            }));
        }));

        // News
        const newsQ = query(collection(db, 'news'));
        unsubs.push(onSnapshot(newsQ, (snap) => {
            setCounts(prev => ({ ...prev, news: snap.size }));
        }));

        // Top Students
        const studentsQ = query(collection(db, 'students'));
        unsubs.push(onSnapshot(studentsQ, (snap) => {
            setCounts(prev => ({ ...prev, students: snap.size }));
        }));

        // Users (Faculty/Admin)
        const usersQ = query(collection(db, 'users'));
        unsubs.push(onSnapshot(usersQ, (snap) => {
            setCounts(prev => ({ ...prev, faculty: snap.size }));
        }));

        return () => unsubs.forEach(u => u());
    }, []);

    // Fetch Recent Activity (Combining Events and News for now)
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Fetch last 5 events
                const eventsQ = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(5));
                const eventsSnap = await getDocs(eventsQ);
                const eventsData = eventsSnap.docs.map(doc => ({
                    id: doc.id,
                    action: 'New event added',
                    item: doc.data().name,
                    time: new Date(doc.data().createdAt).toLocaleDateString(),
                    type: 'event' as const,
                    timestamp: new Date(doc.data().createdAt)
                }));

                // Fetch last 5 news
                const newsQ = query(collection(db, 'news'), orderBy('submittedAt', 'desc'), limit(5));
                const newsSnap = await getDocs(newsQ);
                const newsData = newsSnap.docs.map(doc => ({
                    id: doc.id,
                    action: 'News published',
                    item: doc.data().title,
                    time: doc.data().submittedAt?.toDate?.().toLocaleDateString() || 'Recently',
                    type: 'news' as const,
                    timestamp: doc.data().submittedAt?.toDate?.() || new Date()
                }));

                const combined = [...eventsData, ...newsData]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 5);

                setRecentActivity(combined);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            }
        };

        fetchActivity();
        // Since this is just a quick fetch, we won't make it real-time to avoid complex merging logic on every snapshot for now.
        // Or we could trigger this when counts change.
    }, [counts.events, counts.news]);


    const stats = [
        { icon: Calendar, label: 'Total Events', value: counts.events.toString(), color: 'bg-blue-500', change: 'Live' },
        { icon: Trophy, label: 'Top Students', value: counts.students.toString(), color: 'bg-yellow-500', change: 'Live' },
        { icon: Dumbbell, label: 'Sports', value: counts.sports.toString(), color: 'bg-green-500', change: 'Live' },
        { icon: Lightbulb, label: 'Workshops', value: counts.workshops.toString(), color: 'bg-purple-500', change: 'Live' },
        { icon: Newspaper, label: 'News Articles', value: counts.news.toString(), color: 'bg-red-500', change: 'Live' },
        { icon: Users, label: 'Total Admins/Users', value: counts.faculty.toString(), color: 'bg-indigo-500', change: 'Live' },
        { icon: Award, label: 'Achievements', value: '56', color: 'bg-pink-500', change: 'Static' }, // Static for now
        { icon: Briefcase, label: 'Placements', value: '89', color: 'bg-orange-500', change: 'Static' }, // Static for now
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your website.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Add New Event
                            </button>
                            <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                <Newspaper className="w-5 h-5" />
                                Publish News
                            </button>
                            <button className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                Create Workshop
                            </button>
                            <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Add Placement
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'event' ? 'bg-blue-500' :
                                        activity.type === 'student' ? 'bg-yellow-500' :
                                            activity.type === 'workshop' ? 'bg-purple-500' :
                                                activity.type === 'news' ? 'bg-red-500' : 'bg-pink-500'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">{activity.action}</p>
                                        <p className="text-gray-600 text-sm">{activity.item}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">System Status</h3>
                            <p className="text-blue-100">All systems operational • Firebase ready for integration</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

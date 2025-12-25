import { ReactNode, useState, useEffect, useRef, useLayoutEffect, UIEvent } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Trophy,
    Dumbbell,
    Lightbulb,
    Newspaper,
    Users,
    GraduationCap,
    Award,
    Briefcase,
    BookOpen,
    Eye,
    Settings,
    Menu,
    LogOut,
    FileText,
    Mail,
    Activity,
    X,
    ShieldAlert,
    Layout,
    School,
    MessageSquare,
    Search,
} from 'lucide-react';


import SessionExpiredModal from './SessionExpiredModal';
import { logAdminActivity } from '@/lib/ActivityLogger';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSessionRevoked, setIsSessionRevoked] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', permission: 'dashboard' },
        { icon: Calendar, label: 'Events', path: '/admin/events', permission: 'events' },
        { icon: Trophy, label: 'Top Students', path: '/admin/students', permission: 'students' },
        { icon: School, label: 'Admissions', path: '/admin/admissions', permission: 'admissions' },
        { icon: Dumbbell, label: 'Sports', path: '/admin/sports', permission: 'sports' },
        { icon: Lightbulb, label: 'Workshops', path: '/admin/workshops', permission: 'workshops' },
        { icon: Newspaper, label: 'News', path: '/admin/news', permission: 'news' },
        { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries', permission: 'inquiries' },
        { icon: Mail, label: 'Subscribers', path: '/admin/subscribers', permission: 'subscribers' },
        { icon: Users, label: 'Faculty', path: '/admin/faculty', permission: 'faculty' },
        { icon: Award, label: 'Achievements', path: '/admin/achievements', permission: 'achievements' },
        { icon: Briefcase, label: 'Placements', path: '/admin/placements', permission: 'placements' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses', permission: 'courses' },
        { icon: Eye, label: 'Section Visibility', id: 'visibility', path: '/admin/visibility', permission: 'visibility' },
        { icon: Users, label: 'User Management', path: '/admin/users', permission: 'user_management' },
        { icon: Layout, label: 'Page Content', path: '/admin/pages', permission: 'pages' },
        { icon: Settings, label: 'Settings', id: 'settings', path: '/admin/settings', permission: 'settings' },
        { icon: Search, label: 'SEO Manager', path: '/admin/seo', permission: 'seo' },
        { icon: Activity, label: 'System Health', id: 'system', path: '/admin/system', permission: 'system_health' },
    ];

    // State for user data to handle real-time updates
    const [user, setUser] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    const handleLogout = () => {
        const sessionId = localStorage.getItem('currentSessionId');
        logAdminActivity({
            action: 'AUTH_EVENT',
            target: 'Logout',
            details: 'Admin logged out manually'
        });
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('currentSessionId');
        navigate('/admin/login');
    };

    // Session Revocation Listener
    useEffect(() => {
        const sessionId = localStorage.getItem('currentSessionId');
        if (!sessionId) return;

        const unsubSession = onSnapshot(doc(db, 'admin_sessions', sessionId), (snap) => {
            if (snap.exists() && snap.data().status === 'revoked') {
                setIsSessionRevoked(true);
            }
        });
        return () => unsubSession();
    }, []);

    // Session Activity Tracker (lastActive)
    useEffect(() => {
        const sessionId = localStorage.getItem('currentSessionId');
        if (!sessionId) return;

        const updateActivity = async () => {
            try {
                await updateDoc(doc(db, 'admin_sessions', sessionId), {
                    lastActive: new Date()
                });
            } catch (e) {
                console.error("Failed to update activity", e);
            }
        };

        // Initial update
        updateActivity();

        // Update every 5 minutes
        const interval = setInterval(updateActivity, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Track Page Views
    useEffect(() => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        if (currentItem) {
            logAdminActivity({
                action: 'VIEW_PAGE',
                target: currentItem.label,
                details: `Visited ${location.pathname}`
            });
        }
    }, [location.pathname]);

    // Real-time listener for user permissions
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.data();
                // Create updated user object
                const updatedUser = {
                    ...user,
                    ...userData,
                    // Ensure local fields like uid don't get overwritten if missing in doc (usually they are consistent)
                };

                // Only update if changes detected to avoid loops (though onSnapshot is usually smart)
                if (JSON.stringify(updatedUser.permissions) !== JSON.stringify(user.permissions) ||
                    updatedUser.role !== user.role) {
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            } else {
                // User document deleted (ban/remove)
                handleLogout();
            }
        });

        return () => unsubscribe();

    }, [user?.uid]); // Only re-subscribe if UID changes (e.g. login)

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const sidebarRef = useRef<HTMLElement>(null);

    // Restore sidebar scroll position
    useLayoutEffect(() => {
        const savedScroll = sessionStorage.getItem('adminSidebarScroll');
        if (sidebarRef.current && savedScroll) {
            sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
        }
    }, []);

    // Save scroll position immediately when scrolling
    const handleSidebarScroll = (e: UIEvent<HTMLElement>) => {
        sessionStorage.setItem('adminSidebarScroll', e.currentTarget.scrollTop.toString());
    };

    const userPermissions = user?.permissions || [];
    const isSuperAdmin = user?.role === 'super_admin';

    const filteredMenuItems = menuItems.filter(item => {
        if (isSuperAdmin) return true;
        if (userPermissions.includes('all')) return true;
        return userPermissions.includes(item.permission);
    });

    // If session is revoked, ONLY render the security modal, blocking everything else
    if (isSessionRevoked) {
        return (
            <SessionExpiredModal
                isOpen={true}
                onConfirm={handleLogout}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0B0B3B] text-white px-4 py-3 flex items-center justify-between z-50">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-[#0B0B3B] text-white w-64 transform transition-transform duration-300 z-40 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-700 flex-shrink-0">
                    <h1 className="text-2xl font-bold text-white">PVM BCA</h1>
                    <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide overscroll-contain"
                    ref={sidebarRef}
                    onScroll={handleSidebarScroll}
                >
                    <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-4 lg:p-8">
                    {(() => {
                        // Route Security Check
                        const routePermissions: Record<string, string> = {
                            '/admin': 'dashboard', // Explicitly protect dashboard
                            '/admin/events': 'events',
                            '/admin/students': 'students',
                            '/admin/admissions': 'admissions',
                            '/admin/subscribers': 'subscribers',
                            '/admin/sports': 'sports',
                            '/admin/workshops': 'workshops',
                            '/admin/news': 'news',
                            '/admin/inquiries': 'inquiries',
                            '/admin/faculty': 'faculty',
                            '/admin/achievements': 'achievements',
                            '/admin/placements': 'placements',
                            '/admin/courses': 'courses',
                            '/admin/pages': 'pages',
                            '/admin/visibility': 'visibility',
                            '/admin/users': 'user_management',
                            '/admin/settings': 'settings',
                            '/admin/seo': 'seo'
                        };

                        let hasAccess = true;
                        if (!isSuperAdmin && !userPermissions.includes('all')) {
                            // Find the most specific (longest) matching route
                            const matchedRoute = Object.entries(routePermissions)
                                .sort((a, b) => b[0].length - a[0].length) // Sort by length desc
                                .find(([route]) =>
                                    location.pathname === route || location.pathname.startsWith(route + '/')
                                );

                            if (matchedRoute) {
                                const requiredPermission = matchedRoute[1];
                                if (!userPermissions.includes(requiredPermission)) {
                                    hasAccess = false;
                                }
                            }
                        }

                        if (!hasAccess) {
                            return (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                                    <div className="bg-red-50 p-6 rounded-full mb-6">
                                        <ShieldAlert className="w-16 h-16 text-red-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
                                    <p className="text-gray-600 max-w-md mb-8">
                                        You do not have permission to access the <strong>{location.pathname}</strong> section.
                                        Please contact the Super Admin if you believe this is an error.
                                    </p>
                                    <button
                                        onClick={() => navigate(filteredMenuItems[0]?.path || '/admin/login')}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        Return to {filteredMenuItems[0]?.label || 'Login'}
                                    </button>
                                </div>
                            );
                        }

                        return children;
                    })()}
                </div>
            </main>
        </div>
    );
}

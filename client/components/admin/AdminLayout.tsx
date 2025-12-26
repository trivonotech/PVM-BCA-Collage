import { ReactNode, useState, useEffect, useRef, useLayoutEffect, UIEvent } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, query, collection, where, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
    Database,
} from 'lucide-react';


import SessionExpiredModal from './SessionExpiredModal';
import { logAdminActivity } from '@/lib/ActivityLogger';
import { CONFIG } from '@/lib/config';
import AdminSidebar from './AdminSidebar';

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
        { icon: Database, label: 'Data Backup', path: '/admin/backup', permission: 'backup' },
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

    // Verify Firebase Auth state (Project change detection)
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (!fbUser && isAuthenticated) {
                console.warn("Firebase Auth session invalid for this project. Logging out...");
                handleLogout();
            }
        });
        return () => unsubscribeAuth();
    }, []);

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
                    // Ensure local fields like uid don't get overwritten if missing in doc
                };

                // Only update if changes detected
                if (JSON.stringify(updatedUser.permissions) !== JSON.stringify(user.permissions) ||
                    updatedUser.role !== user.role) {
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            } else {
                // User document missing.

                // SECURITY CHECK: Only Super Admin can enter "Migration Mode" (Empty DB)
                // Everyone else gets booted out.
                if (user?.email === CONFIG.SUPER_ADMIN_EMAIL) {
                    // Check for ORPHANED PROFILE (Different UID from old database)
                    // If we find a user doc with same email but different ID, migrate it to current UID.
                    (async () => {
                        const q = query(collection(db, 'users'), where('email', '==', user.email));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            const oldDoc = querySnapshot.docs[0];
                            if (oldDoc.id !== user.uid) {
                                console.log("Migration: Linking old admin profile to new UID...");
                                const oldData = oldDoc.data();
                                // 1. Create new doc with current UID
                                await setDoc(doc(db, 'users', user.uid), { ...oldData, uid: user.uid });
                                // 2. Delete old doc
                                await deleteDoc(doc(db, 'users', oldDoc.id));
                                console.log("Migration: Profile linked successfully.");
                                return; // Listener will re-trigger
                            }
                        }

                        console.warn("Super Admin recognized. Entering Migration Mode (Profile Missing).");
                        // Grant temporary access ONLY to Backup (to restore data)
                        const migrationUser = { ...user, permissions: ['backup'], role: 'migration' };
                        // FIXED: Check both role and permissions
                        if (user.role !== 'migration' || JSON.stringify(migrationUser.permissions) !== JSON.stringify(user.permissions)) {
                            setUser(migrationUser);
                            localStorage.setItem('user', JSON.stringify(migrationUser));
                            // Redirect to backup if not already there
                            if (location.pathname !== '/admin/backup') {
                                navigate('/admin/backup');
                            }
                        }
                    })();
                } else {
                    // Strict Security for everyone else
                    console.warn("Security Access Denied: Profile missing for non-super admin.");
                    handleLogout();
                }
            }
        }, (error) => {
            console.warn("Permission listener failed (likely empty DB rules):", error);
            // FAIL-SAFE: If rules are blocking us, and we are the Super Admin, assume we are in Migration Mode
            if (user?.email === CONFIG.SUPER_ADMIN_EMAIL) {
                const migrationUser = { ...user, permissions: ['backup'], role: 'migration' };
                if (user.role !== 'migration') {
                    setUser(migrationUser);
                    localStorage.setItem('user', JSON.stringify(migrationUser));
                }
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

    // FOOLPROOF MIGRATION LOCKDOWN: If role is migration, ONLY show backup.
    const isMigrationMode = user?.role === 'migration' || (userPermissions.length === 1 && userPermissions[0] === 'backup');

    const filteredMenuItems = menuItems.filter(item => {
        if (isMigrationMode) return item.permission === 'backup';
        if (isSuperAdmin && !isMigrationMode) return true;
        if (userPermissions.includes('all')) return true;
        return userPermissions.includes(item.permission);
    });

    // Forced Redirect if on unauthorized page during migration
    useEffect(() => {
        if (isMigrationMode && location.pathname !== '/admin/backup') {
            navigate('/admin/backup');
        }
    }, [isMigrationMode, location.pathname]);

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
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                filteredMenuItems={filteredMenuItems}
                handleLogout={handleLogout}
                sidebarRef={sidebarRef}
                handleSidebarScroll={handleSidebarScroll}
            />

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
                            '/admin/seo': 'seo',
                            '/admin/backup': 'backup'
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

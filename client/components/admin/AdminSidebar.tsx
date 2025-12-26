import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, LucideIcon } from 'lucide-react';
import { CONFIG } from '@/lib/config';
import { UIEvent, RefObject } from 'react';

interface MenuItem {
    icon: LucideIcon;
    label: string;
    path: string;
    permission: string;
}

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    filteredMenuItems: MenuItem[];
    handleLogout: () => void;
    sidebarRef: RefObject<HTMLElement>;
    handleSidebarScroll: (e: UIEvent<HTMLElement>) => void;
}

export default function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    filteredMenuItems,
    handleLogout,
    sidebarRef,
    handleSidebarScroll
}: AdminSidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-[#0B0B3B] text-white w-64 transform transition-transform duration-300 z-40 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">{CONFIG.APP_NAME}</h1>
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
    );
}
